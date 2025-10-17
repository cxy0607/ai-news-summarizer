'use client';

import { useState } from 'react';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';
import { Search, Filter, Sparkles } from 'lucide-react';
import { mockNews, categories } from '@/data/news';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  
  // 过滤新闻
  const filteredNews = mockNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        news.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 头部 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
              <span className="text-sm font-medium text-gray-700">AI驱动的智能新闻解读</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            智闻快览
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            让AI为你解读复杂新闻，<span className="font-semibold text-blue-600">30秒</span>掌握热点事件核心，
            <span className="font-semibold text-purple-600">一键</span>关联相关知识
          </p>
        </div>
      </header>

      {/* 搜索和筛选区域 */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-12">
        <div className="glass-card p-2 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 flex items-center">
              <Search className="w-5 h-5 text-gray-400 ml-4 mr-3" />
              <input 
                type="text"
                placeholder="搜索热点新闻... 试试 'AI' 或 '新能源'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-lg"
              />
            </div>
            
            {/* 分类筛选 */}
            <div className="flex items-center border-l border-gray-200 pl-4">
              <Filter className="w-5 h-5 text-gray-400 mr-3" />
              <div className="flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'bg-white/50 text-gray-600 hover:bg-white/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 新闻列表 */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {/* 结果统计 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            最新热点
            <span className="text-gray-500 text-lg ml-2">
              ({filteredNews.length} 条新闻)
            </span>
          </h2>
          
          <div className="text-sm text-gray-500">
            更新于: {new Date().toLocaleDateString('zh-CN')}
          </div>
        </div>

        {/* 新闻网格 */}
        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">未找到相关新闻</h3>
            <p className="text-gray-500">尝试调整搜索关键词或选择其他分类</p>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-600">
          <p>Powered by Next.js & 百度文心大模型 · 让知识触手可及</p>
        </div>
      </footer>
    </div>
  );
}