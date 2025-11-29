import mongoose, { Schema, Document } from 'mongoose';
import { ICampaign, CampaignType, CampaignStatus } from '../types';

export interface ICampaignDocument extends Omit<ICampaign, '_id'>, Document {}

const campaignSchema = new Schema<ICampaignDocument>(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
      maxlength: [200, 'Campaign name cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    type: {
      type: String,
      enum: Object.values(CampaignType),
      required: [true, 'Campaign type is required']
    },
    status: {
      type: String,
      enum: Object.values(CampaignStatus),
      default: CampaignStatus.DRAFT
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget must be a positive number']
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount must be a positive number']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: ICampaignDocument, value: Date) {
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    targetAudience: {
      type: String,
      trim: true,
      maxlength: [500, 'Target audience description cannot exceed 500 characters']
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: true
    },
    assignedClients: [{
      type: String,
      ref: 'User'
    }],
    metrics: {
      impressions: {
        type: Number,
        default: 0,
        min: 0
      },
      clicks: {
        type: Number,
        default: 0,
        min: 0
      },
      conversions: {
        type: Number,
        default: 0,
        min: 0
      },
      ctr: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    mediaUrls: [{
      type: String
    }]
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        const { __v, ...campaign } = ret;
        return campaign;
      }
    }
  }
);

// Indexes for performance
campaignSchema.index({ status: 1 });
campaignSchema.index({ createdBy: 1 });
campaignSchema.index({ startDate: 1, endDate: 1 });
campaignSchema.index({ type: 1 });

export const Campaign = mongoose.model<ICampaignDocument>('Campaign', campaignSchema);

