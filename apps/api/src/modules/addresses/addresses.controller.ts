import { Request, Response } from 'express';
import {
  getUserAddressesService,
  createAddressService,
  deleteAddressService,
} from './addresses.service';

export async function getAddressesHandler(req: Request, res: Response) {
  try {
    const addresses = await getUserAddressesService(req.user!.id);
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createAddressHandler(req: Request, res: Response) {
  try {
    const { street, city, state, postalCode, country, label } = req.body;
    if (!street || !city || !country) {
      return res.status(400).json({ error: 'Street, City, and Country are required' });
    }

    const newAddress = await createAddressService(req.user!.id, {
      street,
      city,
      state,
      postalCode,
      country,
      label,
    });
    res.json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteAddressHandler(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const result = await deleteAddressService(req.user!.id, id);

    if (result.error) {
      return res.status(result.status).json({ error: result.error });
    }

    res.json({ success: true, message: result.message });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
