import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config/environment';
import { Platform } from 'react-native';

const API_URL = config.API_URL;

export interface User {
  userId: string;
  name: string;
  email: string;
  secretKey: string;
}

class AuthService {
  private user: User | null = null;

  async signup(email: string, password: string, name: string, seedData: boolean = true): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name,
        seedData,
      });

      const user = response.data;
      await this.setUser(user);
      return user;
    } catch (error: any) {
      console.error('Signup error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error during signup');
    }
  }

  async signin(email: string, password: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, {
        email,
        password,
      });

      const user = response.data;
      await this.setUser(user);
      return user;
    } catch (error: any) {
      console.error('Signin error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error during signin');
    }
  }

  async signout(): Promise<void> {
    await AsyncStorage.removeItem('user');
    this.user = null;
  }

  async getUser(): Promise<User | null> {
    if (this.user) return this.user;

    const userStr = await AsyncStorage.getItem('user');
    if (userStr) {
      this.user = JSON.parse(userStr);
      return this.user;
    }
    return null;
  }

  private async setUser(user: User): Promise<void> {
    this.user = user;
    await AsyncStorage.setItem('user', JSON.stringify(user));
  }

  getAuthHeader() {
    return this.user ? { 'x-secret-key': this.user.secretKey } : {};
  }

  async reseedData(): Promise<void> {
    try {
      const response = await axios.post(
        `${API_URL}/auth/reseed`,
        {},
        { headers: this.getAuthHeader() }
      );
      if (response.status !== 200) {
        throw new Error('Failed to reseed data');
      }
    } catch (error: any) {
      console.error('Reseed error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Error reseeding data');
    }
  }
}

export default new AuthService(); 