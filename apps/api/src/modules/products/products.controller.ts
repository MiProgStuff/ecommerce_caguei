import { Request, Response } from 'express';
import { getProductsService, getProductBySlugService } from './products.service';

export async function getProductsHandler(req: Request, res: Response) {
  try {
    const { category } = req.query;
    const products = await getProductsService(category ? String(category) : undefined);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProductBySlugHandler(req: Request, res: Response) {
  try {
    const { slug } = req.params;
    const product = await getProductBySlugService(slug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
