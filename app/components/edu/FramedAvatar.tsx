'use client';

import { useEffect, useState } from 'react';
import { ChildAvatar } from './KidIcon';
import { getEquippedFrame, AVATAR_EVENT, type Frame } from '../../lib/frames';

type ChildLike = { id?: number; gender?: string; avatarUrl?: string } | null;

/**
 * Avatar của bé kèm KHUNG đang đeo (nếu có). Bọc quanh ChildAvatar bằng vòng gradient.
 * Đọc khung sau khi mount + nghe AVATAR_EVENT để đổi khung tức thì. Không khung → hiện
 * ChildAvatar như thường (tránh lệch hydration).
 */
export default function FramedAvatar({ child, className = 'h-12 w-12' }: { child?: ChildLike; className?: string }) {
  const [frame, setFrame] = useState<Frame | null>(null);

  useEffect(() => {
    const sync = () => setFrame(child?.id ? getEquippedFrame(child.id) : null);
    sync();
    window.addEventListener(AVATAR_EVENT, sync);
    return () => window.removeEventListener(AVATAR_EVENT, sync);
  }, [child?.id]);

  if (!frame) return <ChildAvatar child={child} className={className} />;

  return (
    <span className="inline-flex rounded-full" style={{ background: frame.ring, padding: 3 }}>
      <ChildAvatar child={child} className={className} />
    </span>
  );
}
