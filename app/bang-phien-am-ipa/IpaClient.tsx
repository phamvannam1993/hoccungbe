'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { IPA, NHOM_IPA, CAP_THANH, amTheoNhom, type AmIpa, type NhomAm } from '../lib/ipa';
import { speakEnglish, speakEnglishSlow, speakText, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import KhauHinh from './KhauHinh';
import BanDoNguyenAm from './BanDoNguyenAm';
import GameDoanAm from './GameDoanAm';

// Ghi nhớ những âm bé đã mở xem. Để ở máy bé, không gửi đi đâu — chỉ để bé
// thấy mình đi được bao xa trong 44 âm, và biết còn thiếu âm nào.
const KHOA_LUU = 'bhh_ipa_da_hoc';

// Bảng 44 âm IPA: bấm một ô để mở thẻ chi tiết (khẩu hình, vị trí lưỡi, ví dụ).
//
// KHÔNG có nút "đọc âm rời": máy đọc một âm trơ trọi (/θ/, /ʊ/) ra tiếng ù ù
// chứ không thành âm. Muốn nghe âm thì nghe qua TỪ chứa nó — đó cũng là cách
// người ta thực sự học phát âm.

const TONE: Record<NhomAm, { vien: string; nen: string; chu: string; dam: string }> = {
  don:   { vien: '#fbbf24', nen: '#fffbeb', chu: '#b45309', dam: '#f59e0b' },
  doi:   { vien: '#c084fc', nen: '#faf5ff', chu: '#7e22ce', dam: '#a855f7' },
  phuam: { vien: '#60a5fa', nen: '#eff6ff', chu: '#1d4ed8', dam: '#3b82f6' },
};

const capCua = (am: string) => {
  const c = CAP_THANH.find(([a, b]) => a === am || b === am);
  if (!c) return null;
  return c[0] === am ? c[1] : c[0];
};

export default function IpaClient() {
  const [nhom, setNhom] = useState<NhomAm | 'all'>('all');
  const [tim, setTim] = useState('');
  const [chon, setChon] = useState<AmIpa | null>(null);
  const [daHoc, setDaHoc] = useState<string[]>([]);
  const [man, setMan] = useState<'bang' | 'bando' | 'choi'>('bang');

  // Đọc sau khi khung hình đầu tiên đã vẽ: máy chủ không có localStorage nên
  // đặt state ngay trong lượt vẽ đầu sẽ lệch giữa máy chủ và trình duyệt.
  useEffect(() => {
    try {
      const t = JSON.parse(localStorage.getItem(KHOA_LUU) || '[]');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(t)) setDaHoc(t.filter((x) => typeof x === 'string'));
    } catch { /* máy chặn lưu trữ thì thôi, chỉ mất phần đánh dấu */ }
  }, []);

  const danhDau = useCallback((am: string) => {
    setDaHoc((cu) => {
      if (cu.includes(am)) return cu;
      const moi = [...cu, am];
      try { localStorage.setItem(KHOA_LUU, JSON.stringify(moi)); } catch { /* bỏ qua */ }
      return moi;
    });
  }, []);

  const loc = useMemo(() => {
    const q = tim.trim().toLowerCase();
    return IPA.filter((a) => {
      if (nhom !== 'all' && a.nhom !== nhom) return false;
      if (!q) return true;
      return a.am.includes(q)
        || a.cachDoc.toLowerCase().includes(q)
        || a.viDu.some((v) => v.en.toLowerCase().includes(q) || v.vi.toLowerCase().includes(q));
    });
  }, [nhom, tim]);

  function mo(a: AmIpa) {
    unlockAudio();
    setChon(a);
    danhDau(a.am);
    stopSpeaking();
    speakEnglish(a.viDu[0].en);
  }

  const moTheoKyHieu = (am: string) => {
    const a = IPA.find((x) => x.am === am);
    if (a) mo(a);
  };

  return (
    <div className="mt-6">
      {/* Tiến độ 44 âm — mốc rõ ràng để bé biết mình đang ở đâu. */}
      <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-4 py-3">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center">
          <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="4" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${(daHoc.length / IPA.length) * 97.4} 97.4`}
                    style={{ transition: 'stroke-dasharray 600ms ease' }} />
          </svg>
          <span className="text-[11px] font-black text-slate-700">{daHoc.length}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black text-slate-900">Bé đã xem {daHoc.length}/{IPA.length} âm</p>
          <p className="text-xs text-slate-500">
            {daHoc.length === IPA.length
              ? '🏆 Xong cả bảng IPA rồi! Thử vào phần Chơi để kiểm tra lại nhé.'
              : 'Mở một âm bất kỳ là được tính. Máy nhớ giúp bé ở trình duyệt này.'}
          </p>
        </div>
        {daHoc.length > 0 && (
          <button
            onClick={() => { setDaHoc([]); try { localStorage.removeItem(KHOA_LUU); } catch { /* bỏ qua */ } }}
            className="shrink-0 rounded-full border-2 border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-500"
          >
            Làm lại
          </button>
        )}
      </div>

      {/* Ba cách học cùng một bảng âm */}
      <div className="mt-4 flex gap-2 rounded-full bg-slate-100 p-1">
        {([['bang', '🔤 Bảng 44 âm'], ['bando', '🗺️ Bản đồ lưỡi'], ['choi', '🎮 Nghe đoán âm']] as const).map(([id, ten]) => (
          <button
            key={id}
            onClick={() => { stopSpeaking(); setMan(id); }}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-black transition sm:text-sm ${
              man === id ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
          >
            {ten}
          </button>
        ))}
      </div>

      {man === 'bando' && (
        <div className="mt-5 rounded-3xl border-2 border-amber-200 bg-amber-50/50 p-4">
          <BanDoNguyenAm onChon={moTheoKyHieu} />
        </div>
      )}

      {man === 'choi' && (
        <div className="mt-5 rounded-3xl border-2 border-sky-200 bg-sky-50/40 p-4 sm:p-5">
          <GameDoanAm onXong={(am, dung) => { if (dung) danhDau(am); }} />
        </div>
      )}

      {man === 'bang' && (
      <>
      {/* Bộ lọc */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setNhom('all')}
          className={`rounded-full border-2 px-4 py-2 text-sm font-black transition ${
            nhom === 'all' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
        >
          Tất cả 44 âm
        </button>
        {NHOM_IPA.map((n) => {
          const t = TONE[n.id];
          const on = nhom === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setNhom(n.id)}
              className="rounded-full border-2 px-4 py-2 text-sm font-black transition"
              style={on
                ? { borderColor: t.dam, background: t.dam, color: '#fff' }
                : { borderColor: t.vien, background: t.nen, color: t.chu }}
            >
              <span aria-hidden>{n.emoji}</span> {n.ten} ({amTheoNhom(n.id).length})
            </button>
          );
        })}
        <input
          value={tim}
          onChange={(e) => setTim(e.target.value)}
          placeholder="Tìm âm hoặc từ, ví dụ: sheep"
          className="ml-auto w-full rounded-full border-2 border-slate-200 px-4 py-2 text-sm outline-none focus:border-slate-400 sm:w-60"
        />
      </div>

      {/* Lưới 44 âm */}
      <div className="mt-5 grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-8">
        {loc.map((a) => {
          const t = TONE[a.nhom];
          return (
            <button
              key={a.am}
              onClick={() => mo(a)}
              className="group relative rounded-2xl border-2 p-2.5 text-center transition hover:-translate-y-0.5"
              style={{ borderColor: t.vien, background: t.nen, boxShadow: `0 3px 0 ${t.vien}` }}
              aria-label={`Âm ${a.am} — ${a.cachDoc}`}
            >
              <div className="text-xl font-black sm:text-2xl" style={{ color: t.chu }}>/{a.am}/</div>
              <div className="mt-0.5 truncate text-[11px] font-bold text-slate-500">{a.viDu[0].en}</div>
              {daHoc.includes(a.am) && (
                <span className="absolute right-1.5 top-1.5 text-[11px]" aria-label="đã xem">✅</span>
              )}
            </button>
          );
        })}
      </div>
      {loc.length === 0 && (
        <p className="mt-6 text-center text-slate-500">Không tìm thấy âm nào. Bé thử từ khác nhé!</p>
      )}
      </>
      )}

      {chon && <TheChiTiet am={chon} onDong={() => { stopSpeaking(); setChon(null); }} onChon={(am) => {
        const a = IPA.find((x) => x.am === am);
        if (a) mo(a);
      }} />}
    </div>
  );
}

