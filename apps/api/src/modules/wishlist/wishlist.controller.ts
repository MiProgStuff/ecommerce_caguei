import { Request, Response } from 'express';
import {
  getUserWishlistService,
  addToWishlistService,
  removeFromWishlistService,
} from './wishlist.service';

export async function getWishlistHandler(req: Request, res: Response) {
  try {
    const products = await getUserWishlistService(req.user!.id);
    res.json(products);
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function addToWishlistHandler(req: Request, res: Response) {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'ProductId is required' });

    const product = await addToWishlistService(req.user!.id, productId);
    res.json(product);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function removeFromWishlistHandler(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    await removeFromWishlistService(req.user!.id, productId);
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    console.error('Error deleting from wishlist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
