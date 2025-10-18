'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import NewsCard from '@/components/NewsCard';
import { NewsItem } from '@/types/news';
import { mockNews, categories } from '@/data/news';

export default function CategoryPage() {
  const params = useParams();
  const categoryName = params.category as string;
  const [searchTerm, setSearchTerm] = useState('');
  
  // 过滤新闻
  const filteredNews = mockNews.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        news.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = news.category === categoryName;
    return matchesSearch && matchesCategory;
  });

  // 检查分类是否存在
  const categoryExists = categories.includes(categoryName);

  if (!categoryExists) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto text-center py-16">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">分类不存在</h1>
          <p className="text-gray-600 mb-8">您访问的新闻分类不存在</p>
          <Link 
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center"
            aria-label="返回新闻首页"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            返回首页
          </Link>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* 导航栏 */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="返回新闻首页"
          >
            <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
            返回首页
          </Link>
        </div>
      </nav>

      {/* 页面标题 */}
      <header className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{categoryName}新闻</h1>
        <p className="text-gray-600">专注于{categoryName}领域的最新动态和深度分析</p>
      </header>

      {/* 搜索区域 */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="bg-white/80 backdrop-blur-sm p-4 shadow-xl rounded-xl">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-gray-400 ml-2 mr-3" />
            <input 
              type="text"
              placeholder={`搜索${categoryName}相关新闻...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-3 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* 新闻列表 */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {/* 结果统计 */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            最新{categoryName}热点
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
            {filteredNews.map((news: NewsItem, index: number) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">未找到相关新闻</h3>
            <p className="text-gray-500">尝试调整搜索关键词</p>
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