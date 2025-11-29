import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  Service, TeamMember, PortfolioItem, Testimonial, Job,
  User, Campaign, Media, Analytics, Budget,
  ApiResponse, PaginationResult, AuthResponse, UserRole
} from '../types';

// All data is now stored in MongoDB and fetched from the backend API

// --- AXIOS INSTANCE ---

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });
          
          // Validate response structure before destructuring
          if (!response.data?.data || !response.data.data.accessToken || !response.data.data.refreshToken) {
            throw new Error('Invalid refresh token response structure');
          }
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// --- CONTENT MANAGEMENT API FUNCTIONS ---

// Services
export const contentAPI = {
  // Services
  getServices: async (params?: { page?: number; limit?: number }): Promise<Service[]> => {
    const response = await apiClient.get<ApiResponse<PaginationResult<Service>>>('/services', {
      params: { page: 1, limit: 100, ...params }
    });
    return response.data.data?.data || [];
  },

  getServiceById: async (id: string): Promise<Service> => {
    const response = await apiClient.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data.data!;
  },

  // Team Members
  getTeam: async (params?: { page?: number; limit?: number }): Promise<TeamMember[]> => {
    const response = await apiClient.get<ApiResponse<PaginationResult<TeamMember>>>('/team', {
      params: { page: 1, limit: 100, ...params }
    });
    return response.data.data?.data || [];
  },

  getTeamMemberById: async (id: string): Promise<TeamMember> => {
    const response = await apiClient.get<ApiResponse<TeamMember>>(`/team/${id}`);
    return response.data.data!;
  },

  // Portfolio
  getPortfolio: async (params?: { page?: number; limit?: number; category?: string }): Promise<PortfolioItem[]> => {
    const response = await apiClient.get<ApiResponse<PaginationResult<PortfolioItem>>>('/portfolio', {
      params: { page: 1, limit: 100, ...params }
    });
    return response.data.data?.data || [];
  },

  getPortfolioItem: async (id: string): Promise<PortfolioItem> => {
    const response = await apiClient.get<ApiResponse<PortfolioItem>>(`/portfolio/${id}`);
    return response.data.data!;
  },

  // Testimonials
  getTestimonials: async (params?: { page?: number; limit?: number; visible?: boolean }): Promise<Testimonial[]> => {
    const response = await apiClient.get<ApiResponse<PaginationResult<Testimonial>>>('/testimonials', {
      params: { page: 1, limit: 100, ...params }
    });
    return response.data.data?.data || [];
  },

  getTestimonialById: async (id: string): Promise<Testimonial> => {
    const response = await apiClient.get<ApiResponse<Testimonial>>(`/testimonials/${id}`);
    return response.data.data!;
  },

  toggleTestimonialVisibility: async (id: string): Promise<Testimonial> => {
    const response = await apiClient.patch<ApiResponse<Testimonial>>(`/testimonials/${id}/toggle-visibility`);
    return response.data.data!;
  },

  // Jobs
  getJobs: async (params?: { page?: number; limit?: number; department?: string; status?: string }): Promise<Job[]> => {
    const response = await apiClient.get<ApiResponse<PaginationResult<Job>>>('/jobs', {
      params: { page: 1, limit: 100, ...params }
    });
    return response.data.data?.data || [];
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await apiClient.get<ApiResponse<Job>>(`/jobs/${id}`);
    return response.data.data!;
  }
};

// Legacy function exports for backward compatibility
export async function getServices(): Promise<Service[]> {
  return contentAPI.getServices();
}

export async function getTeam(): Promise<TeamMember[]> {
  return contentAPI.getTeam();
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  return contentAPI.getPortfolio();
}

export async function getPortfolioItem(id: string): Promise<PortfolioItem | undefined> {
  try {
    return await contentAPI.getPortfolioItem(id);
  } catch (error) {
    return undefined;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return contentAPI.getTestimonials({ visible: true });
}

export async function toggleTestimonialVisibility(id: string): Promise<Testimonial> {
  return contentAPI.toggleTestimonialVisibility(id);
}

export async function getJobs(): Promise<Job[]> {
  return contentAPI.getJobs({ status: 'open' });
}

export async function getJob(id: string): Promise<Job | undefined> {
  try {
    return await contentAPI.getJob(id);
  } catch (error) {
    return undefined;
  }
}

// --- BACKEND API FUNCTIONS ---

// Authentication
export const authAPI = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    role?: UserRole;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
      email,
      password
    });
    return response.data.data!;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
    return response.data.data!;
  },

  updateProfile: async (data: {
    username?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
    return response.data.data!;
  }
};

// Users
export const userAPI = {
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: UserRole;
    status?: 'active' | 'inactive';
    search?: string;
  }): Promise<PaginationResult<User>> => {
    const response = await apiClient.get<ApiResponse<PaginationResult<User>>>('/users', {
      params
    });
    return response.data.data!;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data!;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data.data!;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  changeRole: async (id: string, role: UserRole): Promise<User> => {
    const response = await apiClient.patch<ApiResponse<User>>(`/users/${id}/role`, { role });
    return response.data.data!;
  }
};

