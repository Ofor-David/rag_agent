export interface Source {
  question: string;
  answer: string;
  category: string;
  score: number;
}

export interface AskResponse {
  status: string;
  answer: string;
  sources: Source[];
  response_time_ms: number;
}

export interface FlagRequest {
  question: string;
  answer: string;
  reason: string;
}

export interface ApiError {
  message: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
