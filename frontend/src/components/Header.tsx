export function Header() {
  return (
    <header className="bg-ink sticky top-0 z-20 px-4 md:px-8 flex items-center justify-between h-16">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gold-border flex items-center justify-center font-serif font-semibold text-sm text-ink">
          CS
        </div>
        <div>
          <div className="font-serif text-sm font-semibold text-white leading-tight">
            Department of Computer Science
          </div>
          <div className="text-[11px] text-white/45 font-light tracking-wider uppercase">
            Nnamdi Azikiwe University, Awka
          </div>
        </div>
      </div>
      <div className="hidden sm:block text-[11px] bg-white/10 border border-white/20 text-white/60 px-3 py-1 rounded-full tracking-wide">
        AI-Powered Q&A
      </div>
    </header>
  );
}
