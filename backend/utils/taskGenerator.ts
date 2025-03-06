import { addDays, addMonths, startOfDay, isWeekend, format } from 'date-fns';

type TaskCategory = 'work' | 'leisure' | 'health' | 'study' | 'shopping' | 'family';
type Priority = 'high' | 'medium' | 'low';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Task {
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  startTime: string;
  endTime: string;
  date: Date;
  completed: boolean;
  userId: string;
  notes: string[];
  subtasks: SubTask[];
  tags: string[];
}

const weekdayTasks: Array<Omit<Task, 'date' | 'startTime' | 'endTime'>> = [
  {
    title: 'Team Status Meeting',
    description: 'Weekly team sync and progress review',
    category: 'work',
    priority: 'high',
    completed: false,
    userId: 'user123',
    notes: ['Prepare status update', 'Review team metrics'],
    subtasks: [
      { id: 'st1', title: 'Compile team updates', completed: false },
      { id: 'st2', title: 'Update project timeline', completed: false }
    ],
    tags: ['meeting', 'team', 'work']
  },
  {
    title: 'Gym Session',
    description: 'Regular workout routine',
    category: 'health',
    priority: 'medium',
    completed: false,
    userId: 'user123',
    notes: ['Focus on cardio', 'Complete strength training'],
    subtasks: [
      { id: 'st1', title: '30 min cardio', completed: false },
      { id: 'st2', title: 'Weight training', completed: false }
    ],
    tags: ['health', 'fitness', 'routine']
  },
  {
    title: 'Learning Session',
    description: 'Professional development time',
    category: 'study',
    priority: 'medium',
    completed: false,
    userId: 'user123',
    notes: ['Review course material', 'Practice exercises'],
    subtasks: [
      { id: 'st1', title: 'Complete one module', completed: false },
      { id: 'st2', title: 'Take practice quiz', completed: false }
    ],
    tags: ['learning', 'development', 'skills']
  }
];

const weekendTasks: Array<Omit<Task, 'date' | 'startTime' | 'endTime'>> = [
  {
    title: 'Family Brunch',
    description: 'Weekend family gathering',
    category: 'family',
    priority: 'high',
    completed: false,
    userId: 'user123',
    notes: ['Plan menu', 'Grocery shopping'],
    subtasks: [
      { id: 'st1', title: 'Prepare brunch', completed: false },
      { id: 'st2', title: 'Set up dining area', completed: false }
    ],
    tags: ['family', 'weekend', 'food']
  },
  {
    title: 'House Maintenance',
    description: 'Weekly home maintenance tasks',
    category: 'leisure',
    priority: 'medium',
    completed: false,
    userId: 'user123',
    notes: ['Check supplies', 'Clean major areas'],
    subtasks: [
      { id: 'st1', title: 'Clean house', completed: false },
      { id: 'st2', title: 'Garden maintenance', completed: false }
    ],
    tags: ['home', 'maintenance', 'weekend']
  },
  {
    title: 'Recreational Activity',
    description: 'Outdoor weekend activity',
    category: 'leisure',
    priority: 'medium',
    completed: false,
    userId: 'user123',
    notes: ['Check weather', 'Prepare equipment'],
    subtasks: [
      { id: 'st1', title: 'Plan route/activity', completed: false },
      { id: 'st2', title: 'Pack necessities', completed: false }
    ],
    tags: ['recreation', 'outdoor', 'weekend']
  }
];

const timeSlots = [
  { start: '09:00', end: '12:00' },  // Morning
  { start: '13:00', end: '16:00' },  // Afternoon
  { start: '16:00', end: '19:00' }   // Evening
];

// Helper function to get a time-based completion multiplier
const getTimeBasedMultiplier = (timeSlot: { start: string; end: string }): number => {
  const hour = parseInt(timeSlot.start);
  // Higher completion rates during morning and early afternoon
  if (hour >= 9 && hour < 12) return 1.2;  // Morning peak
  if (hour >= 13 && hour < 16) return 1.0;  // Afternoon
  return 0.8;  // Evening
};

// Helper function to determine if we should create a task for this slot
const shouldCreateTask = (date: Date, timeSlot: { start: string; end: string }): boolean => {
  const dayOfWeek = format(date, 'EEEE');
  const hour = parseInt(timeSlot.start);
  const isWeekendDay = isWeekend(date);

  // Reduce task frequency for weekends
  if (isWeekendDay && Math.random() > 0.6) return false;

  // Reduce late tasks
  if (hour >= 16 && Math.random() > 0.7) return false;

  // General task probability
  return Math.random() > 0.4; // 60% chance of task creation
};

