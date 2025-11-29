import mongoose, { Schema, Document } from 'mongoose';
import { IBudget } from '../types';

export interface IBudgetDocument extends Omit<IBudget, '_id'>, Document {}

const budgetSchema = new Schema<IBudgetDocument>(
  {
    campaign: {
      type: String,
      ref: 'Campaign',
      required: true,
      unique: true
    },
    totalBudget: {
      type: Number,
      required: [true, 'Total budget is required'],
      min: [0, 'Total budget must be positive']
    },
    dailyBudget: {
      type: Number,
      required: [true, 'Daily budget is required'],
      min: [0, 'Daily budget must be positive']
    },
    spent: {
      type: Number,
      default: 0,
      min: [0, 'Spent amount must be positive']
    },
    remaining: {
      type: Number,
      default: 0,
      min: [0, 'Remaining amount must be positive']
    },
    transactions: [{
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      date: {
        type: Date,
        default: Date.now
      },
      description: {
        type: String,
        trim: true,
        maxlength: 500
      }
    }]
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        const { __v, ...budget } = ret;
        return budget;
      }
    }
  }
);

// Calculate remaining budget before saving
budgetSchema.pre('save', function (next) {
  this.remaining = this.totalBudget - this.spent;
  next();
});

// Indexes
budgetSchema.index({ campaign: 1 });

export const Budget = mongoose.model<IBudgetDocument>('Budget', budgetSchema);

