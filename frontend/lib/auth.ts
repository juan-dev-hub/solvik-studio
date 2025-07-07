// Frontend auth utilities
import { apiClient } from './api';

export interface User {
  id: string;
  name: string;
  email?: string;
  subdomain: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthService {
  private listeners: ((state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      
      if (token && user) {
        this.state = {
          token,
          user: JSON.parse(user),
          isAuthenticated: true,
        };
        apiClient.setToken(token);
      }
    }
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  getState() {
    return this.state;
  }

  async signin(whatsappNumber: string, otpCode: string) {
    try {
      const response = await apiClient.signin(whatsappNumber, otpCode);
      
      this.state = {
        token: response.token,
        user: response.user,
        isAuthenticated: true,
      };

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('auth_user', JSON.stringify(response.user));
      }

      this.notify();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async signup(data: any) {
    return apiClient.signup(data);
  }

  async sendOTP(whatsappNumber: string) {
    return apiClient.sendOTP(whatsappNumber);
  }

  async verifySignup(userId: string, otpCode: string) {
    return apiClient.verifySignup(userId, otpCode);
  }

  signout() {
    this.state = {
      user: null,
      token: null,
      isAuthenticated: false,
    };

    apiClient.clearToken();

    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }

    this.notify();
  }
}

export const authService = new AuthService();