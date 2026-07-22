import { prisma } from '@caguei/db';

export interface CreateAddressDTO {
  street: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  label?: string;
}

export async function getUserAddressesService(userId: string) {
  return await prisma.address.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createAddressService(userId: string, data: CreateAddressDTO) {
  return await prisma.address.create({
    data: {
      street: data.street,
      city: data.city,
      state: data.state || '',
      postalCode: data.postalCode || '',
      country: data.country,
      label: data.label || 'home',
      userId,
    },
  });
}

export async function deleteAddressService(userId: string, addressId: string) {
  const address = await prisma.address.findUnique({ where: { id: addressId } });

  if (!address) {
    return { status: 404, error: 'Address not found' };
  }
  if (address.userId !== userId) {
    return { status: 403, error: 'Forbidden' };
  }

  await prisma.address.delete({ where: { id: addressId } });
  return { status: 200, message: 'Address deleted successfully' };
}
