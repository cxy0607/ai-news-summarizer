'use client';

import { useState, useEffect } from 'react';
import { History, ArrowLeft, Trash2, Eye, Clock } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import CategoryIcon from '@/components/CategoryIcon';
import { NewsItem } from '@/types/news';

export default function HistoryPage() {
  const [history, setHistory] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载历史记录
  useEffect(() => {
    const loadHistory = () => {
      try {
        const storedHistory = localStorage.getItem('readingHistory');
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('加载历史记录失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  // 清除历史记录
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('readingHistory');
  };

  // 移除单条历史记录
  const removeHistoryItem = (newsId: string) => {
    const updatedHistory = history.filter(item => item.id !== newsId);
    setHistory(updatedHistory);
    localStorage.setItem('readingHistory', JSON.stringify(updatedHistory));
  };

  // 添加到历史记录
  const addToHistory = (news: NewsItem) => {
    try {
      const newHistory = [news, ...history.filter(item => item.id !== news.id)].slice(0, 50);
      setHistory(newHistory);
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <History className="w-8 h-8 text-blue-400" />
                阅读历史
              </h1>
              <p className="text-gray-400">
                共浏览了 {history.length} 条新闻
              </p>
            </div>
            
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                清空历史
              </button>
            )}
          </div>
        </div>

        {/* 历史记录列表 */}
        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
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
                      title="重新查看"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => removeHistoryItem(item.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                      title="从历史中移除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* 阅读时间标识 */}
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-xs text-gray-400 bg-black/50 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" />
                  <span>已阅读</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <History className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">暂无历史记录</h2>
            <p className="text-gray-500 mb-6">开始阅读新闻，这里会记录您的浏览历史</p>
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