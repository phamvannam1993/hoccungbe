'use client';

// Bảng 29 chữ cái tiếng Việt, đặt ngay dưới vòng tròn âm vần.
//
// Vì sao cần cả hai: vòng tròn dạy ÂM ĐẦU (27 âm, gồm cả chữ ghép ch/ng/ngh…),
// còn bảng này dạy CHỮ CÁI (29 con chữ, gồm cả nguyên âm a ă â e ê i o ô ơ u ư y).
// Hai con số khác nhau vì đếm hai thứ khác nhau — đây là chỗ ba mẹ hay nhầm.
//
// Mỗi chữ có HAI cách gọi và bé cần cả hai:
//  • TÊN chữ ("bê", "ca", "e-lờ") — dùng khi đọc bảng chữ cái, đánh vần tên riêng.
//  • ÂM của chữ ("bờ", "cờ", "lờ") — dùng khi ghép tiếng, đây là cái bé dùng nhiều nhất.
// Bấm chữ thì đọc âm trước rồi tên, đúng thứ tự bé cần.

export type ChuCai = { chu: string; ten: string; am: string; /** có vòng tròn âm tương ứng không */ vong?: string };

export const BANG_CHU_CAI: ChuCai[] = [
  { chu: 'a', ten: 'a', am: 'a', vong: 'a' },
  { chu: 'ă', ten: 'á', am: 'á', vong: 'ă' },
  { chu: 'â', ten: 'ớ', am: 'ớ', vong: 'â' },
  { chu: 'b', ten: 'bê', am: 'bờ', vong: 'b' },
  { chu: 'c', ten: 'xê', am: 'cờ', vong: 'c' },
  { chu: 'd', ten: 'dê', am: 'dờ', vong: 'd' },
  { chu: 'đ', ten: 'đê', am: 'đờ', vong: 'đ' },
  { chu: 'e', ten: 'e', am: 'e', vong: 'e' },
  { chu: 'ê', ten: 'ê', am: 'ê', vong: 'ê' },
  { chu: 'g', ten: 'giê', am: 'gờ', vong: 'g' },
  { chu: 'h', ten: 'hát', am: 'hờ', vong: 'h' },
  { chu: 'i', ten: 'i ngắn', am: 'i', vong: 'i' },
  { chu: 'k', ten: 'ca', am: 'cờ', vong: 'k' },
  { chu: 'l', ten: 'e-lờ', am: 'lờ', vong: 'l' },
  { chu: 'm', ten: 'em-mờ', am: 'mờ', vong: 'm' },
  { chu: 'n', ten: 'en-nờ', am: 'nờ', vong: 'n' },
  { chu: 'o', ten: 'o', am: 'o', vong: 'o' },
  { chu: 'ô', ten: 'ô', am: 'ô', vong: 'ô' },
  { chu: 'ơ', ten: 'ơ', am: 'ơ', vong: 'ơ' },
  { chu: 'p', ten: 'pê', am: 'pờ', vong: 'p' },
  // "q" không bao giờ đứng một mình trong tiếng Việt, luôn đi với u thành "qu".
  { chu: 'q', ten: 'quy', am: 'quờ', vong: 'qu' },
  { chu: 'r', ten: 'e-rờ', am: 'rờ', vong: 'r' },
  { chu: 's', ten: 'ét-sì', am: 'sờ', vong: 's' },
  { chu: 't', ten: 'tê', am: 'tờ', vong: 't' },
  { chu: 'u', ten: 'u', am: 'u', vong: 'u' },
  { chu: 'ư', ten: 'ư', am: 'ư', vong: 'ư' },
  { chu: 'v', ten: 'vê', am: 'vờ', vong: 'v' },
  { chu: 'x', ten: 'ích-xì', am: 'xờ', vong: 'x' },
  { chu: 'y', ten: 'i dài', am: 'i dài', vong: 'y' },
];

// Nguyên âm tô màu khác phụ âm: bé nhìn là thấy ngay "chữ nào ghép được thành vần".
const NGUYEN_AM = new Set(['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u', 'ư', 'y']);

type Props = {
  /** Đọc một đoạn — dùng chung bộ đọc với vòng tròn để không phát chồng tiếng. */
  onDoc: (text: string) => void;
  /** Nhảy tới vòng tròn của âm tương ứng, nếu chữ đó có vòng. */
  onMoVong: (am: string) => void;
  amHienTai: string;
};

export default function BangChuCai({ onDoc, onMoVong, amHienTai }: Props) {
  return (
    <section className="mt-8 rounded-[28px] bg-white/70 p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
      <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="chu-mau text-xl font-black text-slate-800">🔤 Bảng chữ cái tiếng Việt</h2>
        <span className="text-xs font-black text-slate-400">29 chữ cái</span>
      </div>
      <p className="mb-4 text-sm font-bold text-slate-500">
        Bấm vào một chữ để nghe <b className="text-slate-700">âm</b> rồi nghe <b className="text-slate-700">tên chữ</b>.
        Chữ viền xanh có sẵn vòng tròn từ — bấm là vòng ở trên đổi sang chữ đó luôn.
      </p>

      <ul className="grid grid-cols-5 gap-2 sm:grid-cols-8 lg:grid-cols-10">
        {BANG_CHU_CAI.map((c) => {
          const la_nguyen_am = NGUYEN_AM.has(c.chu);
          const dang = c.vong != null && c.vong === amHienTai;
          return (
            <li key={c.chu}>
              <button
                type="button"
                onClick={() => {
                  // Một lần bấm làm cả hai việc: đọc chữ VÀ đưa vòng tròn ở trên về
                  // đúng âm đó. Bắt bé bấm hai lần mới đổi vòng thì gần như không
                  // ai tìm ra — trẻ lớp 1 không có thói quen bấm đúp.
                  onDoc(c.am === c.ten ? `${c.am}, ${c.am}` : `${c.am}. ${c.ten}`);
                  if (c.vong) onMoVong(c.vong);
                }}
                className={`w-full rounded-2xl border-2 px-1 py-2 text-center transition active:scale-95 ${
                  dang
                    ? 'border-slate-800 bg-slate-800 text-white'
                    : la_nguyen_am
                      ? 'border-rose-200 bg-rose-50 text-rose-600 hover:border-rose-400'
                      : c.vong
                        ? 'border-sky-300 bg-sky-50 text-sky-700 hover:border-sky-500'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                }`}
                aria-label={`Chữ ${c.chu}, đọc là ${c.am}, tên chữ là ${c.ten}`}
              >
                <span className="chu-mau block text-2xl font-black leading-none">
                  {c.chu.toUpperCase()} {c.chu}
                </span>
                <span className="mt-1 block text-[11px] font-black leading-none opacity-70">{c.ten}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-xs font-bold leading-5 text-amber-800">
        <b>Ba mẹ lưu ý:</b> bảng chữ cái có <b>29 chữ</b>, còn vòng tròn ở trên có <b>27 âm đầu</b> —
        hai con số khác nhau vì đếm hai thứ khác nhau. Bảng chữ cái đếm cả nguyên âm (a, ă, â, e, ê…),
        còn âm đầu thì tính thêm các chữ ghép (ch, gh, gi, kh, ng, ngh, nh, ph, qu, th, tr) và
        không tính riêng chữ <b>q</b> vì trong tiếng Việt <b>q</b> luôn đi liền với <b>u</b>.
      </p>
    </section>
  );
}
