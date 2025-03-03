import { startOfDay, endOfDay, subDays, format, parseISO } from 'date-fns';
import Task from '../models/Task';

export interface ActivityMetrics {
  dailyActivity: {
    date: string;
    timeSlots: {
      slot: string;
      intensity: number;
      tasksCount: number;
      completedCount: number;
    }[];
  }[];
  mostProductiveTime: {
    slot: string;
    completionRate: number;
  };
  mostProductiveDay: {
    day: string;
    completionRate: number;
  };
}

const TIME_SLOTS = [
  '6AM-9AM', '9AM-12PM', '12PM-3PM', '3PM-6PM', '6PM-9PM', '9PM-12AM'
];

const getTimeSlot = (time: string): string => {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 6 && hour < 9) return '6AM-9AM';
  if (hour >= 9 && hour < 12) return '9AM-12PM';
  if (hour >= 12 && hour < 15) return '12PM-3PM';
  if (hour >= 15 && hour < 18) return '3PM-6PM';
  if (hour >= 18 && hour < 21) return '6PM-9PM';
  if (hour >= 21 || hour < 0) return '9PM-12AM';
  return '12AM-6AM'; // Default slot for early morning
};

export const calculateActivityMetrics = async (userId: string): Promise<ActivityMetrics> => {
  const endDate = new Date();
  const startDate = subDays(endDate, 14); // Get last 14 days

  const tasks = await Task.find({
    userId,
    date: {
      $gte: startOfDay(startDate),
      $lte: endOfDay(endDate)
    }
  });

  // Initialize daily activity structure
  const dailyActivity = Array.from({ length: 14 }, (_, index) => {
    const date = subDays(endDate, 13 - index);
    return {
      date: format(date, 'yyyy-MM-dd'),
      timeSlots: TIME_SLOTS.map(slot => ({
        slot,
        intensity: 0,
        tasksCount: 0,
        completedCount: 0
      }))
    };
  });

  // Track slot statistics for finding most productive time
  const slotStats: Record<string, { total: number; completed: number }> = {};
  const dayStats: Record<string, { total: number; completed: number }> = {};

  // First pass: collect all stats
  tasks.forEach(task => {
    const taskDate = format(new Date(task.date), 'yyyy-MM-dd');
    const timeSlot = getTimeSlot(task.startTime);
    const dayOfWeek = format(new Date(task.date), 'EEEE');
    
    // Update daily activity
    const dayActivity = dailyActivity.find(day => day.date === taskDate);
    if (dayActivity) {
      const slot = dayActivity.timeSlots.find(s => s.slot === timeSlot);
      if (slot) {
        slot.tasksCount++;
        if (task.completed) {
          slot.completedCount++;
        }
      }
    }

    // Update slot statistics
    if (!slotStats[timeSlot]) {
      slotStats[timeSlot] = { total: 0, completed: 0 };
    }
    slotStats[timeSlot].total++;
    if (task.completed) {
      slotStats[timeSlot].completed++;
    }

    // Update day statistics
    if (!dayStats[dayOfWeek]) {
      dayStats[dayOfWeek] = { total: 0, completed: 0 };
    }
    dayStats[dayOfWeek].total++;
    if (task.completed) {
      dayStats[dayOfWeek].completed++;
    }
  });

  // Find the 75th percentile of tasks per slot for more realistic normalization
  const allTaskCounts = dailyActivity.flatMap(day => 
    day.timeSlots.map(slot => slot.tasksCount)
  ).sort((a, b) => a - b);
  
  const p75Index = Math.floor(allTaskCounts.length * 0.75);
  const normalizeTarget = Math.max(
    allTaskCounts[p75Index] || 1,
    2 // Minimum normalization target to prevent over-inflation with very sparse data
  );

  // Second pass: calculate normalized intensities
  dailyActivity.forEach(day => {
    day.timeSlots.forEach(slot => {
      if (slot.tasksCount === 0) {
        slot.intensity = 0;
        return;
      }

      // Calculate completion rate with a minimum task threshold
      const completionRate = slot.tasksCount >= 1 ? 
        slot.completedCount / slot.tasksCount : 0;

      // Normalize task count relative to 75th percentile
      const normalizedTaskCount = Math.min(slot.tasksCount / normalizeTarget, 1);

      // Weight both factors:
      // - Task presence (30%): Just having tasks in this slot indicates some activity
      // - Completion success (70%): Higher weight for actually completing tasks
      slot.intensity = (normalizedTaskCount * 0.3) + (completionRate * 0.7);
    });
  });

  // Calculate most productive time based on consistent completion
  let mostProductiveTime = { slot: '', completionRate: 0 };
  Object.entries(slotStats).forEach(([slot, stats]) => {
    const completionRate = stats.total >= 3 ? // Require minimum 3 tasks for significance
      (stats.completed / stats.total) * 100 : 0;
    
    if (completionRate > (mostProductiveTime.completionRate || 0)) {
      mostProductiveTime = { slot, completionRate };
    }
  });

  // Calculate most productive day based on consistent completion
  let mostProductiveDay = { day: '', completionRate: 0 };
  Object.entries(dayStats).forEach(([day, stats]) => {
    const completionRate = stats.total >= 3 ? // Require minimum 3 tasks for significance
      (stats.completed / stats.total) * 100 : 0;
    
    if (completionRate > (mostProductiveDay.completionRate || 0)) {
      mostProductiveDay = { day, completionRate };
    }
  });

  return {
    dailyActivity,
    mostProductiveTime,
    mostProductiveDay
  };
}; 