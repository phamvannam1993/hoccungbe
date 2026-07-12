import { renderGameOgImage, OG_SIZE } from '../../lib/game-og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Đoàn Tàu Toán Học - trò chơi giáo dục cho bé | Bé Hay Học';

export default function Image() {
  return renderGameOgImage('train-complete-lessons');
}
