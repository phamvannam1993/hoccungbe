
'use client';

import dynamic from 'next/dynamic';

const FishingLettersGame = dynamic(() => import('./FishingLettersGame'), {
  ssr: false,
  loading: () => <div className="flex min-h-screen items-center justify-center">Đang tải...</div>,
});

export default function FishingLettersPage() {
  return <FishingLettersGame />;
}
