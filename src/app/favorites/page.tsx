// src/app/favorites/page.tsx（收藏页面）
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从本地存储加载收藏
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookmarks');
      setFavorites(saved ? JSON.parse(saved) : []);
      setLoading(false);
    }
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">我的收藏</h1>
        
        {favorites.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">暂无收藏的新闻</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}