function TheChiTiet({ am, onDong, onChon }: { am: AmIpa; onDong: () => void; onChon: (am: string) => void }) {
  const t = TONE[am.nhom];
  const cap = capCua(am.am);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4" onClick={onDong}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-[28px] border-4 bg-white sm:rounded-[28px]"
        style={{ borderColor: t.vien }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Đầu thẻ */}
        <div className="relative px-5 pb-4 pt-5 sm:px-7" style={{ background: t.nen }}>
          <button
            onClick={onDong}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white text-lg font-black text-slate-500 shadow"
            aria-label="Đóng"
          >
            ✕
          </button>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-black sm:text-5xl" style={{ color: t.chu }}>/{am.am}/</div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900">Đọc như: {am.cachDoc}</p>
              <p className="mt-0.5 text-xs font-bold" style={{ color: t.chu }}>
                {NHOM_IPA.find((n) => n.id === am.nhom)?.ten}
                {am.thanh && (am.thanh === 'huu' ? ' · hữu thanh (cổ rung)' : ' · vô thanh (cổ không rung)')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5 sm:px-7">
          {/* Hình cắt dọc miệng, lưỡi và môi chạy theo số đo của chính âm này */}
          <div className="rounded-2xl border-2 p-3" style={{ borderColor: t.vien, background: t.nen }}>
            <KhauHinh key={am.am} am={am} mau={t.dam} />
          </div>

          <Dong nhan="Khẩu hình" noiDung={am.khauHinh} emoji="👄" />
          <Dong nhan={am.nhom === 'phuam' ? 'Cách tạo âm' : 'Vị trí lưỡi'} noiDung={am.luoi} emoji="👅" />

          {/* Từ ví dụ — nghe thường và nghe chậm */}
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">Từ ví dụ</p>
            <div className="mt-2 space-y-2">
              {am.viDu.map((v) => (
                <div key={v.en} className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-slate-50 px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-slate-900">{v.en}</p>
                    <p className="text-xs text-slate-500">{v.ipa} · {v.vi}</p>
                  </div>
                  <button
                    onClick={() => { stopSpeaking(); speakEnglish(v.en); }}
                    className="grid h-10 w-10 place-items-center rounded-full text-lg text-white"
                    style={{ background: t.dam }}
                    aria-label={`Nghe từ ${v.en}`}
                  >
                    🔊
                  </button>
                  <button
                    onClick={() => { stopSpeaking(); speakEnglishSlow(v.en); }}
                    className="grid h-10 w-10 place-items-center rounded-full border-2 bg-white text-lg"
                    style={{ borderColor: t.vien }}
                    aria-label={`Nghe chậm từ ${v.en}`}
                  >
                    🐢
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
            <p className="text-xs font-black uppercase tracking-wide text-amber-700">Lưu ý</p>
            <p className="mt-1 text-sm leading-6 text-amber-900">{am.luuY}</p>
            <button
              onClick={() => { stopSpeaking(); speakText(am.luuY); }}
              className="mt-2 rounded-full bg-amber-500 px-3 py-1.5 text-xs font-black text-white"
            >
              🔈 Nghe lưu ý
            </button>
          </div>

          {cap && (
            <div className="rounded-2xl border-2 p-3" style={{ borderColor: t.vien, background: t.nen }}>
              <p className="text-sm font-bold text-slate-700">
                Cặp đôi của âm này là <b>/{cap}/</b> — cùng khẩu hình, chỉ khác chỗ cổ có rung hay không.
              </p>
              <button
                onClick={() => onChon(cap)}
                className="mt-2 rounded-full px-3 py-1.5 text-xs font-black text-white"
                style={{ background: t.dam }}
              >
                So sánh với /{cap}/
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Dong({ nhan, noiDung, emoji }: { nhan: string; noiDung: string; emoji: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-lg" aria-hidden>{emoji}</span>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">{nhan}</p>
        <p className="text-sm leading-6 text-slate-700">{noiDung}</p>
      </div>
    </div>
  );
}
