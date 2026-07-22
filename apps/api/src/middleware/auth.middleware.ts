import { Request, Response, NextFunction } from 'express';
import { auth } from '../../lib/auth';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
}
