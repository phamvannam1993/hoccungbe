import type { Metadata } from 'next';
import StadiumFrame from '../../StadiumFrame';
import RoomClient from './RoomClient';
import { normalizeCode } from '../../../lib/sanChoiRooms';

// Trang phòng là nội dung riêng tư, ngắn hạn (48 giờ) → không cho Google lập chỉ mục.
export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Phòng thi đấu ${normalizeCode(code)} — Sân chơi Trí tuệ`,
    description: 'Vào phòng, làm 10 câu thử thách và so điểm cùng bạn bè trên Sân chơi Trí tuệ.',
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const c = normalizeCode(code);
  return (
    <StadiumFrame
      max="max-w-4xl"
      crumb={[
        { label: 'Trang chủ', href: '/' },
        { label: 'Sân chơi Trí tuệ', href: '/san-choi-tri-tue' },
        { label: 'Phòng thi đấu', href: '/san-choi-tri-tue/phong' },
        { label: c },
      ]}
    >
      <RoomClient code={c} />
    </StadiumFrame>
  );
}
