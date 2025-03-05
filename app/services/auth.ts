import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const API_URL = Platform.select({
  android: 'http://10.0.2.2:3000/api',
  default: 'http://localhost:3000/api',
});

export interface User {
  userId: string;
  name: string;
  email: string;
  secretKey: string;
}

class AuthService {
  private user: User | null = null;

  async signup(email: string, password: string, name: string): Promise<User> {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        email,
        password,
        name,
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
}

export default new AuthService(); 