import { Request, Response } from 'express';
import { checkUserExistsService, listUsersService, updateUserRoleService } from './users.service';
import { prisma } from '@caguei/db';

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

export async function listUsersHandler(req: Request, res: Response) {
  try {
    const users = await listUsersService();
    res.json({ users });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateUserRoleHandler(req: Request, res: Response) {
  const { id } = req.params;
  const { role } = req.body;

  if (role !== 'ADMIN' && role !== 'CUSTOMER') {
    return res.status(400).json({ error: 'role must be ADMIN or CUSTOMER' });
  }

  try {
    // A SUPER_ADMIN's role is never editable through this endpoint — it's
    // granted only via the seed script, to prevent accidental self-lockout
    // or privilege changes to the platform owner's account.
    const target = await prisma.user.findUnique({ where: { id }, select: { role: true } });
    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (target.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: "A SUPER_ADMIN's role cannot be changed here" });
    }

    const updated = await updateUserRoleService(id, role);
    res.json({ user: updated });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
