import mongoose, { Schema, Document } from 'mongoose';
import { IMedia } from '../types';

export interface IMediaDocument extends Omit<IMedia, '_id'>, Document {}

const mediaSchema = new Schema<IMediaDocument>(
  {
    filename: {
      type: String,
      required: [true, 'Filename is required'],
      trim: true
    },
    originalName: {
      type: String,
      required: [true, 'Original filename is required'],
      trim: true
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
      trim: true
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size must be positive']
    },
    url: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true
    },
    uploadedBy: {
      type: String,
      ref: 'User',
      required: true
    },
    campaign: {
      type: String,
      ref: 'Campaign'
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        const { __v, ...media } = ret;
        return media;
      }
    }
  }
);

// Indexes
mediaSchema.index({ uploadedBy: 1 });
mediaSchema.index({ campaign: 1 });
mediaSchema.index({ createdAt: -1 });

export const Media = mongoose.model<IMediaDocument>('Media', mediaSchema);

