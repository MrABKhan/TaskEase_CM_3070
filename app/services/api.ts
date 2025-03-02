import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

// Debug logger utility
const DEBUG = false; // Toggle this to enable/disable debug logs

const logger = {
  debug: (...args: any[]) => {
    if (DEBUG) console.log(...args);
  },
  info: (...args: any[]) => console.log(...args),
  error: (...args: any[]) => console.error(...args)
};

// Use 10.0.2.2 for Android emulator to access host machine's localhost
// For web browser, continue using localhost
const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',  // Special IP for Android emulator to access host
  default: 'http://localhost:3000/api',  // Default for web and iOS
});

logger.info('🌐 Using API URL:', API_URL);

const TEMP_USER_ID = 'user123';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'health' | 'study' | 'leisure' | 'shopping' | 'family';
  priority: 'high' | 'medium' | 'low';
  startTime: string;
  endTime: string;
  date: Date;
  completed: boolean;
  notes: string[];
  subtasks: {
    id: string;
    title: string;
    completed: boolean;
  }[];
  tags: string[];
  isAiGenerated?: boolean;
}

const logAxiosError = (error: AxiosError) => {
  logger.error('🔍 Detailed Error Information:');
  logger.error('- Message:', error.message);
  logger.error('- Code:', error.code);
  logger.error('- Request URL:', error.config?.url);
  logger.error('- Request Method:', error.config?.method?.toUpperCase());
  logger.error('- Request Headers:', error.config?.headers);
  logger.error('- Request Data:', error.config?.data);
  if (error.response) {
    logger.error('- Response Status:', error.response.status);
    logger.error('- Response Data:', error.response.data);
  }
  if (error.request) {
    logger.error('- Request was made but no response received');
    logger.error('- Request Details:', error.request);
  }
};

const api = {
  // Get tasks with filtering
  getTasks: async (params: { month?: string; date?: string } = {}) => {
    logger.info('📤 Fetching tasks with params:', { ...params, userId: TEMP_USER_ID });
    try {
      let response;
      if (params.month) {
        // Extract year and month from the month string (format: YYYY-MM)
        const [year, month] = params.month.split('-');
        response = await axios.get(`${API_URL}/tasks/month/${year}/${month}`, {
          params: { userId: TEMP_USER_ID }
        });
      } else if (params.date) {
        response = await axios.get(`${API_URL}/tasks/date/${params.date}`, {
          params: { userId: TEMP_USER_ID }
        });
      } else {
        response = await axios.get(`${API_URL}/tasks`, {
          params: { ...params, userId: TEMP_USER_ID }
        });
      }

      // Handle both array and object responses
      const tasksData = response.data.tasks || response.data || [];
      logger.debug('📥 Raw tasks response:', tasksData);
      
      const mappedTasks = tasksData.map((task: any) => ({
        id: task._id || task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        startTime: task.startTime,
        endTime: task.endTime,
        date: task.date,
        completed: task.completed,
        notes: task.notes || [],
        subtasks: task.subtasks || [],
        tags: task.tags || [],
      }));
      
      logger.debug('🔄 Mapped tasks:', mappedTasks);
      return mappedTasks;
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        logger.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },

  // Get today's tasks
  getTodayTasks: async () => {
    logger.info('📤 Fetching today\'s tasks for user:', TEMP_USER_ID);
    try {
      const response = await axios.get(`${API_URL}/tasks/today`, {
        params: { userId: TEMP_USER_ID }
      });
      logger.debug('📥 Raw today\'s tasks response:', response.data);
      
      // Handle both array and object responses
      const tasksData = response.data.tasks || response.data || [];
      
      const mappedTasks = tasksData.map((task: any) => ({
        id: task._id || task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        startTime: task.startTime,
        endTime: task.endTime,
        date: task.date,
        completed: task.completed,
        notes: task.notes || [],
        subtasks: task.subtasks || [],
        tags: task.tags || [],
      }));
      
      logger.debug('🔄 Mapped today\'s tasks:', mappedTasks);
      return mappedTasks;
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        logger.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    logger.info('📤 Updating task:', { id, updates });
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, updates);
      logger.debug('📥 Update task response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        logger.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    logger.info('📤 Deleting task:', id);
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      logger.info('✅ Task deleted successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        logger.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },

  createTask: async (taskData: Partial<Task>) => {
    logger.info('📤 Creating new task:', taskData);
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        ...taskData,
        userId: TEMP_USER_ID,
        notes: [],
        tags: [],
        isAiGenerated: taskData.isAiGenerated || false,
      });
      logger.debug('📥 Create task response:', response.data);
      return {
        ...response.data,
        id: response.data._id
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        logger.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },
};

export default api; 