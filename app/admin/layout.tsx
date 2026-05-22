import { Toaster } from 'sonner';
import AdminShell from './components/AdminShell';

export const metadata = {
  title: 'Trang quản trị - Bé Hay Học',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminShell>
      {children}
      <Toaster position="top-right" richColors />
    </AdminShell>
  );
}

