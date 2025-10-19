// 新闻卡片组件
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { NewsItem } from '@/types/news'; // 假设存在这个类型定义

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

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  index,
  cardClass = 'group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow',
  titleClass = 'text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors',
  sourceClass = 'text-sm text-gray-500 dark:text-gray-400',
  timeClass = 'text-xs text-gray-400 dark:text-gray-500',
  summaryClass = 'text-gray-600 dark:text-gray-300 line-clamp-3',
  categoryIcon
}) => {
  return (
    // 使用 Next.js 的 Link 作为外层链接，避免 a 标签嵌套
    <Link href={`/news/${news.id}`} className={cardClass}>
      {/* 新闻图片（如有） */}
      {news.imageUrl && (
        <div className="h-40 overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
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
        
        {/* AI 解读入口 - 不使用额外的 Link，通过外层 Link 跳转后在详情页处理锚点 */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors">
            查看 AI 解读
            <ArrowRight className="w-3 h-3 ml-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;