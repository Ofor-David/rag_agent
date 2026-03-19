interface AnswerCardProps {
  question: string;
  answer: string;
  responseTime: number;
  onFlag: () => void;
  isFlagged: boolean;
}

export function AnswerCard({ question, answer, responseTime, onFlag, isFlagged }: AnswerCardProps) {
  const currentTime = new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-card-lg border border-ink/10 shadow-card mb-6 overflow-hidden animate-[slideUp_0.3s_ease]">
      <div className="px-5 py-4 border-b border-cream-dark flex items-center justify-between">
        <span className="text-[11px] font-medium tracking-widest uppercase text-green bg-green-light px-3 py-1 rounded-full">
          Answer
        </span>
        <span className="text-[11px] text-ink-muted">{currentTime}</span>
      </div>
      <div className="p-5">
        <div className="font-serif text-base font-semibold text-ink mb-4 leading-relaxed">
          <span className="text-gold-border">Q: </span>
          {question}
        </div>
        <div className="text-[15px] leading-relaxed text-ink-soft">{answer}</div>
      </div>
      <div className="px-5 py-3 bg-cream border-t border-cream-dark flex items-center justify-between flex-wrap gap-2">
        <button
          onClick={onFlag}
          className={`font-sans text-xs bg-none border rounded-full px-3 py-1 cursor-pointer flex items-center gap-1.5 transition-all duration-150 ${
            isFlagged
              ? 'border-red text-red bg-red-light'
              : 'border-ink/10 text-ink-muted hover:border-red hover:text-red hover:bg-red-light'
          }`}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3h10l-2 4 2 4H3V3z" />
            <line x1="3" y1="15" x2="3" y2="3" />
          </svg>
          {isFlagged ? 'Flagged for review' : 'Flag this answer'}
        </button>
        <span className="text-[12px] text-ink-muted">
          {responseTime.toFixed(2)}s response time
        </span>
      </div>
    </div>
  );
}
