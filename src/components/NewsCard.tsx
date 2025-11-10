"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Pause, Volume2, VolumeX, Brain, Clock, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { NewsItem, NewsCardProps } from '@/types/news';

import { useAuth } from '@/components/AuthContext';
// 新闻卡片组件
const NewsCard: React.FC<NewsCardProps> = ({
  news,
  index,
  cardClass = '',
  titleClass = '',
  sourceClass = '',
  timeClass = '',
  summaryClass = '',
  categoryIcon,
  showAISummary = true,
  onAISummaryClick
}) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  // 视频控制相关 state/ref
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 从后端检查是否已收藏
  useEffect(() => {
    let mounted = true;
    const checkFavorite = async () => {
      if (!user) return;
      try {
        const res = await fetch(`/api/favorites?newsId=${encodeURIComponent(news.id)}`, { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted) setIsFavorited(Boolean(json?.favorited));
      } catch (err) {
        console.error('检查收藏状态失败:', err);
      }
    };

    checkFavorite();
    return () => { mounted = false; };
  }, [news.id, user]);

  // 处理收藏/取消收藏（使用后端 API）
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    try {
      if (isFavorited) {
        const res = await fetch('/api/favorites', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsId: news.id }),
          credentials: 'include'
        });
        if (!res.ok) throw new Error('取消收藏失败');
        setIsFavorited(false);
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newsId: news.id, newsData: news }),
          credentials: 'include'
        });
        if (!res.ok) throw new Error('添加收藏失败');
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('收藏操作失败:', err);
    }
  };

  // 添加到历史记录（通过后端 API）
  const addToHistory = async () => {
    if (!user) return;
    try {
      await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId: news.id, newsData: news }),
        credentials: 'include'
      });
    } catch (err) {
      console.error('添加到历史记录失败:', err);
    }
  };

  // 视频播放/暂停 切换
  const handleVideoPlay = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const v = videoRef.current;
    if (!v) return;
    if (isVideoPlaying) {
      v.pause();
      setIsVideoPlaying(false);
    } else {
      v.play().catch(err => console.warn('视频播放失败', err));
      setIsVideoPlaying(true);
    }
  };

  // AI 解读按钮代理
  const handleAISummaryClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (onAISummaryClick) onAISummaryClick(news.id);
  };

  const formatDuration = (sec?: number | string) => {
    if (sec === undefined || sec === null) return '';
    const n = typeof sec === 'string' ? Number(sec) : sec;
    if (!n || isNaN(n)) return '';
    const s = Math.floor(n % 60).toString().padStart(2, '0');
    const m = Math.floor(n / 60).toString();
    return `${m}:${s}`;
  };

  // 其余代码保持不变...


  return (
    <div className={cardClass}>
      {/* 媒体内容区域 */}
      <div className="relative h-40 overflow-hidden group">
        {news.hasVideo && news.videoUrl ? (
          // 视频内容
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={news.videoUrl}
              poster={news.videoThumbnail || news.imageUrl}
              className="w-full h-full object-cover"
              muted={isVideoMuted}
              loop
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            />
            
            {/* 视频控制层 */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleVideoPlay}
                className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
                aria-label={isVideoPlaying ? '暂停视频' : '播放视频'}
                title={isVideoPlaying ? '暂停' : '播放'}
              >
                {isVideoPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-1" />
                )}
              </button>
            </div>

            {/* 视频时长 */}
            {news.videoDuration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatDuration(news.videoDuration)}
              </div>
            )}

            {/* 静音控制 */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsVideoMuted(prev => !prev);
                if (videoRef.current) videoRef.current.muted = !isVideoMuted;
              }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded hover:bg-black/70 transition-colors"
              title={isVideoMuted ? '取消静音' : '静音'}
            >
              {isVideoMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : news.imageUrl ? (
          // 图片内容
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          // 默认占位符
          <div className="h-40 bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-sm">{news.category}</span>
          </div>
        )}

        {/* 媒体类型标识 */}
        <div className="absolute top-2 left-2">
          {news.hasVideo ? (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
              <Play className="w-3 h-3" />
              视频
            </span>
          ) : news.imageUrl ? (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
              图片
            </span>
          ) : null}
        </div>

        {/* 收藏按钮 */}
        <div className="absolute top-2 right-2">
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg transition-colors ${
              isFavorited 
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                : 'bg-black/50 text-gray-300 hover:bg-red-500/20 hover:text-red-400'
            }`}
            title={isFavorited ? '取消收藏' : '添加收藏'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      <div className="p-5">
        {/* 分类图标 + 来源 + 时间 */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {categoryIcon}
            <span className={sourceClass}>{news.source}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={timeClass}>{news.publishTime}</span>
            {news.hasVideo && (
              <div className="flex items-center gap-1 text-gray-500 text-xs">
                <Eye className="w-3 h-3" />
                <span>视频</span>
              </div>
            )}
          </div>
        </div>
        
        {/* 新闻标题 */}
        <Link href={`/news/${news.id}`} className="block">
          <h3 className={titleClass}>{news.title}</h3>
        </Link>
        
        {/* 新闻摘要 */}
        {news.summary && (
          <p className={`mt-3 ${summaryClass}`}>{news.summary}</p>
        )}

        {/* AI解读按钮 */}
        {showAISummary && (
          <button
            onClick={handleAISummaryClick}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:from-purple-500/30 hover:to-blue-500/30 transition-all"
          >
            <Brain className="w-4 h-4" />
            AI智能解读
          </button>
        )}

        {/* 查看详情链接 */}
        <Link 
          href={`/news/${news.id}`}
          onClick={addToHistory}
          className="inline-flex items-center gap-1 mt-4 text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
        >
          查看详情
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;