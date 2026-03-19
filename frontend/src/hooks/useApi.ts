import { useState, useCallback } from 'react';
import type { AskResponse, FlagRequest } from '../types';

const API_BASE = 'https://nau-questions-answered.onrender.com/api/v1';

interface UseApiReturn {
  askQuestion: (question: string) => Promise<AskResponse | null>;
  flagAnswer: (data: FlagRequest) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useApi(): UseApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askQuestion = useCallback(async (question: string): Promise<AskResponse | null> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      return data as AskResponse;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not reach the server.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const flagAnswer = useCallback(async (data: FlagRequest): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/flag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Flag submission failed.');
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not submit flag.';
      setError(message);
      return false;
    }
  }, []);

  return { askQuestion, flagAnswer, loading, error };
}
