import IqUpsell from '../components/upsell/IqUpsell';

export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
      {children}
      {/* Dưới trò chơi (bé chơi xong, bố mẹ cuộn xuống): web chưa giới hạn lượt chơi nên đặt ở đây. */}
      <IqUpsell
        spot="tro-choi"
        className="mx-auto my-8 max-w-3xl"
        title="Bé thích chơi? Thử thách tư duy Toán IQ"
        body="12 khóa thử thách dạng game cho lớp 1–3: quan sát quy luật, logic, đếm hình, tiền và đồng hồ."
      />
    </div>
  );
}
