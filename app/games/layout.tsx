export default function GamesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
      {children}
    </div>
  );
}
