import { KeyboardEvent, useState } from 'react';

interface SearchCardProps {
  onSearch: (question: string) => void;
  loading: boolean;
}

const HINT_CHIPS = [
  'Clearance requirements',
  'Project submission deadline',
  'Minimum CGPA to graduate',
  'Carry-over course policy',
];

export function SearchCard({ onSearch, loading }: SearchCardProps) {
  const [question, setQuestion] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim()) onSearch(question.trim());
    }
  };

  const fillQuestion = (chip: string) => {
    setQuestion(chip);
  };

  return (
    <div className="max-w-3xl mx-auto -mt-7 px-4 relative z-10">
      <div className="bg-white rounded-card-lg shadow-card-lg border border-ink/10 p-6">
        <label className="block text-[12px] font-medium tracking-widest uppercase text-ink-muted mb-2">
          Your question
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="e.g. What are the requirements to clear final year?"
            rows={isFocused ? 4 : 2}
            className="flex-1 font-sans text-[15px] text-ink bg-cream border-2 border-ink/10 rounded-card px-4 py-3 resize-none outline-none transition-all duration-200 focus:border-gold-border focus:bg-white"
            disabled={loading}
          />
          <button
            onClick={() => question.trim() && onSearch(question.trim())}
            disabled={loading || !question.trim()}
            className="font-sans text-sm font-medium bg-ink text-white border-none rounded-card px-5 py-0 h-[52px] cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 transition-all duration-200 hover:bg-ink-soft active:scale-95 disabled:bg-ink-muted disabled:cursor-not-allowed disabled:scale-100 sm:w-auto w-full"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-4 h-4"
            >
              <line x1="2" y1="8" x2="14" y2="8" />
              <polyline points="9,3 14,8 9,13" />
            </svg>
            {loading ? 'Asking...' : 'Ask'}
          </button>
        </div>
        <div className="flex flex-wrap gap-4 mt-4 text-[12px] text-ink-muted">
          <span>Try:</span>
          {HINT_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => fillQuestion(chip)}
              className="cursor-pointer px-3 py-1 bg-cream border border-ink/10 rounded-full transition-all duration-150 text-ink-soft hover:border-gold-border hover:bg-gold-light hover:text-gold"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
