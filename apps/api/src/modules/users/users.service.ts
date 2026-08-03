import { prisma } from '@caguei/db';

export async function checkUserExistsService(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return !!user;
}

export async function listUsersService() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function updateUserRoleService(userId: string, role: 'ADMIN' | 'CUSTOMER') {
  const targetRole = await prisma.role.findUnique({ where: { name: role } });

  return prisma.user.update({
    where: { id: userId },
    data: {
      role,
      roleId: targetRole?.id ?? null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}
