import { Response, NextFunction } from 'express';
import { Media } from '../models/Media.model';
import { Campaign } from '../models/Campaign.model';
import { successResponse } from '../utils/response.util';
import { AuthRequest } from '../types';
import { AppError } from '../middlewares/error.middleware';
import path from 'path';
import fs from 'fs';

export const uploadMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    const { campaignId } = req.body;

    // If campaignId is provided, verify it exists
    if (campaignId) {
      const campaign = await Campaign.findById(campaignId);
      if (!campaign) {
        // Delete uploaded file
        fs.unlinkSync(req.file.path);
        throw new AppError('Campaign not found', 404);
      }
    }

    const media = await Media.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      uploadedBy: req.user.id,
      campaign: campaignId || undefined
    });

    // If campaign exists, add media URL to campaign
    if (campaignId) {
      await Campaign.findByIdAndUpdate(campaignId, {
        $push: { mediaUrls: media.url }
      });
    }

    res.status(201).json(successResponse(media, 'Media uploaded successfully'));
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        // Ignore cleanup errors
      }
    }
    next(error);
  }
};

export const getMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id)
      .populate('uploadedBy', 'username email')
      .populate('campaign', 'name');

    if (!media) {
      throw new AppError('Media not found', 404);
    }

    res.status(200).json(successResponse(media, 'Media retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteMedia = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const media = await Media.findById(id);

    if (!media) {
      throw new AppError('Media not found', 404);
    }

    // Check permissions
    if (
      req.user?.role !== 'admin' &&
      media.uploadedBy.toString() !== req.user?.id
    ) {
      throw new AppError('Access denied', 403);
    }

    // Delete file from filesystem
    const filePath = path.join(process.cwd(), 'uploads', media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove media reference from campaign if exists
    if (media.campaign) {
      await Campaign.findByIdAndUpdate(media.campaign, {
        $pull: { mediaUrls: media.url }
      });
    }

    await Media.findByIdAndDelete(id);

    res.status(200).json(successResponse(null, 'Media deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const getMediaByCampaign = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;

    const media = await Media.find({ campaign: campaignId })
      .populate('uploadedBy', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(successResponse(media, 'Media retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

