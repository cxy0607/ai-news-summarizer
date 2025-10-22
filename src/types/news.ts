import { AISummary } from '@/types/ai';

// 新闻项接口定义
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishTime: string;
  category: string;
  summary: string;
  link?: string;
  imageUrl?: string;
  // 新增视频支持
  videoUrl?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  hasVideo?: boolean;
  mediaType?: 'image' | 'video' | 'text'; // 媒体类型
  // 新增AI解读相关字段
  aiSummary?: AISummary;
}

// NewsCard组件属性接口
export interface NewsCardProps {
  news: NewsItem;
  index: number;
  cardClass?: string;
  titleClass?: string;
  sourceClass?: string;
  timeClass?: string;
  summaryClass?: string;
  categoryIcon?: React.ReactNode;
  // 新增AI解读相关属性
  showAISummary?: boolean;
  onAISummaryClick?: (newsId: string) => void;
}