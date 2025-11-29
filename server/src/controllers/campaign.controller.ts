import { Response, NextFunction } from 'express';
import { Campaign } from '../models/Campaign.model';
import { successResponse, paginatedResponse } from '../utils/response.util';
import { calculatePagination } from '../utils/pagination.util';
import { AuthRequest, CampaignStatus, UserRole } from '../types';
import { AppError } from '../middlewares/error.middleware';

export const createCampaign = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const campaignData = {
      ...req.body,
      createdBy: req.user.id
    };

    const campaign = await Campaign.create(campaignData);

    res.status(201).json(successResponse(campaign, 'Campaign created successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCampaigns = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      startDate,
      endDate,
      search
    } = req.query;

    const filter: any = {};

    // Role-based filtering
    if (req.user?.role === UserRole.CLIENT) {
      filter.assignedClients = req.user.id;
    } else if (req.user?.role === UserRole.CAMPAIGN_MANAGER) {
      filter.createdBy = req.user.id;
    }

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate as string);
      if (endDate) filter.startDate.$lte = new Date(endDate as string);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const { skip, limit: limitNum } = calculatePagination(
      Number(page),
      Number(limit)
    );

    const [campaigns, total] = await Promise.all([
      Campaign.find(filter)
        .populate('createdBy', 'username email')
        .populate('assignedClients', 'username email')
        .skip(skip)
        .limit(limitNum)
        .sort({ createdAt: -1 }),
      Campaign.countDocuments(filter)
    ]);

    res.status(200).json(paginatedResponse(campaigns, total, Number(page), limitNum));
  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id)
      .populate('createdBy', 'username email')
      .populate('assignedClients', 'username email');

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    // Check permissions
    if (
      req.user?.role === UserRole.CLIENT &&
      !campaign.assignedClients.some(
        (client: any) => client._id.toString() === req.user?.id
      )
    ) {
      throw new AppError('Access denied', 403);
    }

    res.status(200).json(successResponse(campaign, 'Campaign retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateCampaign = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    // Check permissions
    if (
      req.user?.role !== UserRole.ADMIN &&
      campaign.createdBy.toString() !== req.user?.id
    ) {
      throw new AppError('Access denied', 403);
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    res
      .status(200)
      .json(successResponse(updatedCampaign, 'Campaign updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findById(id);

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    // Check permissions
    if (
      req.user?.role !== UserRole.ADMIN &&
      campaign.createdBy.toString() !== req.user?.id
    ) {
      throw new AppError('Access denied', 403);
    }

    await Campaign.findByIdAndDelete(id);

    res.status(200).json(successResponse(null, 'Campaign deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const pauseCampaign = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { status: CampaignStatus.PAUSED },
      { new: true }
    );

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    res.status(200).json(successResponse(campaign, 'Campaign paused successfully'));
  } catch (error) {
    next(error);
  }
};

export const activateCampaign = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { status: CampaignStatus.ACTIVE },
      { new: true }
    );

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    res.status(200).json(successResponse(campaign, 'Campaign activated successfully'));
  } catch (error) {
    next(error);
  }
};

export const assignClients = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { clientIds } = req.body;

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      { assignedClients: clientIds },
      { new: true }
    ).populate('assignedClients', 'username email');

    if (!campaign) {
      throw new AppError('Campaign not found', 404);
    }

    res
      .status(200)
      .json(successResponse(campaign, 'Clients assigned successfully'));
  } catch (error) {
    next(error);
  }
};

