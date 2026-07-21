import type { Metadata } from 'next';
import OnTapCauSaiClient from './OnTapCauSaiClient';

export const metadata: Metadata = {
  title: 'Ôn lại câu sai',
  description: 'Ôn lại những câu bé từng trả lời sai để nhớ lâu và tiến bộ hơn.',
  alternates: { canonical: '/on-tap-cau-sai' },
  robots: { index: false, follow: true },
};

export default function Page() {
  return <OnTapCauSaiClient />;
}
