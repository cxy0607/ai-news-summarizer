import { NewsItem } from '@/types/news';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Clock, Sparkles } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export default function NewsCard({ news, index }: NewsCardProps) {
  // 定义不同的卡片颜色样式
  const cardStyles = [
    'from-blue-50 to-indigo-50 border-blue-100',
    'from-purple-50 to-pink-50 border-purple-100',
    'from-green-50 to-teal-50 border-green-100',
  ];
  
  // 循环使用样式
  const getCardStyle = () => cardStyles[index % cardStyles.length];

  return (
    <Link 
      href={`/news/${news.id}`}
      className="group"
      aria-label={`查看新闻: ${news.title}`}
    >
      <div className={`glass-card h-full overflow-hidden transition-all duration-300 hover:shadow-lg ${getCardStyle()}`}>
        {/* 新闻图片（如果有） */}
        {news.imageUrl && (
          <div className="h-48 overflow-hidden">
            <img 
              src={news.imageUrl} 
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* 分类标签 */}
          <span 
            className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3 font-medium"
          >
            {news.category}
          </span>
          
          {/* 标题 */}
          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {news.title}
          </h3>
          
          {/* 摘要 */}
          {news.summary && (
            <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
              {news.summary}
            </p>
          )}
          
          {/* 底部信息 */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" aria-hidden="true" />
              <span>{formatDate(news.publishTime)}</span>
            </div>
            
            <div className="flex items-center text-gray-400 text-sm group-hover:text-blue-500 transition-colors">
              <span>AI解读</span>
              <Sparkles className="w-4 h-4 ml-1" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}