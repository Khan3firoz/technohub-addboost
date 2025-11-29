import { Response, NextFunction } from 'express';
import { Analytics } from '../models/Analytics.model';
import { Campaign } from '../models/Campaign.model';
import { successResponse } from '../utils/response.util';
import { AuthRequest } from '../types';

export const recordAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const analyticsData = {
      campaign: campaignId,
      ...req.body
    };

    const analytics = await Analytics.create(analyticsData);

    // Update campaign metrics
    const campaign = await Campaign.findById(campaignId);
    if (campaign) {
      campaign.metrics.impressions += req.body.impressions || 0;
      campaign.metrics.clicks += req.body.clicks || 0;
      campaign.metrics.conversions += req.body.conversions || 0;
      campaign.spent += req.body.spend || 0;
      await campaign.save();
    }

    res.status(201).json(successResponse(analytics, 'Analytics recorded successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCampaignAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate } = req.query;

    const filter: any = { campaign: campaignId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const analytics = await Analytics.find(filter).sort({ date: -1 });

    res
      .status(200)
      .json(successResponse(analytics, 'Analytics retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAggregatedStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;

    const stats = await Analytics.aggregate([
      { $match: { campaign: campaignId } },
      {
        $group: {
          _id: null,
          totalImpressions: { $sum: '$impressions' },
          totalClicks: { $sum: '$clicks' },
          totalConversions: { $sum: '$conversions' },
          totalSpend: { $sum: '$spend' },
          avgCTR: {
            $avg: {
              $cond: [
                { $gt: ['$impressions', 0] },
                { $multiply: [{ $divide: ['$clicks', '$impressions'] }, 100] },
                0
              ]
            }
          },
          avgConversionRate: {
            $avg: {
              $cond: [
                { $gt: ['$clicks', 0] },
                { $multiply: [{ $divide: ['$conversions', '$clicks'] }, 100] },
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {};

    res
      .status(200)
      .json(successResponse(result, 'Aggregated stats retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const exportReport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { campaignId } = req.params;
    const { startDate, endDate, format = 'json' } = req.query;

    const filter: any = { campaign: campaignId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const analytics = await Analytics.find(filter)
      .populate('campaign', 'name type')
      .sort({ date: -1 });

    if (format === 'csv') {
      // Generate CSV format
      let csv = 'Date,Impressions,Clicks,Conversions,Spend,CTR,Conversion Rate\n';
      analytics.forEach((record) => {
        const ctr =
          record.impressions > 0
            ? ((record.clicks / record.impressions) * 100).toFixed(2)
            : '0';
        const convRate =
          record.clicks > 0
            ? ((record.conversions / record.clicks) * 100).toFixed(2)
            : '0';
        csv += `${record.date.toISOString()},${record.impressions},${
          record.clicks
        },${record.conversions},${record.spend},${ctr}%,${convRate}%\n`;
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=campaign-${campaignId}-report.csv`
      );
      res.status(200).send(csv);
    } else {
      res.status(200).json(successResponse(analytics, 'Report exported successfully'));
    }
  } catch (error) {
    next(error);
  }
};

