'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, Trash2, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface HistoryItem {
  newsId: string;
  title: string;
  category: string;
  readTime: string;
  summary?: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载历史记录
  const loadHistory = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readingHistory');
      setHistory(saved ? JSON.parse(saved) : []);
      setLoading(false);
    }
  };

  // 删除单条历史
  const removeHistoryItem = (newsId: string) => {
    const updated = history.filter(item => item.newsId !== newsId);
    setHistory(updated);
    localStorage.setItem('readingHistory', JSON.stringify(updated));
  };

  // 清空历史
  const clearAllHistory = () => {
    if (confirm('确定要清空所有浏览历史吗？')) {
      setHistory([]);
      localStorage.removeItem('readingHistory');
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">加载历史记录中...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <History className="w-6 h-6 text-blue-500 mr-2" />
        解读历史
      </h1>
      
      {history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无浏览历史</h2>
          <p className="text-gray-500 mb-6">浏览新闻并查看AI解读后，会在这里显示记录</p>
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
            <p className="text-gray-600">共 {history.length} 条记录</p>
            <button
              onClick={clearAllHistory}
              className="text-sm text-red-500 hover:text-red-700 flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              清空历史
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {history.map((item) => (
                <div key={item.newsId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/news/${item.newsId}`}
                        className="block"
                      >
                        <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors truncate">
                          {item.title}
                        </h3>
                      </Link>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs mr-3">
                          {item.category}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {formatDate(item.readTime)}
                        </span>
                      </div>
                      
                      {item.summary && (
                        <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                          {item.summary}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => removeHistoryItem(item.newsId)}
                      className="ml-4 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="删除记录"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}