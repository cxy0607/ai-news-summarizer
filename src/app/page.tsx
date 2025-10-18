'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';
import { mockNews, categories } from '@/data/news';
import { Search, Filter } from 'lucide-react';

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部');

  // 筛选新闻（搜索+分类）
  useEffect(() => {
    let filtered = mockNews;
    
    // 按分类筛选
    if (activeCategory !== '全部') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // 按搜索词筛选
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        item => item.title.toLowerCase().includes(term) || 
               item.summary?.toLowerCase().includes(term)
      );
    }
    
    setNews(filtered);
  }, [searchTerm, activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 引入导航栏 */}
      <Navbar />

      {/* 页面标题和搜索区 */}
      <header className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          智能新闻助手
        </h1>
        
        {/* 搜索框 */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="搜索新闻标题或内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* 分类筛选标签 */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('全部')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === '全部' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* 新闻列表 */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/80 rounded-xl shadow-sm">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">未找到相关新闻</h3>
            <p className="text-gray-500">请尝试其他搜索词或分类</p>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} 智能新闻助手 | 基于AI技术提供新闻解读</p>
        </div>
      </footer>
    </div>
  );
}