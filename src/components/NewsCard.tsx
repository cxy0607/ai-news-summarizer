import { NewsItem } from '@/types/news';
import { ArrowRight } from 'lucide-react';
import React from 'react';

// 完整的 NewsCard Props 类型定义（包含所有样式属性）
interface NewsCardProps {
  news: NewsItem;
  index: number;
  cardClass?: string;         // 卡片外层容器样式
  titleClass?: string;        // 标题样式
  sourceClass?: string;       // 来源文字样式
  timeClass?: string;         // 时间文字样式
  summaryClass?: string;      // 摘要文字样式
  categoryIcon?: React.ReactNode; // 分类图标
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
      {news.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
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
        <h3 className={titleClass}>{news.title}</h3>
        
        {/* 新闻摘要 */}
        <p className={`mt-3 ${summaryClass}`}>{news.summary}</p>
        
        {/* 查看详情链接 */}
        {news.link && (
          <a
            href={news.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
          >
            查看详情
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export default NewsCard;