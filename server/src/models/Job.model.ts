import mongoose, { Schema, Document } from 'mongoose';
import { IJob } from '../types';

export interface IJobDocument extends Omit<IJob, '_id'>, Document {}

const jobSchema = new Schema<IJobDocument>(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters']
    },
    experience: {
      type: String,
      required: [true, 'Experience requirement is required'],
      trim: true,
      maxlength: [50, 'Experience cannot exceed 50 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    responsibilities: [{
      type: String,
      trim: true,
      maxlength: [500, 'Responsibility cannot exceed 500 characters']
    }],
    requirements: [{
      type: String,
      trim: true,
      maxlength: [500, 'Requirement cannot exceed 500 characters']
    }],
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        const { __v, ...job } = ret;
        return job;
      }
    }
  }
);

// Indexes
jobSchema.index({ department: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ createdAt: -1 });

export const Job = mongoose.model<IJobDocument>('Job', jobSchema);

