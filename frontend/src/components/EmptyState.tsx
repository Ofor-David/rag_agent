export function EmptyState() {
  return (
    <div className="text-center py-16 px-4">
      <div className="w-14 h-14 bg-cream-dark rounded-full mx-auto mb-5 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="w-6 h-6 opacity-40"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <h3 className="font-serif text-lg font-semibold mb-2 text-ink">Ask a question</h3>
      <p className="text-sm text-ink-muted leading-relaxed max-w-xs mx-auto">
        Type your question above or tap one of the quick suggestions to get
        started.
      </p>
    </div>
  );
}
