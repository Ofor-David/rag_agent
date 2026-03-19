interface ErrorBannerProps {
  message: string | null;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div className="bg-red-light border border-red/20 rounded-card p-4 text-[13px] text-red mb-6 animate-[slideUp_0.2s_ease]">
      {message}
    </div>
  );
}
