import { Request, Response, NextFunction } from 'express';
import { prisma, PermissionAction } from '@caguei/db';

export function requirePermission(resource: string, action: PermissionAction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Session required' });
      }

      // 1. SUPER_ADMIN gets complete system override bypass
      if (user.role === 'SUPER_ADMIN') {
        return next();
      }

      // 2. Fetch the user's roleId from the database if not cached in req.user session
      let roleId = (user as any).roleId;
      if (!roleId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { roleId: true },
        });
        roleId = dbUser?.roleId || null;
      }

      if (!roleId) {
        return res.status(403).json({ error: 'Forbidden: No role assigned' });
      }

      // 3. Query role permission linkage
      const hasPermission = await prisma.rolePermission.findFirst({
        where: {
          roleId,
          permission: {
            resource,
            action,
          },
        },
      });

      if (!hasPermission) {
        return res.status(403).json({
          error: `Forbidden: Missing required authorization [${resource}:${action}]`,
        });
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      return res.status(500).json({ error: 'Internal server error during authorization check' });
    }
  };
}
