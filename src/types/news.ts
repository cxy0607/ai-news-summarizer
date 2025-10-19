export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishTime: string;
  category: string;
  summary: string;
  link?: string; // 添加 link 属性（可选，使用 ? 标记）
  imageUrl?: string; // 保留原有的图片URL属性（如果有）
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}