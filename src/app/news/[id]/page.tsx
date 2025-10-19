// src/app/news/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Bookmark, Calendar, Share2, Tag, Sparkles, Clock, Lightbulb } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { NewsItem } from '@/types/news';
import { AISummary } from '@/types/ai';
import { mockNews } from '@/data/news'; // 假设已有模拟数据

export default function NewsDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // 获取新闻详情
  useEffect(() => {
    if (!id || typeof id !== 'string') return;
    
    // 模拟 API 请求（实际项目替换为真实接口）
    const fetchNews = async () => {
      try {
        const found = mockNews.find(item => item.id === id);
        if (found) {
          setNews(found);
          checkBookmarkStatus(found.id);
          saveToHistory(found);
          generateAISummary(found.content); // 生成 AI 解读
        }
      } catch (error) {
        console.error('获取新闻失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  // 生成 AI 解读（核心功能）
  const generateAISummary = async (content: string) => {
    setSummaryLoading(true);
    try {
      // 模拟 AI 接口（实际项目替换为真实 AI API）
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAiSummary({
        summary: "AI 分析：本文主要讲述了...（基于内容生成的核心摘要）",
        timeline: [
          "关键事件1：时间+核心内容",
          "关键事件2：时间+核心内容",
          "关键事件3：时间+核心内容"
        ],
        knowledgePoints: [
          "知识点1：详细解释",
          "知识点2：详细解释"
        ],
        impact: "该事件可能带来的社会/经济/技术影响分析...",
        tags: ["AI", "科技", "新闻分析"]
      });
    } catch (error) {
      console.error('生成 AI 解读失败:', error);
    } finally {
      setSummaryLoading(false);
    }
  };

  // 保存到历史记录
  const saveToHistory = (newsItem: NewsItem) => {
    if (typeof window !== 'undefined') {
      const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
      const newHistory = [newsItem, ...history.filter((item: NewsItem) => item.id !== newsItem.id)];
      localStorage.setItem('readingHistory', JSON.stringify(newHistory.slice(0, 50))); // 限制 50 条
    }
  };

  // 收藏相关逻辑
  const checkBookmarkStatus = (newsId: string) => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setIsBookmarked(bookmarks.some((item: NewsItem) => item.id === newsId));
    }
  };

  const toggleBookmark = () => {
    if (!news) return;
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const newBookmarks = isBookmarked
      ? bookmarks.filter((item: NewsItem) => item.id !== news.id)
      : [news, ...bookmarks];
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    setIsBookmarked(!isBookmarked);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!news) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">未找到新闻</h2>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          返回首页
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        {/* 返回按钮 */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span>返回列表</span>
        </button>

        {/* 新闻内容 */}
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {news.imageUrl && (
            <div className="relative h-64 md:h-80">
              <img 
                src={news.imageUrl} 
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-500 dark:text-gray-400 text-sm mb-8">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(news.publishTime).toLocaleString('zh-CN')}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {news.source}
              </span>
              <span className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full text-xs">
                {news.category}
              </span>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
              {news.content.split('\n').map((para, i) => para && <p key={i} className="mb-4">{para}</p>)}
            </div>

            {/* 操作按钮 */}
            <div className="flex justify-end gap-3 mb-8">
              <button 
                onClick={toggleBookmark}
                className={`p-2.5 rounded-full transition-colors ${
                  isBookmarked 
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' 
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}
                aria-label={isBookmarked ? "取消收藏" : "收藏"}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} />
              </button>
              <button className="p-2.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="分享新闻">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* AI 解读模块（核心） */}
            <div id="ai-summary" className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 dark:text-white">
                <Sparkles className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                AI 智能解读
              </h2>

              {summaryLoading ? (
                <div className="py-12 flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">AI 正在分析内容，请稍候...</p>
                </div>
              ) : aiSummary ? (
                <>
                  {/* 核心摘要 */}
                  <div className="mb-8 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                      <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
                      核心摘要
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">{aiSummary.summary}</p>
                  </div>

                  {/* 时间线 */}
                  <div className="mb-8">
                    <h3 className="font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      关键时间线
                    </h3>
                    <ul className="space-y-3 pl-6 border-l-2 border-blue-200 dark:border-blue-800">
                      {aiSummary.timeline.map((item, i) => (
                        <li key={i} className="relative">
                          <span className="absolute -left-[9px] top-1 w-3 h-3 rounded-full bg-blue-600"></span>
                          <span className="text-gray-700 dark:text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 关键词 */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center text-gray-900 dark:text-white">
                      <Tag className="w-4 h-4 mr-2 text-blue-600" />
                      关键词
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {aiSummary.tags.map((tag, i) => (
                        <span key={i} className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-700 dark:text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>AI 解读生成失败</p>
                  <button 
                    onClick={() => news && generateAISummary(news.content)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    重试
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}