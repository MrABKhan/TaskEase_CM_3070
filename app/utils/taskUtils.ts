import { Task } from '../services/api';

export const getCategoryColor = (category: Task['category']): string => {
  switch (category) {
    case 'work':
      return '#007AFF';
    case 'health':
      return '#30D158';
    case 'study':
      return '#5856D6';
    case 'leisure':
      return '#FF9F0A';
    default:
      return '#666';
  }
};

export const getCategoryIcon = (category: Task['category']): string => {
  switch (category) {
    case 'work':
      return 'briefcase-outline';
    case 'health':
      return 'heart-outline';
    case 'study':
      return 'book-outline';
    case 'leisure':
      return 'gamepad-variant-outline';
    default:
      return 'tag-outline';
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case 'high':
      return '#FF453A';
    case 'medium':
      return '#FF9F0A';
    case 'low':
      return '#30D158';
    default:
      return '#666';
  }
}; 