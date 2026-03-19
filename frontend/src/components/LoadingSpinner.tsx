export function LoadingSpinner() {
  return (
    <div className="flex items-center gap-3 p-6 bg-white rounded-card-lg border border-ink/10 mb-6">
      <div className="flex gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-gold-border animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-gold-border animate-bounce" style={{ animationDelay: '200ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-gold-border animate-bounce" style={{ animationDelay: '400ms' }} />
      </div>
      <span className="text-sm text-ink-muted italic">Searching the knowledge base...</span>
    </div>
  );
}
