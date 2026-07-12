import { renderGameOgImage, OG_SIZE } from '../../lib/game-og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Thỏ Vào Hang - trò chơi giáo dục cho bé | Bé Hay Học';

export default function Image() {
  return renderGameOgImage('rabbit-hole');
}
