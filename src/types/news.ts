// 新闻项接口
export interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  content: string;
  source: string;
  publishTime: string;
  category: string;
  imageUrl?: string;
}

// AI摘要接口
export interface AISummary {
  summary: string;
  timeline: string[];
  knowledgePoints: string[];
  impact?: string;
  tags?: string[];
}

// API响应接口
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}