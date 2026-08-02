import { OrderDetailPage } from '@/features/orders/components/OrderDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
