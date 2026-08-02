import { Request, Response } from 'express';
import {
  getUserOrdersService,
  getAllOrdersService,
  getOrderByIdService,
  fulfillOrderService,
} from './orders.service';
import { fulfillmentSchema } from '@caguei/validations';

export async function getOrdersHandler(req: Request, res: Response) {
  try {
    const userRole = req.user?.role;

    if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
      const { status, page, limit } = req.query;
      const result = await getAllOrdersService({
        status: status ? String(status) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
      });
      return res.json(result);
    }

    // Standard client user: get own orders only
    const orders = await getUserOrdersService(req.user!.id);
    return res.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOrderByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const order = await getOrderByIdService(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Role check: users can only see their own orders, admins can see any order
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN' && order.userId !== req.user?.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function fulfillOrderHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Check RBAC permission for order fulfillment
    if (req.user?.role !== 'SUPER_ADMIN' && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const validation = fulfillmentSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.format() });
    }

    const order = await getOrderByIdService(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await fulfillOrderService(
      id,
      validation.data.carrier,
      validation.data.trackingCode
    );

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error fulfilling order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
