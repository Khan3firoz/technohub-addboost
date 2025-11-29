import mongoose, { Schema, Document } from 'mongoose';
import { ITeamMember } from '../types';

export interface ITeamMemberDocument extends Omit<ITeamMember, '_id'>, Document {}

const teamMemberSchema = new Schema<ITeamMemberDocument>(
  {
    name: {
      type: String,
      required: [true, 'Team member name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters']
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
      trim: true
    },
    bio: {
      type: String,
      required: [true, 'Bio is required'],
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
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
        const { __v, ...member } = ret;
        return member;
      }
    }
  }
);

// Indexes
teamMemberSchema.index({ order: 1 });
teamMemberSchema.index({ createdAt: -1 });

export const TeamMember = mongoose.model<ITeamMemberDocument>('TeamMember', teamMemberSchema);

