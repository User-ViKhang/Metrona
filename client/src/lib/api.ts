import { LoginCredentials, RegisterData, AuthResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout(): Promise<void> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/me');
  }

  async updateProfile(data: any) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadAvatar(file: File) {
    const url = `${this.baseURL}/users/me/avatar`;
    const formData = new FormData();
    formData.append('avatar', file);

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload avatar');
    }

    const data = await response.json();
    return data.data || data;
  }

  // Order endpoints
  async getOrders(params?: { status?: string; page?: number; limit?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : '';
    return this.request(`/orders${queryString}`);
  }

  async getOrderById(id: string) {
    return this.request(`/orders/${id}`);
  }

  async cancelOrder(id: string, reason: string) {
    return this.request(`/orders/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  }

  async confirmReceived(id: string) {
    return this.request(`/orders/${id}/received`, {
      method: 'PATCH',
    });
  }

  // Address endpoints
  async getAddresses() {
    return this.request('/users/me/addresses');
  }

  async createAddress(data: any) {
    return this.request('/users/me/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAddress(id: string, data: any) {
    return this.request(`/users/me/addresses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async setDefaultAddress(id: string) {
    return this.request(`/users/me/addresses/${id}/default`, {
      method: 'PATCH',
    });
  }

  async deleteAddress(id: string) {
    return this.request(`/users/me/addresses/${id}`, {
      method: 'DELETE',
    });
  }

  // Shop endpoints
  async createShop(data: any) {
    return this.request('/shops', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyShop() {
    return this.request('/shops/me');
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId: string, quantity: number) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  // Products endpoints
  async getProducts(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request(`/products${queryString}`);
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`);
  }
}

export const api = new ApiClient(API_BASE_URL);
