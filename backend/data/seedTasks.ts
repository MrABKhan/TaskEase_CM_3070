import { format } from 'date-fns';

export const seedTasks = [
  {
    title: 'Review Q4 Project Proposals',
    description: 'Analyze and provide feedback on upcoming project proposals',
    category: 'work',
    priority: 'high',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    date: new Date('2024-12-02'),
    completed: false,
    userId: 'user123',
    notes: ['Focus on budget implications', 'Check resource availability'],
    subtasks: [
      { id: 'st1', title: 'Review budget sections', completed: false },
      { id: 'st2', title: 'Check timeline feasibility', completed: false }
    ],
    tags: ['planning', 'review', 'q4']
  },
  {
    title: 'Holiday Team Lunch',
    description: 'End of year team celebration lunch',
    category: 'leisure',
    priority: 'medium',
    startTime: '12:00 PM',
    endTime: '2:00 PM',
    date: new Date('2024-12-15'),
    completed: false,
    userId: 'user123',
    notes: ['Book restaurant', 'Collect dietary preferences'],
    subtasks: [
      { id: 'st3', title: 'Send invitations', completed: false },
      { id: 'st4', title: 'Confirm attendance', completed: false }
    ],
    tags: ['team-building', 'celebration']
  },
  {
    title: 'Year-End Fitness Assessment',
    description: 'Complete annual fitness goals review',
    category: 'health',
    priority: 'medium',
    startTime: '3:00 PM',
    endTime: '4:30 PM',
    date: new Date('2024-12-20'),
    completed: false,
    userId: 'user123',
    notes: ['Bring workout gear', 'Update fitness tracker'],
    subtasks: [
      { id: 'st5', title: 'Record measurements', completed: false },
      { id: 'st6', title: 'Update progress photos', completed: false }
    ],
    tags: ['fitness', 'health', 'yearly-review']
  },
  {
    title: 'Study Advanced TypeScript',
    description: 'Complete advanced TypeScript course modules',
    category: 'study',
    priority: 'high',
    startTime: '5:00 PM',
    endTime: '7:00 PM',
    date: new Date('2024-12-10'),
    completed: false,
    userId: 'user123',
    notes: ['Focus on generics', 'Practice with real examples'],
    subtasks: [
      { id: 'st7', title: 'Complete generics module', completed: false },
      { id: 'st8', title: 'Build practice project', completed: false }
    ],
    tags: ['programming', 'typescript', 'learning']
  },
  {
    title: 'Holiday Shopping',
    description: 'Complete gift shopping for family and friends',
    category: 'leisure',
    priority: 'medium',
    startTime: '10:00 AM',
    endTime: '2:00 PM',
    date: new Date('2024-12-18'),
    completed: false,
    userId: 'user123',
    notes: ['Check gift list', 'Compare prices online'],
    subtasks: [
      { id: 'st9', title: 'Buy family gifts', completed: false },
      { id: 'st10', title: 'Get gift wrapping supplies', completed: false }
    ],
    tags: ['shopping', 'holidays', 'personal']
  }
]; 