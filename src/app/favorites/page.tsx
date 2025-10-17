'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';
import { Bookmark, Trash2 } from 'lucide-react';

export default function FavoritesPage() {
  const [bookmarks, setBookmarks] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载收藏
  const loadBookmarks = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookmarks');
      setBookmarks(saved ? JSON.parse(saved) : []);
      setLoading(false);
    }
  };

  // 删除收藏
  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(bookmark => bookmark.id !== id);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">加载收藏中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <Bookmark className="w-6 h-6 text-yellow-500 mr-2" />
        我的收藏
      </h1>
      
      {bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无收藏内容</h2>
          <p className="text-gray-500 mb-6">浏览新闻时点击收藏按钮保存感兴趣的内容</p>
          <Link 
            href="/"
            className="inline-flex items-center px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            浏览新闻
          </Link>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">共 {bookmarks.length} 条收藏</p>
            <button
              onClick={() => {
                if (confirm('确定要清空所有收藏吗？')) {
                  setBookmarks([]);
                  localStorage.removeItem('bookmarks');
                }
              }}
              className="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清空收藏
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((news, index) => (
              <div key={news.id} className="relative">
                <NewsCard news={news} index={index} />
                <button
                  onClick={() => removeBookmark(news.id)}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-gray-500 hover:text-red-500 transition-colors z-10"
                  aria-label="取消收藏"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}