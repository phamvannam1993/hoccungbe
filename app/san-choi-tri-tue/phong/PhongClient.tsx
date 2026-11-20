'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useKid } from '../useKid';
import {
  NOT_READY_MSG, ROOM_CODE_LEN, RoomError, createRoom, getRoom, normalizeCode, recentRooms, rememberRoom, type RecentRoom,
} from '../../lib/sanChoiRooms';

const GRADES = [1, 2, 3, 4, 5];

/** Màn vào Phòng thi đấu: tạo phòng mới hoặc nhập mã 6 ký tự để vào phòng của bạn. */
export default function PhongClient() {
  const router = useRouter();
  const kid = useKid();
  const [title, setTitle] = useState('');
  const [hostName, setHostName] = useState<string | null>(null); // null = chưa sửa → dùng biệt danh đã lưu
  const [grade, setGrade] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState('');
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [joinErr, setJoinErr] = useState('');
  const [recent, setRecent] = useState<RecentRoom[]>([]);

  useEffect(() => {
    let alive = true;
    Promise.resolve().then(() => { if (alive) setRecent(recentRooms()); });
    return () => { alive = false; };
  }, []);

  const g = grade ?? kid.grade;
  const host = (kid.needName ? hostName ?? kid.name : kid.name).trim();

  const create = async () => {
    if (!host || creating) return;
    setCreating(true); setCreateErr('');
    try {
      if (kid.needName) kid.saveNick(host);
      const room = await createRoom(host, g, title);
      rememberRoom(room);
      router.push(`/san-choi-tri-tue/phong/${room.code}`);
    } catch (e) {
      setCreateErr(e instanceof RoomError ? e.message : NOT_READY_MSG);
      setCreating(false);
    }
  };

  const join = async () => {
    const c = normalizeCode(code);
    if (c.length !== ROOM_CODE_LEN || joining) return;
    setJoining(true); setJoinErr('');
    try {
      await getRoom(c);
      router.push(`/san-choi-tri-tue/phong/${c}`);
    } catch (e) {
      setJoinErr(e instanceof RoomError ? e.message : NOT_READY_MSG);
      setJoining(false);
    }
  };

  return (
    <>
      <section className="relative overflow-hidden rounded-[28px] p-5 text-white sm:p-7"
        style={{ background: 'radial-gradient(120% 120% at 0% 0%, #38BDF8 0%, #2563EB 55%, #4338CA 100%)', boxShadow: '0 8px 0 #1e3a8a, 0 18px 34px rgba(37,99,235,.28)' }}>
        <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-[#FFE27A]">📣 Thi cùng bạn bè</p>
        <h1 className="kid-display mt-2 text-3xl font-black leading-tight sm:text-4xl" style={{ textShadow: '0 3px 0 rgba(20,30,120,.4)' }}>Phòng thi đấu</h1>
        <p className="mt-2 max-w-xl text-sm font-bold text-white/90 sm:text-base">
          Tạo phòng rồi gửi mã cho bạn bè. Mọi người làm cùng 10 câu hỏi, lúc nào rảnh cũng được trong <b>48 giờ</b>. Ai điểm cao nhất sẽ đứng đầu phòng!
        </p>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {/* Tạo phòng */}
        <section className="flex flex-col rounded-[24px] border-4 border-orange-200 bg-white p-5" style={{ boxShadow: '0 5px 0 #fdba74' }}>
          <h2 className="kid-display text-xl font-black text-slate-800">✨ Tạo phòng mới</h2>
          {kid.needName && (
            <label className="mt-3 block">
              <span className="text-sm font-black text-slate-700">Biệt danh của bé</span>
              <input value={hostName ?? kid.name} onChange={(e) => setHostName(e.target.value)} maxLength={24} placeholder="Ví dụ: Bin siêu nhân"
                className="mt-1 w-full rounded-2xl border-2 border-orange-200 px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-orange-400" />
            </label>
          )}
          <label className="mt-3 block">
            <span className="text-sm font-black text-slate-700">Tên phòng <span className="font-bold text-slate-400">(không bắt buộc)</span></span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={40}
              placeholder={host ? `Phòng của ${host}` : 'Ví dụ: Lớp 2A thi tài'}
              className="mt-1 w-full rounded-2xl border-2 border-orange-200 px-4 py-2.5 font-bold text-slate-800 outline-none focus:border-orange-400" />
          </label>
          <div className="mt-3">
            <span className="text-sm font-black text-slate-700">Đề dành cho</span>
            <div className="mt-1 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Lớp của đề">
              {GRADES.map((x) => (
                <button key={x} type="button" role="radio" aria-checked={g === x} onClick={() => setGrade(x)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-black transition ${g === x ? 'bg-orange-500 text-white shadow' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}>
                  Lớp {x}
                </button>
              ))}
            </div>
          </div>
          {createErr && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600" role="alert">{createErr}</p>}
          <button type="button" onClick={create} disabled={!host || creating}
            className="kid-btn-3d mt-5 w-full text-lg"
            style={{ background: 'linear-gradient(180deg,#FFB547,#F97316)', boxShadow: '0 4px 0 #C2410C' }}>
            {creating ? 'Đang tạo phòng…' : 'Tạo phòng ▶'}
          </button>
        </section>

        {/* Vào phòng */}
        <section className="flex flex-col rounded-[24px] border-4 border-sky-200 bg-white p-5" style={{ boxShadow: '0 5px 0 #7dd3fc' }}>
          <h2 className="kid-display text-xl font-black text-slate-800">🔑 Vào phòng của bạn</h2>
          <p className="mt-1 text-sm font-bold text-slate-500">Nhập mã 6 ký tự bạn gửi cho bé.</p>
          <label className="mt-4 block">
            <span className="sr-only">Mã phòng</span>
            <input value={code} onChange={(e) => { setCode(normalizeCode(e.target.value)); setJoinErr(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') void join(); }}
              inputMode="text" autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="ABC234"
              className="kid-display w-full rounded-2xl border-2 border-sky-200 px-4 py-3 text-center text-3xl font-black uppercase tracking-[0.35em] text-slate-800 outline-none placeholder:text-slate-200 focus:border-sky-400" />
          </label>
          <div className="mt-2 flex justify-center gap-1.5" aria-hidden>
            {Array.from({ length: ROOM_CODE_LEN }, (_, i) => (
              <span key={i} className={`h-2 w-6 rounded-full ${i < code.length ? 'bg-sky-400' : 'bg-sky-100'}`} />
            ))}
          </div>
          {joinErr && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600" role="alert">{joinErr}</p>}
          <button type="button" onClick={join} disabled={code.length !== ROOM_CODE_LEN || joining}
            className="kid-btn-3d mt-auto w-full text-lg"
            style={{ background: 'linear-gradient(180deg,#38BDF8,#2563EB)', boxShadow: '0 4px 0 #1E40AF', marginTop: 20 }}>
            {joining ? 'Đang tìm phòng…' : 'Vào phòng ▶'}
          </button>
        </section>
      </div>

      {recent.length > 0 && (
        <section className="mt-5 rounded-[24px] bg-white/90 p-4" style={{ boxShadow: '0 5px 0 rgba(22,163,74,.25)' }}>
          <h2 className="kid-display text-lg font-black text-slate-800">🕘 Phòng gần đây</h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {recent.map((r) => (
              <li key={r.code}>
                <Link href={`/san-choi-tri-tue/phong/${r.code}`} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-3 py-2 transition hover:bg-sky-50">
                  <span className="kid-display rounded-xl bg-sky-100 px-2 py-1 text-sm font-black tracking-widest text-sky-700">{r.code}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-700">{r.title}</span>
                  <span className="text-sm font-black text-sky-600">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-5 text-center text-sm font-bold text-slate-600">
        <Link href="/san-choi-tri-tue" className="text-violet-700 hover:underline">← Về Sân chơi Trí tuệ</Link>
      </p>
    </>
  );
}
