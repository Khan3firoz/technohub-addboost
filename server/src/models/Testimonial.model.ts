import mongoose, { Schema, Document } from 'mongoose';
import { ITestimonial } from '../types';

export interface ITestimonialDocument extends Omit<ITestimonial, '_id'>, Document {}

const testimonialSchema = new Schema<ITestimonialDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters']
    },
    company: {
      type: String,
      required: [true, 'Company is required'],
      trim: true,
      maxlength: [100, 'Company cannot exceed 100 characters']
    },
    feedback: {
      type: String,
      required: [true, 'Feedback is required'],
      trim: true,
      maxlength: [1000, 'Feedback cannot exceed 1000 characters']
    },
    avatar: {
      type: String,
      required: [true, 'Avatar URL is required'],
      trim: true
    },
    visible: {
      type: Boolean,
      default: false
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
        const { __v, ...testimonial } = ret;
        return testimonial;
      }
    }
  }
);

// Indexes
testimonialSchema.index({ visible: 1 });
testimonialSchema.index({ order: 1 });
testimonialSchema.index({ createdAt: -1 });

export const Testimonial = mongoose.model<ITestimonialDocument>('Testimonial', testimonialSchema);

