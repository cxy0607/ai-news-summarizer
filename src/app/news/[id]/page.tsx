'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { generateAISummary } from '@/lib/ai-service';
import { AISummary } from '@/types/ai';
import { ArrowLeft, Bookmark, Calendar, Tag, Share2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { NewsItem } from '@/types/news';

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 获取新闻详情
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // 实际应用中应该有获取单条新闻的API，这里使用列表接口筛选
        const response = await fetch('/api/news');
        const data = await response.json();
        
        if (data.success && data.data) {
          const found = data.data.find((item: NewsItem) => item.id === id);
          if (found) {
            setNews(found);
            // 生成AI摘要
            const aiSummary = await generateAISummary(found.content);
            setSummary(aiSummary);
            
            // 保存到阅读历史
            saveToHistory(found);
            
            // 检查是否已收藏
            checkBookmarkStatus(found.id);
          }
        }
      } catch (error) {
        console.error('获取新闻详情失败:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNews();
  }, [id]);

  // 保存到阅读历史
  const saveToHistory = (newsItem: NewsItem) => {
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
      // 去重
      const newHistory = [newsItem, ...history.filter((item: NewsItem) => item.id !== newsItem.id)];
      // 限制历史记录数量
      if (newHistory.length > 50) newHistory.pop();
      localStorage.setItem('readingHistory', JSON.stringify(newHistory));
    }
  };

  // 检查收藏状态
  const checkBookmarkStatus = (newsId: string) => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.some((item: NewsItem) => item.id === newsId));
    }
  };

  // 切换收藏状态
  const toggleBookmark = () => {
    if (!news) return;
    
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      let newBookmarks;
      
      if (isBookmarked) {
        newBookmarks = bookmarks.filter((item: NewsItem) => item.id !== news.id);
      } else {
        newBookmarks = [news, ...bookmarks];
      }
      
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(!isBookmarked);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">加载中...</div>
  );

  if (!news) return (
    <div className="min-h-screen flex items-center justify-center">未找到新闻内容</div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>返回列表</span>
        </button>
        
        <article className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {news.title}
          </h1>
          
          <div className="flex items-center text-gray-500 text-sm mb-6">
            <span className="flex items-center mr-4">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(news.publishTime)}
            </span>
            <span>{news.source}</span>
            <span className="ml-auto bg-gray-100 px-3 py-1 rounded-full text-xs">
              {news.category}
            </span>
          </div>
          
          {news.imageUrl && (
            <img 
              src={news.imageUrl} 
              alt={news.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="prose prose-blue max-w-none mb-8">
            <p>{news.content}</p>
          </div>
          
          <div className="flex justify-end gap-3 mb-8">
            <button 
              onClick={toggleBookmark}
              className={`p-2 rounded-full ${isBookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}
              aria-label={isBookmarked ? "取消收藏当前新闻" : "收藏当前新闻"} 
            >
              <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
            <button 
              className="p-2 rounded-full bg-gray-100 text-gray-600"
              aria-label="分享当前新闻"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* AI摘要部分 */}
          {summary && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">AI智能分析</h2>
              
              <div className="mb-6">
                <h3 className="font-semibold mb-2">核心摘要</h3>
                <p className="text-gray-700">{summary.summary}</p>
              </div>
              
              {summary.timeline.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">时间线</h3>
                  <ul className="list-disc pl-5 text-gray-700 space-y-1">
                    {summary.timeline.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {summary.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">关键词</h3>
                  <div className="flex flex-wrap gap-2">
                    {summary.tags.map((tag, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}