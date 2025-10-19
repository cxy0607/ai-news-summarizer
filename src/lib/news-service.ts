// src/lib/news-service.ts
import { NewsItem } from '@/types/news';
import { mockNews } from '@/data/news';

// 获取新闻详情
export async function getNewsById(id: string): Promise<NewsItem | null> {
  // 实际应用中应该从API获取
  return mockNews.find(item => item.id === id) || null;
}

// 可以添加其他新闻相关的服务方法