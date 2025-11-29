
export interface Service {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PortfolioItem {
  _id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  description: string;
  result: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  avatar: string;
  visible: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status?: 'open' | 'closed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

// Backend API Types
export enum UserRole {
  ADMIN = 'admin',
  CAMPAIGN_MANAGER = 'campaign_manager',
  CLIENT = 'client',
  VIEWER = 'viewer'
}

export enum CampaignType {
  BANNER = 'banner',
  VIDEO = 'video',
  SOCIAL = 'social'
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed'
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  _id: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  targetAudience?: string;
  createdBy: string | User;
  assignedClients: string[] | User[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Media {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string | User;
  campaign?: string | Campaign;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  _id: string;
  campaign: string | Campaign;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  deviceBreakdown?: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  platformBreakdown?: {
    facebook: number;
    google: number;
    instagram: number;
    other: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  _id: string;
  campaign: string | Campaign;
  totalBudget: number;
  dailyBudget: number;
  spent: number;
  remaining: number;
  transactions: {
    amount: number;
    date: string;
    description: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
  };
  accessToken: string;
  refreshToken: string;
}