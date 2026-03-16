export interface SearchResult {
  question: string;
  answer:   string;
  category: string;
  score:    number;
}

export interface IVectorDB {
  query(vector: number[], topK: number): Promise<SearchResult[]>;
}

export interface PipelineResult {
  answer:           string;
  sources:          SearchResult[];
  response_time_ms: number;
}