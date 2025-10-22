'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, Search, X, Filter, LogIn } from 'lucide-react';
import Navbar from '@/components/Navbar';
import NewsCard from '@/components/NewsCard';
import AISummaryModal from '@/components/AISummaryModal';
import ParticleBackground from '@/components/ParticleBackground';
import CategoryIcon from '@/components/CategoryIcon';
// 改为调用后端接口获取新闻，避免浏览器端跨域/解析失败
import { getMockNews } from '@/lib/mock-data';
import { NewsItem } from '@/types/news';
import { AISummary } from '@/types/ai';
import { useAuth } from '@/components/AuthContext';
import { generateAISummary } from '@/lib/ai-service';
import Link from 'next/link';

// 分类数据
const categories = ['科技', '环境', '汽车', '健康', '娱乐', '体育', '财经'];

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isNavbarMobileOpen, setIsNavbarMobileOpen] = useState<boolean>(false);

  // AI解读相关状态
  const [aiSummaryModal, setAiSummaryModal] = useState<{
    isOpen: boolean;
    newsId: string;
    newsTitle: string;
  }>({
    isOpen: false,
    newsId: '',
    newsTitle: ''
  });
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // 认证状态
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // 处理AI解读点击
  const handleAISummaryClick = async (newsId: string) => {
    const newsItem = news.find(item => item.id === newsId);
    if (!newsItem) return;

    setAiSummaryModal({
      isOpen: true,
      newsId,
      newsTitle: newsItem.title
    });

    // 如果已有AI摘要，直接显示
    if (newsItem.aiSummary) {
      setAiSummary(newsItem.aiSummary);
      return;
    }

    // 生成AI摘要
    setAiLoading(true);
    try {
      const summary = await generateAISummary(newsItem.content);
      setAiSummary(summary);
      
      // 更新新闻项中的AI摘要
      setNews(prevNews => 
        prevNews.map(item => 
          item.id === newsId 
            ? { ...item, aiSummary: summary }
            : item
        )
      );
    } catch (error) {
      console.error('AI摘要生成失败:', error);
      setAiSummary({
        summary: '抱歉，AI服务暂时不可用',
        timeline: [],
        knowledgePoints: [],
        impact: '',
        tags: [],
        error: 'AI服务暂时不可用，请稍后再试'
      });
    } finally {
      setAiLoading(false);
    }
  };

  // 关闭AI解读弹窗
  const closeAISummaryModal = () => {
    setAiSummaryModal({
      isOpen: false,
      newsId: '',
      newsTitle: ''
    });
    setAiSummary(null);
  };

  // 加载新闻数据
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        setFailedSources([]);
        
        const params = new URLSearchParams();
        if (activeCategory) params.set('category', activeCategory);
        params.set('page', '1');
        params.set('pageSize', '12');

        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) {
          throw new Error(`API 响应错误: ${res.status}`);
        }
        const json = await res.json();
        const fetchedNews: NewsItem[] = json?.data ?? [];
        const sources: string[] = json?.failedSources ?? [];
        
        const finalNews = fetchedNews.length > 0 
          ? fetchedNews 
          : getMockNews(12).filter(item => !activeCategory || item.category === activeCategory);
        
        setNews(finalNews);
        setFailedSources(sources);
      } catch (err) {
        console.error('加载新闻失败:', err);
        setNews(
          getMockNews(12).filter(item => !activeCategory || item.category === activeCategory)
        );
        setError('部分新闻源加载失败，已显示可用新闻');
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, [activeCategory]);

  // 从URL参数初始化分类
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const category = params.get('category');
      if (category && categories.includes(category)) {
        setActiveCategory(category);
      }
    }
  }, []);

  // 搜索+分类筛选逻辑
  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !activeCategory || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // 切换分类（更新URL参数）
  const handleCategoryChange = (category: string) => {
    setActiveCategory(prev => prev === category ? null : category);
    setMobileMenuOpen(false);
    
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (activeCategory === category) {
        params.delete('category');
      } else {
        params.set('category', category);
      }
      window.history.pushState({}, '', `/?${params.toString()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 overflow-x-hidden">
      <ParticleBackground />
      
      <Navbar 
        textColor="text-blue-300"
        activeColor="text-cyan-400"
        isMobileMenuOpen={isNavbarMobileOpen}
        onToggleMobileMenu={() => setIsNavbarMobileOpen(!isNavbarMobileOpen)}
      />
      
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            智能新闻聚合平台
          </h1>
          <p className="mt-2 text-gray-400">实时抓取全网科技、环境、汽车等领域新闻</p>
          
          {/* 登录提示 */}
          {!isAuthenticated && !authLoading && (
            <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg max-w-md mx-auto">
              <p className="text-blue-300 text-sm mb-3">
                登录后可享受个性化推荐和收藏功能
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <LogIn className="w-4 h-4" />
                立即登录
              </Link>
            </div>
          )}
        </div>

        {/* 失败源提示 */}
        {failedSources.length > 0 && (
          <div className="bg-blue-900/30 border border-blue-500/30 text-blue-300 px-4 py-3 rounded-lg mb-6 flex items-start backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5 text-cyan-400" />
            <div className="text-sm">
              <p className="font-medium">部分新闻源暂时无法访问:</p>
              <p className="mt-1">{failedSources.join(', ')}</p>
              <p className="mt-1 text-cyan-300">已为您切换到备用新闻源</p>
            </div>
          </div>
        )}

        {/* 搜索框 */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur-md"></div>
          <div className="relative bg-gray-800/80 backdrop-blur-md border border-blue-500/20 rounded-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索新闻标题或内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-cyan-400 text-gray-200 placeholder-gray-400"
              aria-label="搜索新闻"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                aria-label="清除搜索"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* 移动端分类筛选 */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 backdrop-blur-md border border-blue-500/20 rounded-lg w-full justify-between hover:bg-gray-700/80 transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-cyan-400" />
              {activeCategory ? `当前分类: ${activeCategory}` : '所有分类'}
            </span>
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 bg-gray-800/80 backdrop-blur-md border border-blue-500/20 rounded-lg p-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-2 transition-colors ${
                    activeCategory === category
                      ? 'bg-blue-900/30 text-cyan-400 border-l-2 border-cyan-400'
                      : 'text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <CategoryIcon category={category} />
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* 桌面端分类筛选 */}
        <div className="hidden md:flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${
              !activeCategory
                ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            全部
          </button>

          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-cyan-500/80 to-blue-600/80 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/60 border border-gray-700'
              }`}
            >
              <CategoryIcon category={category} />
              {category}
            </button>
          ))}
        </div>
        
        {/* 新闻内容 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg shadow-blue-900/10 animate-pulse"
              >
                <div className="h-40 bg-gradient-to-r from-gray-700/50 to-gray-600/50"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-700/50 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-2/3"></div>
                  <div className="mt-4 h-4 bg-gray-700/50 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-gray-800/40 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-900/30 text-cyan-400 mb-4">
              <X className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-cyan-300 mb-2">{error}</h2>
            <button
              onClick={() => {
                setLoading(true);
                const params = new URLSearchParams();
                if (activeCategory) params.set('category', activeCategory);
                params.set('page', '1');
                params.set('pageSize', '12');
                fetch(`/api/news?${params.toString()}`)
                  .then(async (res) => {
                    if (!res.ok) throw new Error('请求失败');
                    const json = await res.json();
                    const fetchedNews: NewsItem[] = json?.data ?? [];
                    const sources: string[] = json?.failedSources ?? [];
                    setNews(fetchedNews.length > 0 ? fetchedNews : getMockNews(12));
                    setFailedSources(sources);
                    setError(null);
                  })
                  .catch(() => {
                    setError('仍然无法加载，请稍后再试');
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              }}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              重试
            </button>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item, index) => (
              <NewsCard
                key={item.id}
                news={item}
                index={index}
                cardClass="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-900/20 transition-shadow"
                titleClass="text-xl font-bold text-white hover:text-cyan-400 transition-colors"
                sourceClass="text-gray-400 text-sm"
                timeClass="text-gray-500 text-xs"
                summaryClass="text-gray-300 line-clamp-3"
                categoryIcon={<CategoryIcon category={item.category} />}
                showAISummary={true}
                onAISummaryClick={handleAISummaryClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800/40 backdrop-blur-md border border-blue-500/20 rounded-xl shadow-lg">
            <p className="text-gray-400">没有找到匹配的新闻</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory(null);
                window.history.pushState({}, '', '/');
              }}
              className="mt-4 px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
            >
              查看全部新闻
            </button>
          </div>
        )}
      </main>
    </div>
  );
}