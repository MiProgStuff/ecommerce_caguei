import { Request, Response } from 'express';
import { createPaymentIntentService } from './payments.service';

export async function createPaymentIntentHandler(req: Request, res: Response) {
  try {
    const { addressId, items } = req.body;

    if (!addressId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'addressId and items are required' });
    }

    const result = await createPaymentIntentService(req.user!.id, addressId, items);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.json(result.data);
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
