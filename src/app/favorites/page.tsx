'use client'; // 添加客户端组件标记，必须放在文件第一行

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { NewsItem } from '@/types/news'; // 导入新闻项类型

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

  // 移除收藏
  const removeBookmark = (id: string) => {
    const newBookmarks = bookmarks.filter(item => item.id !== id);
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  // 清除所有收藏
  const clearAllBookmarks = () => {
    if (confirm('确定要清除所有收藏吗？')) {
      setBookmarks([]);
      localStorage.removeItem('bookmarks');
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      加载中...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">我的收藏</h1>
          {bookmarks.length > 0 && (
            <button
              onClick={clearAllBookmarks}
              className="text-red-400 hover:text-red-300 text-sm flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清除全部
            </button>
          )}
        </div>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((item, index) => (
              <div key={item.id} className="relative">
                <NewsCard 
                  news={item} 
                  index={index}
                  cardClass="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-shadow"
                  titleClass="text-xl font-bold text-white hover:text-cyan-400 transition-colors"
                  sourceClass="text-gray-400 text-sm"
                  timeClass="text-gray-500 text-xs"
                  summaryClass="text-gray-300 line-clamp-3"
                />
                <button
                  onClick={() => removeBookmark(item.id)}
                  className="absolute top-2 right-2 bg-gray-800/80 p-1.5 rounded-full text-gray-400 hover:text-red-400"
                  aria-label={`删除收藏 "${item.title}"`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/40 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-lg">
            <p className="text-gray-400">暂无收藏的新闻</p>
            <Link 
              href="/"
              className="inline-block mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              浏览新闻
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}