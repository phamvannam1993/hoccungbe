'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { getStars, getStarState, STARS_EVENT } from '../lib/stars';
import { COLLECTIBLES, COLLECTION_CATEGORIES, getOwned, unlock, type Collectible } from '../lib/collection';
import { getCurrentChildId, listChildren, updateChild, childHistory, childStreak, subjectInfo } from '../lib/childData';
import { BADGES, isEarned, type BadgeContext } from '../lib/achievements';
import { AVATAR_FRAMES, getOwnedFrames, buyFrame, equipFrame, getEquippedFrame, type Frame } from '../lib/frames';
import { confetti, playCorrect, playWrong } from '../lib/celebrate';
import WeeklyQuests from '../components/edu/WeeklyQuests';

type LearnCtx = { lessons: number; perfect: number; subjects: number; currentStreak: number; longestStreak: number; totalActiveDays: number };

export default function BoSuuTapClient() {
  const [childId, setChildId] = useState<number | null>(null);
  const [balance, setBalance] = useState(0);
  const [owned, setOwned] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [learn, setLearn] = useState<LearnCtx | null>(null);
  const [ownedFrames, setOwnedFrames] = useState<string[]>([]);
  const [equippedFrame, setEquippedFrame] = useState('');

  const sync = useCallback(() => {
    const id = getCurrentChildId();
    setChildId(id || null);
    if (id) {
      setBalance(getStars(id));
      setOwned(getOwned(id));
      setOwnedFrames(getOwnedFrames(id));
      setEquippedFrame(getEquippedFrame(id)?.id || '');
    }
  }, []);

  const buyFrameFor = (frame: Frame) => {
    if (!childId) return;
    const res = buyFrame(childId, frame);
    if (res === 'ok') {
      setOwnedFrames(getOwnedFrames(childId));
      setBalance(getStars(childId));
      equipFrame(childId, frame.id);
      setEquippedFrame(frame.id);
      playCorrect();
      confetti('big');
      flash(`🎀 Mở khoá & đeo khung ${frame.name}!`);
    } else if (res === 'poor') {
      playWrong();
      flash(`Chưa đủ sao — cần ${frame.cost} ⭐ cho khung này.`);
    }
  };

  const toggleFrame = (frame: Frame) => {
    if (!childId) return;
    const next = equippedFrame === frame.id ? null : frame.id;
    equipFrame(childId, next);
    setEquippedFrame(next || '');
    playCorrect();
    flash(next ? `Đã đeo khung ${frame.name}!` : 'Đã gỡ khung.');
  };

  useEffect(() => {
    sync();
    setReady(true);
    window.addEventListener(STARS_EVENT, sync);
    (async () => {
      const id = getCurrentChildId();
      if (!id) return;
      try {
        const [kids, hist, streak] = await Promise.all([
          listChildren(),
          childHistory(id, 300).catch(() => []),
          childStreak(id).catch(() => null),
        ]);
        setAvatarUrl(kids.find((k) => k.id === id)?.avatarUrl || '');
        const subjects = new Set(hist.map((h) => subjectInfo(h.courseType).name)).size;
        setLearn({
          lessons: hist.length,
          perfect: hist.filter((h) => (h.score || 0) >= 100).length,
          subjects,
          currentStreak: streak?.currentStreak || 0,
          longestStreak: streak?.longestStreak || 0,
          totalActiveDays: streak?.totalActiveDays || 0,
        });
      } catch {
        /* ignore */
      }
    })();
    return () => window.removeEventListener(STARS_EVENT, sync);
  }, [sync]);

  const setAvatar = async (item: Collectible) => {
    if (!childId || !item.image) return;
    try {
      await updateChild(childId, { avatarUrl: item.image });
      setAvatarUrl(item.image);
      playCorrect();
      flash(`✅ Đã đặt ${item.name} làm ảnh đại diện của bé!`);
    } catch {
      flash('Chưa đặt được avatar, thử lại nhé.');
    }
  };

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const buy = (item: Collectible) => {
    if (!childId) return;
    const res = unlock(childId, item);
    if (res === 'ok') {
      setOwned(getOwned(childId));
      setBalance(getStars(childId));
      playCorrect();
      confetti('big');
      flash(`🎉 Mở khoá ${item.name}!`);
    } else if (res === 'poor') {
      playWrong();
      flash(`Chưa đủ sao — cần ${item.cost} ⭐. Học thêm bài để kiếm sao nhé!`);
    }
  };

  if (!ready) return <p className="py-10 text-center text-slate-400">Đang tải…</p>;

  if (!childId) {
    return (
      <div className="mt-6 rounded-3xl border-4 border-amber-100 bg-white p-8 text-center">
        <p className="text-5xl">⭐</p>
        <h2 className="mt-3 text-xl font-black text-slate-800">Chưa có hồ sơ bé</h2>
        <p className="mt-1 text-slate-500">Tạo hồ sơ và học vài bài để bắt đầu kiếm sao, rồi quay lại đổi quà nhé!</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link href="/ho-so-be" className="rounded-full bg-amber-500 px-5 py-2.5 text-sm font-black text-white shadow">Tạo hồ sơ bé</Link>
          <Link href="/hoc-hom-nay" className="rounded-full border-2 border-amber-200 px-5 py-2.5 text-sm font-black text-amber-600">Bắt đầu học</Link>
        </div>
      </div>
    );
  }

  const ownedCount = owned.length;
  const petsOwned = COLLECTIBLES.filter((i) => i.category === 'pet' && owned.includes(i.id)).length;
  const badgeCtx: BadgeContext | null =
    learn && childId
      ? { ...learn, starsEarned: getStarState(childId).earned, petsOwned, itemsOwned: ownedCount, itemsTotal: COLLECTIBLES.length }
      : null;
  const earnedBadges = badgeCtx ? BADGES.filter((b) => isEarned(b, badgeCtx)).length : 0;

  return (
    <div className="mt-6">
      {/* Ví sao */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border-4 border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 p-5">
        <div>
          <p className="text-sm font-bold text-amber-600">Ví sao của bé</p>
          <p className="text-3xl font-black text-slate-800">⭐ {balance} sao</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-amber-600">Đã sưu tầm</p>
          <p className="text-2xl font-black text-slate-800">{ownedCount}/{COLLECTIBLES.length}</p>
        </div>
      </div>

      <p className="mt-3 text-center text-sm font-semibold text-slate-500">
        Hoàn thành mỗi bài tập được <b className="text-amber-600">+3 đến +7 ⭐</b>. Gom sao để mở khoá nhãn dán và thú cưng đáng yêu!
      </p>

      <div className="mt-6">
        <WeeklyQuests />
      </div>

      {/* Huy hiệu thành tích */}
      {badgeCtx && (
        <section className="mt-6">
          <h2 className="mb-1 text-lg font-black text-slate-800 kid-display">🏅 Huy hiệu thành tích</h2>
          <p className="mb-3 text-sm font-semibold text-slate-500">Đã đạt {earnedBadges}/{BADGES.length} huy hiệu — cố thêm để mở hết nhé!</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {BADGES.map((b) => {
              const { cur, goal } = b.progress(badgeCtx);
              const done = isEarned(b, badgeCtx);
              const pct = goal > 0 ? Math.min(100, Math.round((cur / goal) * 100)) : 0;
              return (
                <div key={b.id} className={`rounded-2xl border-2 p-3 ${done ? 'border-amber-200 bg-amber-50' : 'border-slate-100 bg-white'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl ${done ? '' : 'opacity-30 grayscale'}`}>{b.emoji}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-slate-800">{b.title}</p>
                      <p className="truncate text-[11px] font-semibold text-slate-400">{b.desc}</p>
                    </div>
                  </div>
                  {done ? (
                    <p className="mt-2 text-center text-[11px] font-black text-amber-600">✓ Đã đạt</p>
                  ) : (
                    <div className="mt-2">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                      </div>
                      <p className="mt-1 text-center text-[10px] font-bold text-slate-400">{Math.min(cur, goal)}/{goal}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {COLLECTION_CATEGORIES.map((cat) => (
        <section key={cat.key} className="mt-6">
          <h2 className="mb-3 text-lg font-black text-slate-800 kid-display">{cat.emoji} {cat.label}</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
            {COLLECTIBLES.filter((i) => i.category === cat.key).map((item) => {
              const have = owned.includes(item.id);
              const canBuy = balance >= item.cost;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-center rounded-2xl border-2 p-3 text-center transition ${
                    have ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.name}
                      className={`h-16 w-16 rounded-xl object-cover ${have ? '' : 'opacity-40 grayscale'}`}
                    />
                  ) : (
                    <span className={`text-5xl ${have ? '' : 'opacity-40 grayscale'}`}>{item.emoji}</span>
                  )}
                  <span className="mt-1 text-xs font-bold text-slate-700">{item.name}</span>
                  {have ? (
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-black text-white">Đã có ✓</span>
                      {item.image &&
                        (avatarUrl === item.image ? (
                          <span className="text-[10px] font-black text-sky-600">🎀 Đang là avatar</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAvatar(item)}
                            className="text-[10px] font-bold text-sky-600 underline hover:text-sky-700"
                          >
                            Đặt làm avatar
                          </button>
                        ))}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => buy(item)}
                      className={`mt-2 rounded-full px-2.5 py-1 text-[11px] font-black transition ${
                        canBuy ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      ⭐ {item.cost}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Khung avatar */}
      <section className="mt-6">
        <h2 className="mb-1 text-lg font-black text-slate-800 kid-display">🖼️ Khung avatar</h2>
        <p className="mb-3 text-sm font-semibold text-slate-500">Mở khoá khung để trang trí ảnh đại diện của bé (hiện trên đầu trang).</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {AVATAR_FRAMES.map((f) => {
            const have = ownedFrames.includes(f.id);
            const on = equippedFrame === f.id;
            return (
              <div key={f.id} className={`flex flex-col items-center rounded-2xl border-2 p-3 text-center ${on ? 'border-sky-300 bg-sky-50' : 'border-slate-100 bg-white'}`}>
                <span className="inline-flex rounded-full" style={{ background: f.ring, padding: 4 }}>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl">🙂</span>
                </span>
                <span className="mt-1.5 text-xs font-bold text-slate-700">{f.name}</span>
                {have ? (
                  <button
                    type="button"
                    onClick={() => toggleFrame(f)}
                    className={`mt-2 rounded-full px-2.5 py-1 text-[11px] font-black transition ${on ? 'bg-sky-500 text-white' : 'border-2 border-sky-200 text-sky-600 hover:bg-sky-50'}`}
                  >
                    {on ? '✓ Đang đeo' : 'Đeo'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => buyFrameFor(f)}
                    className={`mt-2 rounded-full px-2.5 py-1 text-[11px] font-black transition ${balance >= f.cost ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-slate-100 text-slate-400'}`}
                  >
                    ⭐ {f.cost}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-8 text-center">
        <Link href="/hoc-hom-nay" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-black text-white shadow-md">
          📚 Học thêm để kiếm sao
        </Link>
      </div>

      {toast && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="rounded-full bg-slate-900/90 px-5 py-2.5 text-sm font-bold text-white shadow-lg">{toast}</div>
        </div>
      )}
    </div>
  );
}
