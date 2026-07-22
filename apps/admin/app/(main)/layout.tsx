import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '../../lib/auth';
import { QueryProvider } from '@/shared/providers/QueryProvider';
import { AdminSidebar } from '@/shared/components/layout/AdminSidebar';
import { Header } from '@/shared/components/layout/Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/login');
  }

  return (
    <QueryProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-[#141313] text-[#FFFFFF]">
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-[#141313]">
            {children}
          </main>
        </div>
      </div>
    </QueryProvider>
  );
}
