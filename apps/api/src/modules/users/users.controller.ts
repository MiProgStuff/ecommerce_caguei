import { Request, Response } from 'express';
import { checkUserExistsService } from './users.service';

export async function checkUserHandler(req: Request, res: Response) {
  const { email } = req.query;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email parameter is required' });
  }

  try {
    const exists = await checkUserExistsService(email);
    res.json({ exists });
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
