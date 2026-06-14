import type { Metadata } from 'next';
import DocVanGhepChuGame from './DocVanGhepChuGame';

export const metadata: Metadata = {
  title: 'Ghép Chữ Thành Vần | Học Cùng Bé',
  description: 'Trò chơi ghép chữ thành vần, giúp bé học đọc và phát âm tiếng Việt qua drag-drop đơn giản',
};

export default function Page() {
  return <DocVanGhepChuGame />;
}
