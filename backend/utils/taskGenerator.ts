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
  { start: '09:00 AM', end: '11:00 AM' },
  { start: '11:30 AM', end: '01:30 PM' },
  { start: '02:00 PM', end: '04:00 PM' },
  { start: '04:30 PM', end: '06:30 PM' }
];

export function generateYearOfTasks(): Task[] {
  const tasks: Task[] = [];
  const startDate = startOfDay(new Date());
  const numberOfDays = 365;

  for (let i = 0; i < numberOfDays; i++) {
    const currentDate = addDays(startDate, i);
    const isWeekendDay = isWeekend(currentDate);
    const tasksForDay = isWeekendDay ? weekendTasks : weekdayTasks;
    
    // Generate 2-3 tasks per day
    const numberOfTasksToday = Math.random() > 0.5 ? 3 : 2;
    const shuffledTimeSlots = [...timeSlots].sort(() => Math.random() - 0.5);
    
    for (let j = 0; j < numberOfTasksToday; j++) {
      const taskTemplate = tasksForDay[j % tasksForDay.length];
      const timeSlot = shuffledTimeSlots[j];
      
      tasks.push({
        ...taskTemplate,
        date: currentDate,
        startTime: timeSlot.start,
        endTime: timeSlot.end,
        // Add a date identifier to make titles unique
        title: `${taskTemplate.title} - ${format(currentDate, 'MMM d')}`
      });
    }
  }

  return tasks;
} 