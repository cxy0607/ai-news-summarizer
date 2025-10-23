'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, User, Share2, Heart } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import CategoryIcon from '@/components/CategoryIcon';
import { NewsItem } from '@/types/news';
import { getMockNews } from '@/lib/mock-data';

export default function NewsDetailPage() {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const params = useParams();

  // 加载新闻详情
  useEffect(() => {
    const loadNewsDetail = () => {
      try {
        // 先从模拟数据中查找
        const mockNews = getMockNews(50);
        const foundNews = mockNews.find(item => item.id === params.id);
        
        if (foundNews) {
          setNews(foundNews);
        } else {
          // 如果没找到，创建一个默认的新闻
          setNews({
            id: params.id as string,
            title: '新闻详情',
            content: '这是一条新闻的详细内容。在实际应用中，这里会显示从API获取的完整新闻内容。',
            source: '智能新闻',
            publishTime: new Date().toISOString().split('T')[0],
            category: '科技',
            summary: '新闻摘要内容',
            imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop'
          });
        }
      } catch (error) {
        console.error('加载新闻详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadNewsDetail();
  }, [params.id]);

  // 检查收藏状态
  useEffect(() => {
    if (news) {
      try {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorited(favorites.some((item: NewsItem) => item.id === news.id));
      } catch (error) {
        console.error('检查收藏状态失败:', error);
      }
    }
  }, [news]);

  // 添加到历史记录
  useEffect(() => {
    if (news) {
      try {
        const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
        const newHistory = [news, ...history.filter((item: NewsItem) => item.id !== news.id)].slice(0, 50);
        localStorage.setItem('readingHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error('添加到历史记录失败:', error);
      }
    }
  }, [news]);

  // 处理收藏
  const handleFavorite = () => {
    if (!news) return;
    
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (isFavorited) {
        const updatedFavorites = favorites.filter((item: NewsItem) => item.id !== news.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(false);
      } else {
        const updatedFavorites = [news, ...favorites];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  };

  // 分享功能
  const handleShare = async () => {
    if (navigator.share && news) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: window.location.href
        });
      } catch (error) {
        console.error('分享失败:', error);
      }
    } else {
      // 降级到复制链接
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
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
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar 
          textColor="text-blue-300"
          activeColor="text-cyan-400"
          isMobileMenuOpen={false}
          onToggleMobileMenu={() => {}}
        />
        <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-white mb-4">新闻不存在</h1>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
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
      
      <main className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>

        {/* 新闻内容 */}
        <article className="bg-gray-800/60 backdrop-blur-md border border-blue-500/20 rounded-xl overflow-hidden shadow-lg">
          {/* 新闻图片 */}
          {news.imageUrl && (
            <div className="aspect-video overflow-hidden">
              <img
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* 新闻元信息 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CategoryIcon category={news.category} />
                  <span className="text-sm text-gray-400">{news.category}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  <span>{news.source}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{news.publishTime}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleFavorite}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorited 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'bg-gray-700/50 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
                  }`}
                  title={isFavorited ? '取消收藏' : '添加收藏'}
                >
                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-gray-700/50 text-gray-400 hover:bg-blue-500/20 hover:text-blue-400 rounded-lg transition-colors"
                  title="分享"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 新闻标题 */}
            <h1 className="text-3xl font-bold text-white mb-6 leading-tight">
              {news.title}
            </h1>

            {/* 新闻摘要 */}
            {news.summary && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8">
                <p className="text-blue-300 text-lg leading-relaxed">{news.summary}</p>
              </div>
            )}

            {/* 新闻正文 */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {news.content}
              </p>
            </div>

            {/* 视频内容 */}
            {news.hasVideo && news.videoUrl && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">相关视频</h3>
                <div className="aspect-video bg-gray-700/50 rounded-lg overflow-hidden">
                  <video
                    src={news.videoUrl}
                    poster={news.videoThumbnail || news.imageUrl}
                    controls
                    className="w-full h-full object-cover"
                  >
                    您的浏览器不支持视频播放
                  </video>
                </div>
              </div>
            )}

            {/* 标签 */}
            <div className="mt-8 pt-6 border-t border-gray-700">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-400">标签：</span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                  {news.category}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                  {news.source}
                </span>
                {news.hasVideo && (
                  <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-sm">
                    视频新闻
                  </span>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}