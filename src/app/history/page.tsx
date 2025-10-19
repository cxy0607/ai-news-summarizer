'use client';

import { useState, useEffect } from 'react';
import { Trash2, Search, X } from 'lucide-react'; // 导入 Search 和 X 组件
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import Link from 'next/link';
import { NewsItem } from '@/types/news';

export default function HistoryPage() {
  const [history, setHistory] = useState<NewsItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<NewsItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // 加载浏览历史
  const loadHistory = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('readingHistory');
        const historyData = saved ? JSON.parse(saved) : [];
        setHistory(historyData);
        setFilteredHistory(historyData);
      } catch (error) {
        console.error('解析历史数据失败:', error);
        setHistory([]);
        setFilteredHistory([]);
        localStorage.removeItem('readingHistory');
      } finally {
        setLoading(false);
      }
    }
  };

  // 搜索筛选
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHistory(history);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredHistory(
        history.filter(item => 
          item.title.toLowerCase().includes(term) || 
          item.content.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, history]);

  // 移除单条历史
  const removeHistoryItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    setFilteredHistory(newHistory);
    localStorage.setItem('readingHistory', JSON.stringify(newHistory));
  };

  // 清除所有历史
  const clearAllHistory = () => {
    if (confirm('确定要清除所有浏览历史吗？')) {
      setHistory([]);
      setFilteredHistory([]);
      localStorage.removeItem('readingHistory');
    }
  };

  useEffect(() => {
    loadHistory();
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
          <h1 className="text-2xl font-bold">浏览历史</h1>
          {history.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-red-400 hover:text-red-300 text-sm flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清除全部
            </button>
          )}
        </div>

        {/* 搜索框 */}
        <div className="relative max-w-md mb-8">
          <input
            type="text"
            placeholder="搜索历史记录..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              aria-label="清除搜索框"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filteredHistory.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item, index) => (
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
                  onClick={() => removeHistoryItem(item.id)}
                  className="absolute top-2 right-2 bg-gray-800/80 p-1.5 rounded-full text-gray-400 hover:text-red-400"
                  aria-label={`删除历史记录 "${item.title}"`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/40 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-lg">
            <p className="text-gray-400">暂无浏览历史</p>
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