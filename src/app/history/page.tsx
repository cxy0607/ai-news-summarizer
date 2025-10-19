'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';
import { Trash2 } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载历史记录
  const loadHistory = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readingHistory');
      setHistory(saved ? JSON.parse(saved) : []);
      setLoading(false);
    }
  };

  // 清除单条历史
  const removeFromHistory = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('readingHistory', JSON.stringify(newHistory));
  };

  // 清除全部历史
  const clearAllHistory = () => {
    if (confirm('确定要清除所有阅读历史吗？')) {
      setHistory([]);
      localStorage.removeItem('readingHistory');
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">加载中...</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">阅读历史</h1>
          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-red-600 hover:text-red-800 text-sm flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清除全部
            </button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item,index) => (
              <div key={item.id} className="relative">
                <NewsCard news={item} index={index} />
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-gray-500 hover:text-red-600"
                  aria-label={`删除新闻 "${item.title}" 的历史记录`} // 添加此属性
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 rounded-xl shadow-sm">
            <p className="text-gray-500">暂无阅读历史</p>
          </div>
        )}
      </div>
    </div>
  );
}