// src/types/news.ts
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  summary: string;
  source: string;
  publishTime: string;
  category: string;
  imageUrl?: string;
  link?: string;
}

// src/types/ai.ts
export interface AISummary {
  summary: string;
  timeline: string[];
  knowledgePoints: string[];
  impact: string;
  tags: string[];
}