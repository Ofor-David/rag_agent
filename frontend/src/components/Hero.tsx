export function Hero() {
  return (
    <div className="bg-ink py-12 md:py-16 px-4 text-center relative overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px)',
        }}
      />
      <div className="relative z-10 max-w-xl mx-auto">
        <div className="text-[11px] tracking-widest uppercase text-gold-border font-medium mb-4">
          CSC 309 — Artificial Intelligence · Group 8
        </div>
        <h1 className="font-serif text-2xl md:text-4xl font-semibold text-white leading-tight mb-4">
          Ask the <em className="not-italic text-gold-border">Department</em>
          <br />anything, instantly.
        </h1>
        <p className="text-[15px] text-white/50 font-light leading-relaxed max-w-md mx-auto">
          Get verified answers on graduation, clearance, projects, and
          registration — without waiting 90 minutes for the HOD.
        </p>
      </div>
    </div>
  );
}
