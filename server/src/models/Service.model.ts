import mongoose, { Schema, Document } from 'mongoose';
import { IService } from '../types';

export interface IServiceDocument extends Omit<IService, '_id'>, Document {}

const serviceSchema = new Schema<IServiceDocument>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    icon: {
      type: String,
      required: [true, 'Service icon is required'],
      trim: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        const { __v, ...service } = ret;
        return service;
      }
    }
  }
);

// Indexes
serviceSchema.index({ order: 1 });
serviceSchema.index({ createdAt: -1 });

export const Service = mongoose.model<IServiceDocument>('Service', serviceSchema);

