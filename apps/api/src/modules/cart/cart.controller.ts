import { Request, Response } from 'express';
import {
  getUserCartService,
  addToCartService,
  updateCartItemService,
  deleteCartItemService,
  clearCartService,
} from './cart.service';

export async function getCartHandler(req: Request, res: Response) {
  try {
    const cartItems = await getUserCartService(req.user!.id);
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addToCartHandler(req: Request, res: Response) {
  try {
    const { productId, quantity, size } = req.body;
    if (!productId || !size) {
      return res.status(400).json({ error: 'ProductId and Size are required' });
    }

    const parsedQty = parseInt(quantity) || 1;
    const item = await addToCartService(req.user!.id, productId, parsedQty, size);
    res.json(item);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateCartHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const parsedQty = parseInt(quantity);

    if (isNaN(parsedQty) || parsedQty <= 0) {
      return res.status(400).json({ error: 'Valid positive quantity required' });
    }

    const result = await updateCartItemService(req.user!.id, id, parsedQty);
    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.json(result.data);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteCartItemHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await deleteCartItemService(req.user!.id, id);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function clearCartHandler(req: Request, res: Response) {
  try {
    await clearCartService(req.user!.id);
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
