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
}