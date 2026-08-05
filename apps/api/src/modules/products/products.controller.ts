import { Request, Response } from 'express';
import {
  getProductsService,
  getProductBySlugService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
} from './products.service';
import { productSchema, productUpdateSchema } from '@caguei/validations';

export async function getProductsHandler(req: Request, res: Response) {
  try {
    const { category, search, page, limit } = req.query;
    const result = await getProductsService({
      category: category ? String(category) : undefined,
      search: search ? String(search) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getProductByIdHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const product = await getProductByIdService(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product by ID:', error);
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

export async function createProductHandler(req: Request, res: Response) {
  try {
    const validation = productSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.format() });
    }

    const newProduct = await createProductService(validation.data);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateProductHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validation = productUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: 'Invalid input', details: validation.error.format() });
    }

    const updated = await updateProductService(id, validation.data);
    res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteProductHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await deleteProductService(id);
    res.json({ success: true, id });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
