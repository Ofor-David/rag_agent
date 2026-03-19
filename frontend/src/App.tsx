import { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SearchCard } from './components/SearchCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AnswerCard } from './components/AnswerCard';
import { SourcesList } from './components/SourcesList';
import { FlagModal } from './components/FlagModal';
import { Toast } from './components/Toast';
import { EmptyState } from './components/EmptyState';
import { ErrorBanner } from './components/ErrorBanner';
import { useApi } from './hooks/useApi';
import type { AskResponse } from './types';

function App() {
  const { askQuestion, flagAnswer, loading } = useApi();
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlagged, setIsFlagged] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSearch = useCallback(async (question: string) => {
    setError(null);
    setIsFlagged(false);
    setCurrentQuestion(question);

    const result = await askQuestion(question);

    if (result) {
      setAnswer(result);
    } else {
      setError('Could not reach the server. Make sure the backend is running.');
    }
  }, [askQuestion]);

  const handleFlag = useCallback(async (reason: string) => {
    if (!answer || !currentQuestion) return;

    const success = await flagAnswer({
      question: currentQuestion,
      answer: answer.answer,
      reason,
    });

    if (success) {
      setIsFlagged(true);
      setToastMessage('Flagged successfully. The HOD will review it.');
    }
  }, [answer, currentQuestion, flagAnswer]);

  const hasResult = answer !== null;

  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink font-sans">
      <Header />
      <Hero />
      <SearchCard onSearch={handleSearch} loading={loading} />

      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        {loading && <LoadingSpinner />}

        {error && <ErrorBanner message={error} />}

        {hasResult && (
          <>
            <AnswerCard
              question={currentQuestion}
              answer={answer.answer}
              responseTime={answer.response_time_ms / 1000}
              onFlag={() => setIsModalOpen(true)}
              isFlagged={isFlagged}
            />

            <SourcesList sources={answer.sources} />
          </>
        )}

        {!hasResult && !loading && !error && <EmptyState />}
      </main>

      <FlagModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFlag}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}

      <footer className="bg-ink text-white/30 text-center py-5 text-[12px] tracking-wide">
        &copy; 2026 Department of Computer Science, UNIZIK &nbsp;·&nbsp; CSC 309
        Group 8 &nbsp;·&nbsp; AI-Powered HOD Q&amp;A System
      </footer>
    </div>
  );
}

export default App;
