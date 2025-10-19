// src/app/page.tsx（只保留关键修改部分）
'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar'; // 导入修正后的 Navbar
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';
import { mockNews } from '@/data/news'; // 假设已有模拟数据

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('全部');

  // 加载新闻数据
  useEffect(() => {
    // 模拟 API 请求
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  // 筛选分类新闻
  const filteredNews = activeCategory === '全部' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  // 所有分类（去重）
  const categories = ['全部', ...Array.from(new Set(news.map(item => item.category)))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 关键修复：移除所有 props，直接使用 Navbar */}
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          最新资讯
        </h1>
        
        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {/* 新闻列表 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}