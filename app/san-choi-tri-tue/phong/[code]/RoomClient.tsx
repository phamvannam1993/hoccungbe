'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import PlayModal from '../../PlayModal';
import { useKid } from '../../useKid';
import { buildRoomChallenge, capRun } from '../../../lib/sanChoi';
import {
  RoomError, getRoom, rememberRoom, roomUrl, shareText, submitRoom, type RoomView,
} from '../../../lib/sanChoiRooms';
import FramedAvatar from '../../../components/edu/FramedAvatar';
import { ChildAvatar, childAvatar } from '../../../components/edu/KidIcon';

const MEDAL = ['🥇', '🥈', '🥉'];
const REFRESH_MS = 10_000;
// Đồng hồ cho các handler/interval (đặt ngoài component để lint không nhầm là gọi trong lúc render).
const nowMs = () => Date.now();
function hashN(s: string) { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; }

function timeLeft(ms: number): string {
  if (ms <= 0) return 'Đã kết thúc';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h >= 1) return `Còn ${h} giờ ${m} phút`;
  const s = Math.floor((ms % 60000) / 1000);
  return `Còn ${m}:${String(s).padStart(2, '0')}`;
}
function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  return m ? `${m} phút ${sec % 60} giây` : `${sec} giây`;
}

export default function RoomClient({ code }: { code: string }) {
  const kid = useKid();
  const [room, setRoom] = useState<RoomView | null>(null);
  const [error, setError] = useState<RoomError | null>(null);
  const [now, setNow] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState('');
  const [myRank, setMyRank] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await getRoom(code);
      setRoom(r); setError(null); rememberRoom(r);
    } catch (e) {
      // Lỗi mạng khi tự làm mới: giữ bảng điểm cũ, chỉ báo lỗi khi chưa tải được lần nào.
      setError(e instanceof RoomError ? e : new RoomError('other', 'Có lỗi xảy ra, thử lại nhé!'));
    }
  }, [code]);

  // Tải lần đầu + tự làm mới mỗi ~10 giây khi tab đang mở.
  useEffect(() => {
    let alive = true;
    const tick = () => { if (alive && document.visibilityState === 'visible') void load(); };
    Promise.resolve().then(() => { if (alive) void load(); });
    const iv = setInterval(tick, REFRESH_MS);
    document.addEventListener('visibilitychange', tick);
    return () => { alive = false; clearInterval(iv); document.removeEventListener('visibilitychange', tick); };
  }, [load]);

  // Đồng hồ đếm ngược tới lúc phòng đóng.
  useEffect(() => {
    const iv = setInterval(() => setNow(nowMs()), 1000);
    Promise.resolve().then(() => setNow(nowMs()));
    return () => clearInterval(iv);
  }, []);

  // Đề phòng: tất định theo seed + lớp; bảng điểm tự làm mới không sinh lại đề.
  const seed = room?.seed;
  const roomGrade = room?.grade;
  const questions = useMemo(() => (seed && roomGrade ? buildRoomChallenge(seed, roomGrade) : []), [seed, roomGrade]);
  const msLeft = room && now ? new Date(room.expiresAt).getTime() - now : 1;
  const expired = !!room && (room.expired || msLeft <= 0);
  const me = kid.name;
  const mine = room?.players.find((p) => p.name === me);

  const copy = async (what: 'code' | 'link' | 'text') => {
    if (!room) return;
    const text = what === 'code' ? room.code : what === 'link' ? roomUrl(room.code) : shareText(room);
    try { await navigator.clipboard.writeText(text); setCopied(what); setTimeout(() => setCopied(''), 2000); } catch { /* trình duyệt chặn */ }
  };
  const share = async () => {
    if (!room) return;
    if (navigator.share) {
      try { await navigator.share({ title: `Phòng thi đấu ${room.code}`, text: shareText(room) }); } catch { /* bé huỷ */ }
    } else void copy('text');
  };

  const handleFinish = useCallback(async (score: number, correct: number, timeSec: number, name: string): Promise<ReactNode> => {
    try {
      const res = await submitRoom(code, { name: name || 'Bé', avatar: childAvatar(kid.child), score: capRun(score), correct, time: timeSec });
      const { myRank: rank, ...view } = res;
      setRoom(view); setMyRank(rank || null);
      return (
        <>
          <p className="mt-3 rounded-2xl bg-sky-50 px-4 py-2 text-base font-black text-sky-700">
            🏆 Bé đang đứng hạng {rank || '?'} trong phòng!
          </p>
          <p className="mt-2 text-xs font-bold text-slate-500">Phòng giữ lượt điểm cao nhất của bé. Lượt trong phòng không cộng sao.</p>
        </>
      );
    } catch (e) {
      const msg = e instanceof RoomError ? e.message : 'Chưa lưu được điểm, thử lại nhé!';
      if (e instanceof RoomError && e.kind === 'closed') void load();
      return <p className="mt-3 rounded-2xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600" role="alert">{msg}</p>;
    }
  }, [code, kid.child, load]);

  // ── Lỗi khi chưa có dữ liệu phòng ──
  if (!room) {
    if (!error) {
      return <div className="h-64 animate-pulse rounded-[28px] bg-white/70" aria-label="Đang tải phòng" />;
    }
    return (
      <section className="rounded-[28px] border-4 border-sky-100 bg-white p-6 text-center" style={{ boxShadow: '0 5px 0 #bae6fd' }}>
        <p className="text-5xl" aria-hidden>{error.kind === 'not-found' ? '🔍' : error.kind === 'not-ready' ? '🚧' : '📡'}</p>
        <h1 className="kid-display mt-2 text-2xl font-black text-slate-800">
          {error.kind === 'not-found' ? `Không có phòng ${code}` : error.kind === 'not-ready' ? 'Phòng thi đấu chưa sẵn sàng' : 'Chưa tải được phòng'}
        </h1>
        <p className="mt-2 text-sm font-bold text-slate-600">{error.message}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {error.kind !== 'not-ready' && error.kind !== 'not-found' && (
            <button type="button" onClick={() => void load()} className="kid-btn-3d"
              style={{ background: 'linear-gradient(180deg,#38BDF8,#2563EB)', boxShadow: '0 4px 0 #1E40AF' }}>
              Thử lại
            </button>
          )}
          <Link href="/san-choi-tri-tue/phong" className="kid-btn-3d"
            style={{ background: 'linear-gradient(180deg,#FFB547,#F97316)', boxShadow: '0 4px 0 #C2410C' }}>
            Nhập mã khác
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Đầu phòng: tên, chủ phòng, lớp, thời gian còn lại */}
      <section className="relative overflow-hidden rounded-[28px] p-5 text-white sm:p-7"
        style={{
          background: expired
            ? 'linear-gradient(135deg,#64748B,#334155)'
            : 'radial-gradient(120% 120% at 0% 0%, #7C5CFF 0%, #5B3BE8 40%, #2F6BFF 100%)',
          boxShadow: expired ? '0 8px 0 #1e293b' : '0 8px 0 #2b1fa8, 0 18px 34px rgba(60,40,200,.28)',
        }}>
        <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#FFE27A]">
          📣 Phòng thi đấu · Lớp {room.grade}
        </p>
        <h1 className="kid-display mt-2 text-2xl font-black leading-tight sm:text-4xl" style={{ textShadow: '0 3px 0 rgba(30,20,120,.4)' }}>{room.title}</h1>
        <p className="mt-1 text-sm font-bold text-white/85">Chủ phòng: {room.hostName} · {room.players.length} bạn đã chơi</p>
        <p className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-black ${expired ? 'bg-white/20' : 'bg-[#FFE27A] text-[#7a4a00]'}`}>
          ⏰ {expired ? 'Phòng đã kết thúc' : now ? timeLeft(msLeft) : '…'}
        </p>
      </section>

      {/* Mã mời */}
      {!expired && (
        <section className="mt-4 rounded-[24px] border-4 border-orange-200 bg-white p-4 sm:p-5" style={{ boxShadow: '0 5px 0 #fdba74' }}>
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <p className="text-xs font-black uppercase tracking-widest text-orange-500">Mã mời bạn bè</p>
              <p className="kid-display text-5xl font-black tracking-[0.25em] text-slate-800">{room.code}</p>
            </div>
            <div className="grid w-full flex-1 grid-cols-3 gap-2">
              <button type="button" onClick={() => void copy('code')} className="rounded-2xl bg-orange-50 px-2 py-2.5 text-xs font-black text-orange-700 hover:bg-orange-100 sm:text-sm" style={{ boxShadow: '0 3px 0 #fed7aa' }}>
                {copied === 'code' ? '✅ Đã chép' : '📋 Sao chép mã'}
              </button>
              <button type="button" onClick={() => void copy('link')} className="rounded-2xl bg-sky-50 px-2 py-2.5 text-xs font-black text-sky-700 hover:bg-sky-100 sm:text-sm" style={{ boxShadow: '0 3px 0 #bae6fd' }}>
                {copied === 'link' ? '✅ Đã chép' : '🔗 Sao chép link'}
              </button>
              <button type="button" onClick={() => void share()} className="rounded-2xl bg-pink-50 px-2 py-2.5 text-xs font-black text-pink-700 hover:bg-pink-100 sm:text-sm" style={{ boxShadow: '0 3px 0 #fbcfe8' }}>
                {copied === 'text' ? '✅ Đã chép' : '💬 Chia sẻ'}
              </button>
            </div>
          </div>
          <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-500 [overflow-wrap:anywhere]">{shareText(room)}</p>
        </section>
      )}

      {/* Nút làm bài / kết thúc */}
      <div className="mt-4">
        {expired ? (
          <div className="flex flex-col items-center gap-3 rounded-[24px] bg-white/90 p-4 text-center sm:flex-row sm:text-left">
            <p className="flex-1 text-sm font-bold text-slate-600">⏰ Phòng đã đóng — đây là bảng điểm chung cuộc. Rủ bạn bè vào phòng mới nhé!</p>
            <Link href="/san-choi-tri-tue/phong" className="kid-btn-3d shrink-0"
              style={{ background: 'linear-gradient(180deg,#FFB547,#F97316)', boxShadow: '0 4px 0 #C2410C' }}>
              Tạo phòng mới
            </Link>
          </div>
        ) : (
          <button type="button" onClick={() => setPlaying(true)} disabled={!kid.ready || !questions.length}
            className="kid-btn-3d w-full text-xl"
            style={{ background: 'linear-gradient(180deg,#4ADE80,#16A34A)', boxShadow: '0 5px 0 #15803D' }}>
            {mine ? 'Làm lại để nâng điểm ▶' : 'Làm bài ▶'}
          </button>
        )}
      </div>

      {/* Bảng điểm */}
      <section className="mt-4 rounded-[24px] border-4 border-violet-100 bg-white p-4" style={{ boxShadow: '0 5px 0 #ddd6fe' }}>
        <div className="flex items-center justify-between gap-2">
          <h2 className="kid-display text-lg font-black text-slate-800">🏆 Bảng điểm phòng</h2>
          {(myRank || mine) && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-700">Bé: hạng {myRank || mine?.rank}</span>}
        </div>
        {room.players.length === 0 ? (
          <p className="mt-3 rounded-2xl bg-violet-50 px-4 py-6 text-center text-sm font-bold text-violet-500">
            {expired ? 'Phòng đã đóng mà chưa có ai chơi.' : 'Chưa có ai làm bài — bé hãy là người đầu tiên! 🚀'}
          </p>
        ) : (
          <ol className="mt-3 space-y-1.5">
            {room.players.map((p) => {
              const isMe = !!me && p.name === me;
              return (
                <li key={p.name} className={`flex items-center gap-2.5 rounded-2xl px-2.5 py-1.5 ${isMe ? 'border-2 border-amber-300 bg-amber-50' : 'bg-slate-50'}`}>
                  <span className="w-7 shrink-0 text-center text-lg font-black text-slate-500">{p.rank <= 3 ? MEDAL[p.rank - 1] : p.rank}</span>
                  {isMe && kid.child
                    ? <FramedAvatar child={kid.child} className="h-8 w-8" />
                    : <ChildAvatar child={{ id: hashN(p.name), avatarUrl: p.avatar || undefined }} className="h-8 w-8" />}
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-black ${isMe ? 'text-amber-700' : 'text-slate-700'}`}>{p.name}{isMe && ' (bé)'}</span>
                    <span className="block text-[11px] font-bold text-slate-400">Đúng {p.correct}/10 · {fmtTime(p.timeSec)}</span>
                  </span>
                  <span className="shrink-0 text-sm font-black text-violet-600">{p.score} điểm</span>
                </li>
              );
            })}
          </ol>
        )}
        {!expired && <p className="mt-2 text-right text-[11px] font-bold text-slate-400">Bảng tự cập nhật mỗi 10 giây</p>}
      </section>

      <p className="mt-5 text-center text-sm font-bold text-slate-600">
        <Link href="/san-choi-tri-tue" className="text-violet-700 hover:underline">← Về Sân chơi Trí tuệ</Link>
      </p>

      {playing && (
        <PlayModal
          questions={questions}
          emoji="📣"
          title={room.title}
          intro={
            <p className="mt-3 rounded-2xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
              Cả phòng làm cùng một đề lớp {room.grade}. Chơi lại thoải mái — phòng giữ điểm cao nhất của bé (không cộng sao).
            </p>
          }
          needName={kid.needName}
          initialName={kid.name}
          onSaveNick={kid.saveNick}
          onFinish={handleFinish}
          onClose={() => setPlaying(false)}
          closeLabel="Xem bảng điểm"
        />
      )}
    </>
  );
}
