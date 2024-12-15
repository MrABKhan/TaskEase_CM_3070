import axios, { AxiosError } from 'axios';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android emulator to access host machine's localhost
// For web browser, continue using localhost
const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',  // Special IP for Android emulator to access host
  default: 'http://localhost:3000/api',  // Default for web and iOS
});

console.log('🌐 Using API URL:', API_URL);

const TEMP_USER_ID = 'user123';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: 'work' | 'health' | 'study' | 'leisure';
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
}

const logAxiosError = (error: AxiosError) => {
  console.error('🔍 Detailed Error Information:');
  console.error('- Message:', error.message);
  console.error('- Code:', error.code);
  console.error('- Request URL:', error.config?.url);
  console.error('- Request Method:', error.config?.method?.toUpperCase());
  console.error('- Request Headers:', error.config?.headers);
  console.error('- Request Data:', error.config?.data);
  if (error.response) {
    console.error('- Response Status:', error.response.status);
    console.error('- Response Data:', error.response.data);
  }
  if (error.request) {
    console.error('- Request was made but no response received');
    console.error('- Request Details:', error.request);
  }
};

const api = {
  // Get all tasks with filtering
  getTasks: async (params: any = {}) => {
    console.log('📤 Fetching tasks with params:', { ...params, userId: TEMP_USER_ID });
    try {
      const response = await axios.get(`${API_URL}/tasks`, {
        params: { ...params, userId: TEMP_USER_ID }
      });
      console.log('📥 Raw tasks response:', response.data);
      const mappedTasks = response.data.tasks.map((task: any) => ({
        ...task,
        id: task._id
      }));
      console.log('🔄 Mapped tasks:', mappedTasks);
      return mappedTasks;
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },

  // Get today's tasks
  getTodayTasks: async () => {
    console.log('📤 Fetching today\'s tasks for user:', TEMP_USER_ID);
    try {
      const response = await axios.get(`${API_URL}/tasks/today`, {
        params: { userId: TEMP_USER_ID }
      });
      console.log('📥 Raw today\'s tasks response:', response.data);
      const mappedTasks = response.data.map((task: any) => ({
        ...task,
        id: task._id
      }));
      console.log('🔄 Mapped today\'s tasks:', mappedTasks);
      return mappedTasks;
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    console.log('📤 Updating task:', { id, updates });
    try {
      const response = await axios.put(`${API_URL}/tasks/${id}`, updates);
      console.log('📥 Update task response:', response.data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    console.log('📤 Deleting task:', id);
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      console.log('✅ Task deleted successfully');
    } catch (error) {
      if (error instanceof AxiosError) {
        logAxiosError(error);
      } else {
        console.error('❌ Unexpected error:', error);
      }
      throw error;
    }
  },
};

export default api; 