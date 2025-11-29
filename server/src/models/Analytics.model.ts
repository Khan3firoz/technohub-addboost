import mongoose, { Schema, Document } from 'mongoose';
import { IAnalytics } from '../types';

export interface IAnalyticsDocument extends Omit<IAnalytics, '_id'>, Document {}

const analyticsSchema = new Schema<IAnalyticsDocument>(
  {
    campaign: {
      type: String,
      ref: 'Campaign',
      required: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    impressions: {
      type: Number,
      default: 0,
      min: [0, 'Impressions must be positive']
    },
    clicks: {
      type: Number,
      default: 0,
      min: [0, 'Clicks must be positive']
    },
    conversions: {
      type: Number,
      default: 0,
      min: [0, 'Conversions must be positive']
    },
    spend: {
      type: Number,
      default: 0,
      min: [0, 'Spend must be positive']
    },
    deviceBreakdown: {
      desktop: {
        type: Number,
        default: 0,
        min: 0
      },
      mobile: {
        type: Number,
        default: 0,
        min: 0
      },
      tablet: {
        type: Number,
        default: 0,
        min: 0
      }
    },
    platformBreakdown: {
      facebook: {
        type: Number,
        default: 0,
        min: 0
      },
      google: {
        type: Number,
        default: 0,
        min: 0
      },
      instagram: {
        type: Number,
        default: 0,
        min: 0
      },
      other: {
        type: Number,
        default: 0,
        min: 0
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        const { __v, ...analytics } = ret;
        return analytics;
      }
    }
  }
);

// Indexes for performance
analyticsSchema.index({ campaign: 1, date: -1 });
analyticsSchema.index({ date: -1 });

export const Analytics = mongoose.model<IAnalyticsDocument>('Analytics', analyticsSchema);

