'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { VONG_AM } from '../lib/vongTronAm';
import { buocDanhVanChiTiet, chuoiDanhVan } from '../lib/danhVan';
import { speakText, speakSequence, stopSpeaking, unlockAudio } from '../components/edu/utils/speech';
import Wheel from './Wheel';
import BangChuCai from './BangChuCai';

// Trang "Vòng tròn âm vần".
//
// Ý tưởng: mỗi âm đầu là một bánh xe 10 từ. Bé bấm vào múi nào thì bánh xe quay
// múi đó lên đỉnh và mở thẻ từ — nghe đọc cả từ, hoặc nghe đánh vần từng bước
// với bước đang đọc được tô sáng.
//
// Các bước đánh vần KHÔNG lưu trong dữ liệu mà sinh tự động từ `danhVan.ts`,
// nên 260 từ luôn nhất quán một kiểu.

const KEY_TIEN_DO = 'bhh_vong_am_v1';

export default function VongTronAmClient() {
  const [amHienTai, setAmHienTai] = useState('b');
  const [chon, setChon] = useState<number | null>(null);
  const [moThe, setMoThe] = useState(false);
  const [dangDoc, setDangDoc] = useState<number | null>(null);
  const [daHoc, setDaHoc] = useState<Set<string>>(new Set());

  const vong = useMemo(() => VONG_AM.find((v) => v.am === amHienTai) ?? VONG_AM[0], [amHienTai]);
  const tu = chon != null ? vong.tu[chon] : null;
  // Mỗi bước có chữ để NHÌN và chữ để ĐỌC — khác nhau ở tiếng đóng (nhìn "ut",
  // đọc "út"), xem `danhVan.ts`.
  const buoc = useMemo(() => (tu ? buocDanhVanChiTiet(tu.tu.split(' ')[0]) : []), [tu]);

  // Tiến độ nằm ở localStorage nên chỉ đọc được trên trình duyệt, không đọc
  // được lúc dựng trang ở máy chủ. Vì vậy phải đặt trong effect và chấp nhận
  // một lần dựng lại — nếu khởi tạo state trực tiếp thì lần dựng đầu ở máy chủ
  // và ở trình duyệt sẽ lệch nhau.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY_TIEN_DO);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setDaHoc(new Set(JSON.parse(raw) as string[]));
    } catch { /* trình duyệt chặn lưu thì bỏ qua, chỉ mất phần đánh dấu */ }
  }, []);

  const luuDaHoc = useCallback((next: Set<string>) => {
    setDaHoc(next);
    try { localStorage.setItem(KEY_TIEN_DO, JSON.stringify([...next])); } catch { /* bỏ qua */ }
  }, []);

  useEffect(() => () => stopSpeaking(), []);

  // Trình duyệt chặn phát tiếng cho tới khi người dùng chạm. Mở khoá MỘT LẦN ở
  // cú chạm đầu tiên — gọi `unlockAudio()` ngay trước mỗi lần đọc thì callback
  // bất đồng bộ của nó (pause rồi bỏ tắt tiếng) chạy SAU và cắt mất tiếng vừa phát.
  useEffect(() => {
    const moKhoa = () => unlockAudio();
    window.addEventListener('pointerdown', moKhoa, { once: true });
    window.addEventListener('keydown', moKhoa, { once: true });
    return () => {
      window.removeEventListener('pointerdown', moKhoa);
      window.removeEventListener('keydown', moKhoa);
    };
  }, []);

  // Hẹn giờ của lượt đọc đang chờ. Bấm nhanh nhiều âm mà không huỷ lượt cũ thì
  // các lượt xếp hàng chồng lên nhau và bé nghe ra âm của lần bấm TRƯỚC.
  const hen = useRef<number | null>(null);

  /** Neo tới vòng tròn, để bấm chữ ở bảng dưới thì cuộn lên xem vòng vừa đổi. */
  const vungVong = useRef<HTMLDivElement | null>(null);

  /** Đọc một đoạn, hoãn một nhịp để phần mở khoá âm thanh kịp xong. */
  const doc = useCallback((text: string) => {
    if (hen.current != null) window.clearTimeout(hen.current);
    stopSpeaking();
    hen.current = window.setTimeout(() => { hen.current = null; speakText(text); }, 120);
  }, []);

  // Rời trang thì huỷ lượt đọc còn treo.
  useEffect(() => () => { if (hen.current != null) window.clearTimeout(hen.current); }, []);

  function chonTu(i: number) {
    setChon(i);
    setMoThe(true);
    setDangDoc(null);
    // Đọc luôn từ vừa chọn — bé chưa biết đọc vẫn theo được.
    doc(vong.tu[i].tu);
  }

  function docAm() {
    // CHỈ đọc chính tiếng của âm, KHÔNG thêm chữ dẫn nào phía trước.
    //
    // Trước đây đọc "Âm cờ." và bé nghe ra "mờ" ở cả b, c, d — ba chữ khác nhau
    // mà cùng một kết quả thì lỗi nằm ở phần CHUNG của câu: chữ "Âm" kết thúc
    // bằng "m", đầu câu bị nuốt là chỉ còn nghe "m…" nên tiếng nào cũng hoá "mờ".
    //
    // Cũng KHÔNG gửi chữ cái trần ("Chữ ch") vì đó không phải tiếng Việt hoàn
    // chỉnh, máy đọc mỗi nơi một kiểu. Chữ đang học thì bé NHÌN ở giữa vòng tròn.
    // Đọc hai lần cho bé nghe rõ.
    doc(`${vong.doc}, ${vong.doc}`);
  }

  function docCaTu() {
    if (!tu) return;
    setDangDoc(null);
    doc(tu.tu);
  }

  /**
   * Đánh vần từng bước, tô sáng bước đang đọc.
   * `speakSequence` gọi lại onIndex trước mỗi mẩu nên chữ sáng lên đúng lúc phát
   * ra tiếng, bé nhìn theo được thay vì chỉ nghe.
   */
  function danhVan() {
    if (!tu) return;
    stopSpeaking();
    speakSequence(
      buoc.map((b) => ({ text: b.doc, lang: 'vi' as const })),
      (i) => setDangDoc(i),
      () => {
        setDangDoc(null);
        const next = new Set(daHoc);
        next.add(tu.tu);
        luuDaHoc(next);
      },
    );
  }

  const soDaHoc = vong.tu.filter((w) => daHoc.has(w.tu)).length;

  return (
    <div className="mx-auto w-full max-w-3xl overflow-x-hidden px-3 pb-2 pt-4 sm:px-4 sm:pt-5">
      {/* Thẻ "Bé học chữ …" — cho bé biết ngay đang học âm nào */}
      <div className="mb-4 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
        <button
          onClick={docAm}
          className="inline-flex max-w-full items-center gap-2.5 rounded-full bg-white py-2 pl-4 pr-3 shadow-lg ring-1 ring-black/5"
        >
          <span className="shrink-0 text-sm font-black text-slate-600">Bé học chữ</span>
          <span className="chu-mau shrink-0 rounded-2xl px-3.5 py-1 text-2xl font-black text-white"
            style={{ background: vong.mau, boxShadow: `0 4px 0 ${vong.mau}99` }}>
            {vong.am}
          </span>
          <span className="text-xl" aria-hidden>🔊</span>
        </button>
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-amber-200 bg-amber-50 px-4 py-2 text-xs font-black text-amber-700">
          ✨ Chạm vào ô để nghe đọc
        </span>
      </div>

      {/* Chọn âm */}
      {/* Lưới cuộn-không: 25 âm phải thấy HẾT trong một màn. Hàng cuộn ngang cũ
          giấu mất non nửa số âm — bé nhỏ không biết là còn kéo được nữa. */}
      <div className="mb-4 grid grid-cols-7 gap-1.5 sm:grid-cols-13">
        {VONG_AM.map((v) => {
          const xong = v.tu.filter((w) => daHoc.has(w.tu)).length;
          const dang = v.am === amHienTai;
          return (
            <button
              key={v.am}
              onClick={() => {
                if (hen.current != null) window.clearTimeout(hen.current);
                stopSpeaking();
                setAmHienTai(v.am);
                setChon(null);
                setMoThe(false);
              }}
              className={`chu-mau relative rounded-2xl px-1 py-2 text-sm font-black leading-none transition sm:text-base ${dang ? 'text-white' : 'text-slate-600'}`}
              style={{
                background: dang ? v.mau : '#f1f5f9',
                boxShadow: dang ? `0 4px 0 ${v.mau}99` : undefined,
              }}
            >
              {v.am}
              {xong === v.tu.length && <span className="absolute -right-0.5 -top-0.5 text-xs">⭐</span>}
            </button>
          );
        })}
      </div>

      {/* Tiến độ của âm đang học */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-sm font-black text-slate-700">
          Âm <span style={{ color: vong.mau }}>{vong.doc}</span>
        </span>
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${(soDaHoc / vong.tu.length) * 100}%`, background: vong.mau }} />
        </div>
        <span className="text-sm font-black text-slate-500">{soDaHoc}/{vong.tu.length}</span>
      </div>

      <div ref={vungVong} className="scroll-mt-20">
        <Wheel vong={vong} chon={chon} daHoc={daHoc} onChonTu={chonTu} onDocAm={docAm} />
      </div>

      {/* Bảng 29 chữ cái — phần nền tảng, để dưới vòng tròn vì bé vào trang là
          muốn chơi vòng quay trước, tra bảng chữ sau. */}
      <BangChuCai
        onDoc={doc}
        amHienTai={amHienTai}
        onMoVong={(am) => {
          setAmHienTai(am);
          setChon(null);
          setMoThe(false);
          // Vòng tròn nằm TRÊN bảng chữ cái nên đổi vòng mà không cuộn lên thì bé
          // không thấy gì thay đổi, tưởng bấm hỏng.
          vungVong.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />

      {/* Thẻ từ */}
      {moThe && tu && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
          onClick={() => { setMoThe(false); stopSpeaking(); setDangDoc(null); }}>
          <div className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[28px] bg-white p-4 shadow-2xl sm:p-5"
            onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-full px-3 py-1 text-xs font-black text-white" style={{ background: vong.mau }}>
                Âm {vong.doc}
              </span>
              {daHoc.has(tu.tu) && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-600">
                  ✓ Đã đánh vần
                </span>
              )}
              <button onClick={() => { setMoThe(false); stopSpeaking(); }}
                aria-label="Đóng" className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-slate-500">✕</button>
            </div>

            <div className="grid place-items-center rounded-3xl py-6" style={{ background: `${vong.mau}14` }}>
              <span className="text-7xl" aria-hidden>{tu.emoji}</span>
            </div>

            <p className="chu-mau mt-4 text-center text-4xl font-black" style={{ color: vong.mau }}>{tu.tu}</p>
            <p className="mt-1 text-center text-sm font-bold text-slate-500">“{tu.cau}”</p>

            {/* Các bước đánh vần — bước đang đọc sáng lên */}
            <div className="mt-4 rounded-2xl border-2 border-amber-200 bg-amber-50 p-3">
              <p className="mb-2 text-xs font-black uppercase tracking-wide text-amber-700">
                📖 Đánh vần
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {buoc.map((b, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-amber-400">–</span>}
                    <span
                      className={`chu-mau rounded-lg px-2.5 py-1 text-lg font-black transition ${
                        dangDoc === i ? 'text-white' : 'text-rose-600'
                      }`}
                      style={dangDoc === i ? { background: vong.mau } : { background: '#fff' }}
                    >
                      {b.hien}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={docCaTu}
                className="rounded-2xl border-2 border-slate-200 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
                🔊 Đọc cả từ
              </button>
              <button onClick={danhVan}
                className="rounded-2xl py-3 text-sm font-black text-white"
                style={{ background: vong.mau, boxShadow: `0 4px 0 ${vong.mau}99` }}>
                🎵 Đánh vần từng âm
              </button>
            </div>

            <p className="chu-mau mt-3 text-center text-xs font-bold text-slate-400">
              {chuoiDanhVan(tu.tu.split(' ')[0])}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
