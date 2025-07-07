// API client for frontend to communicate with backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async signup(data: any) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async sendOTP(whatsappNumber: string) {
    return this.request('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ whatsappNumber }),
    });
  }

  async verifySignup(userId: string, otpCode: string) {
    return this.request('/api/auth/verify-signup', {
      method: 'POST',
      body: JSON.stringify({ userId, otpCode }),
    });
  }

  async signin(whatsappNumber: string, otpCode: string) {
    const response = await this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ whatsappNumber, otpCode }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Landing page endpoints
  async getLandingPage() {
    return this.request('/api/landing-page');
  }

  async updateLandingPage(data: any) {
    return this.request('/api/landing-page', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async createLandingPageWithAI(data: any) {
    return this.request('/api/landing-page/create-with-ai', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // AI endpoints
  async generateContent(data: any) {
    return this.request('/api/ai/generate-content', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Upload endpoints
  async uploadFile(file: File, imageType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('imageType', imageType);

    return this.request('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  }

  // Payments endpoints
  async createCheckout(planId: string) {
    return this.request('/api/payments/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    });
  }

  // Contact form endpoints
  async submitContactForm(subdomain: string, formData: any, language?: string) {
    return this.request('/api/contact-form', {
      method: 'POST',
      body: JSON.stringify({ subdomain, formData, language }),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/api/health');
  }
}

export const apiClient = new ApiClient();