// Campaigns
export const campaignAPI = {
  createCampaign: async (data: Omit<Campaign, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'assignedClients' | 'metrics' | 'mediaUrls' | 'spent'>): Promise<Campaign> => {
    const response = await apiClient.post<ApiResponse<Campaign>>('/campaigns', data);
    return response.data.data!;
  },

  getCampaigns: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<PaginationResult<Campaign>> => {
    const response = await apiClient.get<ApiResponse<PaginationResult<Campaign>>>('/campaigns', {
      params
    });
    return response.data.data!;
  },

  getCampaignById: async (id: string): Promise<Campaign> => {
    const response = await apiClient.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
    return response.data.data!;
  },

  updateCampaign: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    const response = await apiClient.put<ApiResponse<Campaign>>(`/campaigns/${id}`, data);
    return response.data.data!;
  },

  deleteCampaign: async (id: string): Promise<void> => {
    await apiClient.delete(`/campaigns/${id}`);
  },

  pauseCampaign: async (id: string): Promise<Campaign> => {
    const response = await apiClient.patch<ApiResponse<Campaign>>(`/campaigns/${id}/pause`);
    return response.data.data!;
  },

  activateCampaign: async (id: string): Promise<Campaign> => {
    const response = await apiClient.patch<ApiResponse<Campaign>>(`/campaigns/${id}/activate`);
    return response.data.data!;
  },

  assignClients: async (id: string, clientIds: string[]): Promise<Campaign> => {
    const response = await apiClient.patch<ApiResponse<Campaign>>(`/campaigns/${id}/assign`, {
      clientIds
    });
    return response.data.data!;
  }
};

// Analytics
export const analyticsAPI = {
  recordAnalytics: async (campaignId: string, data: Partial<Analytics>): Promise<Analytics> => {
    const response = await apiClient.post<ApiResponse<Analytics>>(
      `/analytics/campaigns/${campaignId}`,
      data
    );
    return response.data.data!;
  },

  getCampaignAnalytics: async (
    campaignId: string,
    params?: { startDate?: string; endDate?: string }
  ): Promise<Analytics[]> => {
    const response = await apiClient.get<ApiResponse<Analytics[]>>(
      `/analytics/campaigns/${campaignId}`,
      { params }
    );
    return response.data.data!;
  },

  getAggregatedStats: async (campaignId: string): Promise<any> => {
    const response = await apiClient.get<ApiResponse<any>>(
      `/analytics/campaigns/${campaignId}/aggregate`
    );
    return response.data.data!;
  },

  exportReport: async (
    campaignId: string,
    params?: { startDate?: string; endDate?: string; format?: 'json' | 'csv' }
  ): Promise<any> => {
    const response = await apiClient.get(`/analytics/campaigns/${campaignId}/export`, {
      params
    });
    // For CSV format, the response might be raw text, otherwise return data.data
    if (params?.format === 'csv') {
      return response.data;
    }
    return response.data.data!;
  }
};

// Budget
export const budgetAPI = {
  setBudget: async (campaignId: string, data: {
    totalBudget: number;
    dailyBudget: number;
  }): Promise<Budget> => {
    const response = await apiClient.post<ApiResponse<Budget>>(
      `/budget/campaigns/${campaignId}`,
      data
    );
    return response.data.data!;
  },

  getBudget: async (campaignId: string): Promise<Budget> => {
    const response = await apiClient.get<ApiResponse<Budget>>(
      `/budget/campaigns/${campaignId}`
    );
    return response.data.data!;
  },

  updateBudget: async (campaignId: string, data: {
    totalBudget?: number;
    dailyBudget?: number;
  }): Promise<Budget> => {
    const response = await apiClient.put<ApiResponse<Budget>>(
      `/budget/campaigns/${campaignId}`,
      data
    );
    return response.data.data!;
  },

  trackSpending: async (campaignId: string, data: {
    amount: number;
    description?: string;
  }): Promise<Budget> => {
    const response = await apiClient.post<ApiResponse<Budget>>(
      `/budget/campaigns/${campaignId}/spend`,
      data
    );
    return response.data.data!;
  },

  getBudgetHistory: async (campaignId: string): Promise<any[]> => {
    const response = await apiClient.get<ApiResponse<any[]>>(
      `/budget/campaigns/${campaignId}/history`
    );
    return response.data.data!;
  }
};

// Media
export const mediaAPI = {
  uploadMedia: async (file: File, campaignId?: string): Promise<Media> => {
    const formData = new FormData();
    formData.append('file', file);
    if (campaignId) {
      formData.append('campaignId', campaignId);
    }

    // Don't set Content-Type header - Axios will automatically set it with the correct boundary
    const response = await apiClient.post<ApiResponse<Media>>('/media/upload', formData);
    return response.data.data!;
  },

  getMedia: async (id: string): Promise<Media> => {
    const response = await apiClient.get<ApiResponse<Media>>(`/media/${id}`);
    return response.data.data!;
  },

  deleteMedia: async (id: string): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },

  getMediaByCampaign: async (campaignId: string): Promise<Media[]> => {
    const response = await apiClient.get<ApiResponse<Media[]>>(
      `/media/campaigns/${campaignId}`
    );
    return response.data.data!;
  }
};

export default apiClient;
