import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

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

export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICampaign {
  _id: string;
  name: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  targetAudience?: string;
  createdBy: string;
  assignedClients: string[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
  mediaUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedia {
  _id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedBy: string;
  campaign?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnalytics {
  _id: string;
  campaign: string;
  date: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface IBudget {
  _id: string;
  campaign: string;
  totalBudget: number;
  dailyBudget: number;
  spent: number;
  remaining: number;
  transactions: {
    amount: number;
    date: Date;
    description: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
  role: UserRole;
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

// Content Management Types
export interface IService {
  _id: string;
  title: string;
  description: string;
  icon: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPortfolioItem {
  _id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  description: string;
  result: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITestimonial {
  _id: string;
  name: string;
  role: string;
  company: string;
  feedback: string;
  avatar: string;
  visible: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJob {
  _id: string;
  title: string;
  department: string;
  location: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  status?: 'open' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

