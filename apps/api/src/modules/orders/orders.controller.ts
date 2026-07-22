import { Request, Response } from 'express';
import { getUserOrdersService } from './orders.service';

export async function getOrdersHandler(req: Request, res: Response) {
  try {
    const orders = await getUserOrdersService(req.user!.id);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
