import { prisma } from '@caguei/db';

export async function checkUserExistsService(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return !!user;
}
