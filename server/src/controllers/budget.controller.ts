import { Response, NextFunction } from 'express';
import { Budget } from '../models/Budget.model';
import { Campaign } from '../models/Campaign.model';
import { successResponse } from '../utils/response.util';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const setBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const { totalBudget, dailyBudget } = req.body;

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    // Check if budget already exists
    const existingBudget = await Budget.findOne({ campaign: campaignId });
    if (existingBudget) {
      throw new AppError('Budget already exists for this campaign', 400);
    }

    const budget = await Budget.create({
      campaign: campaignId,
      totalBudget,
      dailyBudget,
      spent: 0,
      remaining: totalBudget
    });

    // Update campaign budget
    campaign.budget = totalBudget;
    await campaign.save();

    res.status(201).json(successResponse(budget, 'Budget set successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;

    const budget = await Budget.findOne({ campaign: campaignId }).populate(
      'campaign',
      'name'
    );

    if (!budget) {
      throw new AppError('Budget not found for this campaign', 404);
    }

    res.status(200).json(successResponse(budget, 'Budget retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const { totalBudget, dailyBudget } = req.body;

    const budget = await Budget.findOne({ campaign: campaignId });

    if (!budget) {
      throw new AppError('Budget not found for this campaign', 404);
    }

    if (totalBudget !== undefined) {
      budget.totalBudget = totalBudget;
      budget.remaining = totalBudget - budget.spent;
    }

    if (dailyBudget !== undefined) {
      budget.dailyBudget = dailyBudget;
    }

    await budget.save();

    // Update campaign budget
    const campaign = await Campaign.findById(campaignId);
    if (campaign && totalBudget !== undefined) {
      campaign.budget = totalBudget;
      await campaign.save();
    }

    res.status(200).json(successResponse(budget, 'Budget updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const trackSpending = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const { amount, description } = req.body;

    const budget = await Budget.findOne({ campaign: campaignId });

    if (!budget) {
      throw new AppError('Budget not found for this campaign', 404);
    }

    if (budget.spent + amount > budget.totalBudget) {
      throw new AppError('Transaction would exceed total budget', 400);
    }

    budget.spent += amount;
    budget.transactions.push({
      amount,
      date: new Date(),
      description: description || 'Campaign spending'
    });

    await budget.save();

    res.status(200).json(successResponse(budget, 'Spending tracked successfully'));
  } catch (error) {
    next(error);
  }
};

export const getBudgetHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;

    const budget = await Budget.findOne({ campaign: campaignId });

    if (!budget) {
      throw new AppError('Budget not found for this campaign', 404);
    }

    res
      .status(200)
      .json(
        successResponse(budget.transactions, 'Budget history retrieved successfully')
      );
  } catch (error) {
    next(error);
  }
};