// Helper function to determine if a task should be completed
const shouldCompleteTask = (date: Date, baseCompletionRate: number, timeSlot: { start: string; end: string }): boolean => {
  // Future tasks should never be completed
  if (date > new Date()) {
    return false;
  }

  const dayDiff = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  // For the last 14 days, use varying completion rates
  if (dayDiff <= 14) {
    const dayPatterns: Record<number, number> = {
      1: 0.8,  // Yesterday
      2: 0.7,
      3: 0.75,
      4: 0.6,
      5: 0.65,
      6: 0.7,
      7: 0.8,  // Last week same day
      8: 0.6,
      9: 0.65,
      10: 0.7,
      11: 0.75,
      12: 0.6,
      13: 0.65,
      14: 0.7
    };
    
    const dayMultiplier = dayPatterns[dayDiff] || 0.6;
    const timeMultiplier = getTimeBasedMultiplier(timeSlot);
    return Math.random() < (baseCompletionRate * dayMultiplier * timeMultiplier);
  }
  
  // For older tasks, use a sparse completion pattern
  const sparseCompletionRate = baseCompletionRate * 0.3;
  const timeMultiplier = getTimeBasedMultiplier(timeSlot);
  return Math.random() < (sparseCompletionRate * timeMultiplier);
};

export function generateYearOfTasks(userId: string): Task[] {
  const tasks: Task[] = [];
  const today = startOfDay(new Date());
  const startDate = addMonths(today, -12);
  const endDate = addMonths(today, 2);
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  // Create task templates with the provided userId
  const weekdayTasks: Array<Omit<Task, 'date' | 'startTime' | 'endTime'>> = [
    {
      title: 'Team Status Meeting',
      description: 'Weekly team sync and progress review',
      category: 'work',
      priority: 'high',
      completed: false,
      userId,
      notes: ['Prepare status update', 'Review team metrics'],
      subtasks: [
        { id: 'st1', title: 'Compile team updates', completed: false },
        { id: 'st2', title: 'Update project timeline', completed: false }
      ],
      tags: ['meeting', 'team', 'work']
    },
    {
      title: 'Gym Session',
      description: 'Regular workout routine',
      category: 'health',
      priority: 'medium',
      completed: false,
      userId,
      notes: ['Focus on cardio', 'Complete strength training'],
      subtasks: [
        { id: 'st1', title: '30 min cardio', completed: false },
        { id: 'st2', title: 'Weight training', completed: false }
      ],
      tags: ['health', 'fitness', 'routine']
    },
    {
      title: 'Learning Session',
      description: 'Professional development time',
      category: 'study',
      priority: 'medium',
      completed: false,
      userId,
      notes: ['Review course material', 'Practice exercises'],
      subtasks: [
        { id: 'st1', title: 'Complete one module', completed: false },
        { id: 'st2', title: 'Take practice quiz', completed: false }
      ],
      tags: ['learning', 'development', 'skills']
    }
  ];

  const weekendTasks: Array<Omit<Task, 'date' | 'startTime' | 'endTime'>> = [
    {
      title: 'Family Brunch',
      description: 'Weekend family gathering',
      category: 'family',
      priority: 'high',
      completed: false,
      userId,
      notes: ['Plan menu', 'Grocery shopping'],
      subtasks: [
        { id: 'st1', title: 'Prepare brunch', completed: false },
        { id: 'st2', title: 'Set up dining area', completed: false }
      ],
      tags: ['family', 'weekend', 'food']
    },
    {
      title: 'House Maintenance',
      description: 'Weekly home maintenance tasks',
      category: 'leisure',
      priority: 'medium',
      completed: false,
      userId,
      notes: ['Check supplies', 'Clean major areas'],
      subtasks: [
        { id: 'st1', title: 'Clean house', completed: false },
        { id: 'st2', title: 'Garden maintenance', completed: false }
      ],
      tags: ['home', 'maintenance', 'weekend']
    },
    {
      title: 'Recreational Activity',
      description: 'Outdoor weekend activity',
      category: 'leisure',
      priority: 'medium',
      completed: false,
      userId,
      notes: ['Check weather', 'Prepare equipment'],
      subtasks: [
        { id: 'st1', title: 'Plan route/activity', completed: false },
        { id: 'st2', title: 'Pack necessities', completed: false }
      ],
      tags: ['recreation', 'outdoor', 'weekend']
    }
  ];

  // Generate tasks for each day
  for (let i = 0; i < totalDays; i++) {
    const currentDate = addDays(startDate, i);
    const isWeekendDay = isWeekend(currentDate);
    const tasksForDay = isWeekendDay ? weekendTasks : weekdayTasks;
    
    // Try to create one task per time slot
    timeSlots.forEach(timeSlot => {
      // Only create a task sometimes
      if (!shouldCreateTask(currentDate, timeSlot)) {
        return;
      }

      // Pick a random task template, but avoid duplicates for the same day
      const availableTemplates = [...tasksForDay];
      const taskTemplate = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      
      // Base completion rate varies by priority
      const baseCompletionRate = 
        taskTemplate.priority === 'high' ? 0.85 :
        taskTemplate.priority === 'medium' ? 0.7 : 0.5;

      // Determine if this task should be marked as completed
      const completed = shouldCompleteTask(currentDate, baseCompletionRate, timeSlot);
      
      // For completed tasks, also complete some subtasks
      const subtasks = taskTemplate.subtasks.map(subtask => ({
        ...subtask,
        completed: completed && Math.random() < 0.8
      }));

      tasks.push({
        ...taskTemplate,
        date: currentDate,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        completed,
        subtasks,
        title: `${taskTemplate.title} - ${format(currentDate, 'MMM d')}`
      });
    });
  }

  return tasks;
} 