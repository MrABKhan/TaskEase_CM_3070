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

export interface WellnessMetrics {
  stressLevel: {
    current: number;  // 0-100 scale
    trend: 'increasing' | 'decreasing' | 'stable';
    history: {
      date: string;
      value: number;
    }[];
  };
  workLifeBalance: {
    score: number;  // 0-100 scale
    workPercentage: number;
    personalPercentage: number;
    history: {
      date: string;
      workPercentage: number;
      personalPercentage: number;
    }[];
  };
  breakCompliance: {
    score: number;  // 0-100 scale
    breaksPlanned: number;
    breaksTaken: number;
    averageDuration: number;  // in minutes
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

export const calculateWellnessMetrics = async (userId: string): Promise<WellnessMetrics> => {
  const endDate = new Date();
  const startDate = subDays(endDate, 14); // Get last 14 days

  const tasks = await Task.find({
    userId,
    date: {
      $gte: startOfDay(startDate),
      $lte: endOfDay(endDate)
    }
  });

  // Initialize wellness metrics
  const wellnessMetrics: WellnessMetrics = {
    stressLevel: {
      current: 0,
      trend: 'stable',
      history: []
    },
    workLifeBalance: {
      score: 0,
      workPercentage: 0,
      personalPercentage: 0,
      history: []
    },
    breakCompliance: {
      score: 0,
      breaksPlanned: 0,
      breaksTaken: 0,
      averageDuration: 0
    }
  };

  // Group tasks by date
  const tasksByDate: Record<string, any[]> = {};
  tasks.forEach(task => {
    const dateStr = format(new Date(task.date), 'yyyy-MM-dd');
    if (!tasksByDate[dateStr]) {
      tasksByDate[dateStr] = [];
    }
    tasksByDate[dateStr].push(task);
  });

  // Calculate metrics for each day
  const dates = Object.keys(tasksByDate).sort();
  
  // Process each day's data
  dates.forEach(date => {
    const dayTasks = tasksByDate[date];
    
    // Calculate stress level based on task density, priority, and completion rate
    let stressScore = 0;
    let workTasks = 0;
    let personalTasks = 0;
    
    dayTasks.forEach(task => {
      // Stress calculation factors:
      // 1. Task priority (high: +3, medium: +2, low: +1)
      // 2. Completion status (incomplete high priority: +2)
      // 3. Task density (number of tasks per day)
      
      const priorityScore = task.priority === 'high' ? 3 : task.priority === 'medium' ? 2 : 1;
      stressScore += priorityScore;
      
      if (!task.completed && task.priority === 'high') {
        stressScore += 2;
      }
      
      // Work-life balance calculation
      if (['work', 'study'].includes(task.category)) {
        workTasks++;
      } else {
        personalTasks++;
      }
    });
    
    // Normalize stress score to 0-100 scale
    // Base stress from number of tasks (0-10 tasks: 0-50, >10 tasks: 50-70)
    const baseDensityStress = Math.min(dayTasks.length * 5, 70);
    
    // Additional stress from priority and completion factors (0-30)
    const maxPossibleStressScore = dayTasks.length * 5; // Maximum possible stress score
    const normalizedAdditionalStress = maxPossibleStressScore > 0 
      ? (stressScore / maxPossibleStressScore) * 30 
      : 0;
    
    const totalStress = Math.min(baseDensityStress + normalizedAdditionalStress, 100);
    
    // Add to history
    wellnessMetrics.stressLevel.history.push({
      date,
      value: totalStress
    });
    
    // Calculate work-life balance
    const totalTasks = workTasks + personalTasks;
    const workPercentage = totalTasks > 0 ? (workTasks / totalTasks) * 100 : 50;
    const personalPercentage = totalTasks > 0 ? (personalTasks / totalTasks) * 100 : 50;
    
    wellnessMetrics.workLifeBalance.history.push({
      date,
      workPercentage,
      personalPercentage
    });
  });
  
  // Calculate current stress level (average of last 3 days or available days)
  const recentStressHistory = wellnessMetrics.stressLevel.history.slice(-3);
  if (recentStressHistory.length > 0) {
    const sum = recentStressHistory.reduce((acc, day) => acc + day.value, 0);
    wellnessMetrics.stressLevel.current = Math.round(sum / recentStressHistory.length);
  }
  
  // Calculate stress trend
  if (wellnessMetrics.stressLevel.history.length >= 2) {
    const lastWeek = wellnessMetrics.stressLevel.history.slice(-7);
    const firstHalf = lastWeek.slice(0, Math.ceil(lastWeek.length / 2));
    const secondHalf = lastWeek.slice(Math.ceil(lastWeek.length / 2));
    
    const firstHalfAvg = firstHalf.length > 0 
      ? firstHalf.reduce((acc, day) => acc + day.value, 0) / firstHalf.length 
      : 0;
    const secondHalfAvg = secondHalf.length > 0 
      ? secondHalf.reduce((acc, day) => acc + day.value, 0) / secondHalf.length 
      : 0;
    
    const difference = secondHalfAvg - firstHalfAvg;
    
    if (difference > 5) {
      wellnessMetrics.stressLevel.trend = 'increasing';
    } else if (difference < -5) {
      wellnessMetrics.stressLevel.trend = 'decreasing';
    } else {
      wellnessMetrics.stressLevel.trend = 'stable';
    }
  }
  
  // Calculate work-life balance score
  if (wellnessMetrics.workLifeBalance.history.length > 0) {
    const recentHistory = wellnessMetrics.workLifeBalance.history.slice(-7);
    let totalWorkPercentage = 0;
    let totalPersonalPercentage = 0;
    
    recentHistory.forEach(day => {
      totalWorkPercentage += day.workPercentage;
      totalPersonalPercentage += day.personalPercentage;
    });
    
    const avgWorkPercentage = recentHistory.length > 0 
      ? totalWorkPercentage / recentHistory.length 
      : 50;
    const avgPersonalPercentage = recentHistory.length > 0 
      ? totalPersonalPercentage / recentHistory.length 
      : 50;
    
    wellnessMetrics.workLifeBalance.workPercentage = Math.round(avgWorkPercentage);
    wellnessMetrics.workLifeBalance.personalPercentage = Math.round(avgPersonalPercentage);
    
    // Calculate balance score (100 = perfect balance at 50/50, 0 = complete imbalance)
    // The closer to 50/50 split, the higher the score
    const balanceDeviation = Math.abs(avgWorkPercentage - 50);
    wellnessMetrics.workLifeBalance.score = Math.round(100 - (balanceDeviation * 2));
  }
  
  // For now, set placeholder values for break compliance
  // This will be implemented in the next phase
  wellnessMetrics.breakCompliance = {
    score: 70,
    breaksPlanned: 5,
    breaksTaken: 3,
    averageDuration: 15
  };
  
  return wellnessMetrics;
}; 