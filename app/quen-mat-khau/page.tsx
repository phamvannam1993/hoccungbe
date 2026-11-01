import type { Metadata } from 'next';
import ForgotPasswordForm from './ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Quên mật khẩu',
  description: 'Nhận link đặt lại mật khẩu tài khoản Bé Hay Học qua email.',
  alternates: { canonical: '/quen-mat-khau' },
  robots: { index: false, follow: true },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
