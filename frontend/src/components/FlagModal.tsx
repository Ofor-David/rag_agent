import { useState } from 'react';

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
}

export function FlagModal({ isOpen, onClose, onSubmit }: FlagModalProps) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for flagging.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await onSubmit(reason.trim());
      setReason('');
      onClose();
    } catch {
      setError('Failed to submit flag. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-card-lg p-6 w-full max-w-md shadow-card-lg animate-[slideUp_0.2s_ease]">
        <h3 className="font-serif text-lg font-semibold mb-1">Flag this answer</h3>
        <p className="text-[13px] text-ink-muted mb-5 leading-relaxed">
          Let the HOD know if this answer seems incorrect, incomplete, or
          outdated. It will be reviewed and updated.
        </p>

        <label className="block text-[12px] font-medium tracking-widest uppercase text-ink-muted mb-2">
          Reason
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. The deadline mentioned here seems outdated..."
          className={`w-full font-sans text-sm border-2 rounded-card px-3 py-2 resize-none h-24 bg-cream text-ink outline-none transition-colors duration-200 mb-4 ${
            error ? 'border-red' : 'border-ink/10 focus:border-gold-border focus:bg-white'
          }`}
          disabled={submitting}
        />
        {error && <p className="text-red text-sm mb-4">{error}</p>}

        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            disabled={submitting}
            className="font-sans text-[13px] bg-none border border-ink/10 rounded-card px-4 py-2 cursor-pointer text-ink-soft transition-colors duration-150 hover:bg-cream disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="font-sans text-[13px] font-medium bg-ink text-white border-none rounded-card px-5 py-2 cursor-pointer transition-colors duration-150 hover:bg-ink-soft disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit flag'}
          </button>
        </div>
      </div>
    </div>
  );
}
