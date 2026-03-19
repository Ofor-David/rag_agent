import type { Source } from '../types';

interface SourcesListProps {
  sources: Source[];
}

export function SourcesList({ sources }: SourcesListProps) {
  if (!sources.length) return null;

  return (
    <div className="mb-6 animate-[slideUp_0.3s_ease_0.1s_both]">
      <div className="text-[11px] font-medium tracking-widest uppercase text-ink-muted mb-3 px-1">
        Retrieved sources
      </div>
      <div className="flex flex-col gap-2">
        {sources.map((source, index) => (
          <div
            key={index}
            className="bg-white border border-ink/10 rounded-card p-4 flex items-start justify-between gap-4"
          >
            <div className="text-[13px] text-ink-soft leading-relaxed flex-1">
              {source.question}
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <span className="text-[11px] bg-gold-light text-gold px-2 py-0.5 rounded-full font-medium border border-gold/20">
                {source.category}
              </span>
              <span className="text-[11px] text-ink-muted font-variant-numeric">
                {(source.score * 100).toFixed(0)}% match
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
