import { Request, Response } from 'express';
import { getAnalyticsOverviewService } from './analytics.service';

export async function getAnalyticsOverviewHandler(req: Request, res: Response) {
  try {
    const data = await getAnalyticsOverviewService();
    res.json(data);
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
