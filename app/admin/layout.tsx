import { Toaster } from 'sonner';
import AdminShell from './components/AdminShell';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang quản trị - Bé Hay Học',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      {children}
      <Toaster position="top-right" richColors />
    </AdminShell>
  );
}

