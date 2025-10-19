import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

// 新闻项类型定义
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  publishTime: string;
  category: string;
  summary?: string;
  link?: string;
  imageUrl?: string;
}

// 新闻卡片属性
interface NewsCardProps {
  news: NewsItem;
  index: number;
  cardClass?: string;
  titleClass?: string;
  sourceClass?: string;
  timeClass?: string;
  summaryClass?: string;
  categoryIcon?: React.ReactNode;
}

// 新闻卡片组件
const NewsCard: React.FC<NewsCardProps> = ({
  news,
  index,
  cardClass = '',
  titleClass = '',
  sourceClass = '',
  timeClass = '',
  summaryClass = '',
  categoryIcon
}) => {
  return (
    <div className={cardClass}>
      {/* 新闻图片（如有） */}
      {news.imageUrl ? (
        <div className="h-40 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="h-40 bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-sm">{news.category}</span>
        </div>
      )}
      
      <div className="p-5">
        {/* 分类图标 + 来源 + 时间 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {categoryIcon}
            <span className={sourceClass}>{news.source}</span>
          </div>
          <span className={timeClass}>{news.publishTime}</span>
        </div>
        
        {/* 新闻标题 */}
        <Link href={`/news/${news.id}`} className="block">
          <h3 className={titleClass}>{news.title}</h3>
        </Link>
        
        {/* 新闻摘要 */}
        {news.summary && (
          <p className={`mt-3 ${summaryClass}`}>{news.summary}</p>
        )}
        
        {/* 查看详情链接 */}
        <Link 
          href={`/news/${news.id}`}
          className="inline-flex items-center gap-1 mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
        >
          查看详情
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;