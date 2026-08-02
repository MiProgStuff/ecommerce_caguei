import { prisma } from '@caguei/db';

async function main() {
  const email = 'soumyamishra2099@gmail.com';
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' },
  });
  console.log('Successfully promoted user:', JSON.stringify(updatedUser, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
