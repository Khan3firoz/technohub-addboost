import mongoose, { Schema, Document } from 'mongoose';
import { IPortfolioItem } from '../types';

export interface IPortfolioItemDocument extends Omit<IPortfolioItem, '_id'>, Document {}

const portfolioItemSchema = new Schema<IPortfolioItemDocument>(
  {
    title: {
      type: String,
      required: [true, 'Portfolio title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters']
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    client: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [100, 'Client name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters']
    },
    result: {
      type: String,
      required: [true, 'Result is required'],
      trim: true,
      maxlength: [500, 'Result cannot exceed 500 characters']
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
        const { __v, ...item } = ret;
        return item;
      }
    }
  }
);

// Indexes
portfolioItemSchema.index({ category: 1 });
portfolioItemSchema.index({ order: 1 });
portfolioItemSchema.index({ createdAt: -1 });

export const PortfolioItem = mongoose.model<IPortfolioItemDocument>('PortfolioItem', portfolioItemSchema);

