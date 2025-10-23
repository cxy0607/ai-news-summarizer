// src/types/ai.ts
export interface AISummary {
  summary: string;
  timeline: string[];
  knowledgePoints: string[];
  impact: string;
  tags: string[];
  error?: string;
}