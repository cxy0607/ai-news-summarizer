'use client';

import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import CategoryIcon from '@/components/CategoryIcon';
import { NewsItem } from '@/types/news';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载收藏的新闻
  useEffect(() => {
    const loadFavorites = () => {
      try {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('加载收藏失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  // 移除收藏
  const removeFavorite = (newsId: string) => {
    const updatedFavorites = favorites.filter(item => item.id !== newsId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // 添加到历史记录
  const addToHistory = (news: NewsItem) => {
    try {
      const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
      const newHistory = [news, ...history.filter((item: NewsItem) => item.id !== news.id)].slice(0, 50);
      localStorage.setItem('readingHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('添加到历史记录失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar 
          textColor="text-blue-300"
          activeColor="text-cyan-400"
          isMobileMenuOpen={false}
          onToggleMobileMenu={() => {}}
        />
        <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar 
        textColor="text-blue-300"
        activeColor="text-cyan-400"
        isMobileMenuOpen={false}
        onToggleMobileMenu={() => {}}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/" 
              className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-400" />
            我的收藏
          </h1>
          <p className="text-gray-400">
            共收藏了 {favorites.length} 条新闻
          </p>
        </div>

        {/* 收藏列表 */}
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((item, index) => (
              <div key={item.id} className="relative group">
                <NewsCard
                  news={item}
                  index={index}
                  cardClass="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-shadow"
                  titleClass="text-xl font-bold text-white hover:text-cyan-400 transition-colors"
                  sourceClass="text-gray-400 text-sm"
                  timeClass="text-gray-500 text-xs"
                  summaryClass="text-gray-300 line-clamp-3"
                  categoryIcon={<CategoryIcon category={item.category} />}
                  showAISummary={false}
                />
                
                {/* 操作按钮 */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <Link
                      href={`/news/${item.id}`}
                      onClick={() => addToHistory(item)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                      title="查看详情"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                      title="取消收藏"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">暂无收藏</h2>
            <p className="text-gray-500 mb-6">开始收藏您感兴趣的新闻吧</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              去首页看看
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}