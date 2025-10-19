// src/components/NewsCard.tsx
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bookmark, Sparkles, ExternalLink } from 'lucide-react';
import { NewsItem } from '@/types/news';
import CategoryIcon from './CategoryIcon';

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export default function NewsCard({ news, index }: NewsCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 初始化收藏状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.some((item: NewsItem) => item.id === news.id));
    }
  }, [news.id]);

  // 切换收藏
  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      const newBookmarks = isBookmarked
        ? bookmarks.filter((item: NewsItem) => item.id !== news.id)
        : [news, ...bookmarks];
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(!isBookmarked);
    }
  };

  // 格式化时间
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Link href={`/news/${news.id}`} className="h-full flex flex-col">
        {/* 新闻图片 */}
        {news.imageUrl && (
          <div className="relative h-48 overflow-hidden">
            <img 
              src={news.imageUrl} 
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 bg-blue-600/90 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <CategoryIcon category={news.category} />
              <span>{news.category}</span>
            </div>
            <button
              onClick={toggleBookmark}
              className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm p-1.5 rounded-full text-white hover:text-yellow-400 transition-colors"
              aria-label={isBookmarked ? "取消收藏" : "收藏"}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>
        )}

        {/* 新闻内容 */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {news.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow">
            {news.summary}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{news.source}</span>
            <span>{formatDate(news.publishTime)}</span>
          </div>

          {/* AI 解读入口（核心） */}
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Link 
              href={`/news/${news.id}#ai-summary`}
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              查看 AI 解读
              <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </Link>
    </div>
  );
}