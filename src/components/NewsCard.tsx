import React, { useState, useEffect } from 'react';
import { ArrowRight, Play, Pause, Volume2, VolumeX, Brain, Clock, Eye, Heart } from 'lucide-react';
import Link from 'next/link';
import { NewsItem, NewsCardProps } from '@/types/news';

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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // 检查是否已收藏
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorited(favorites.some((item: NewsItem) => item.id === news.id));
    } catch (error) {
      console.error('检查收藏状态失败:', error);
    }
  }, [news.id]);

  const handleVideoPlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVideoPlaying(!isVideoPlaying);
  };

  const handleAISummaryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAISummaryClick) {
      onAISummaryClick(news.id);
    }
  };

  // 处理收藏/取消收藏
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (isFavorited) {
        // 取消收藏
        const updatedFavorites = favorites.filter((item: NewsItem) => item.id !== news.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(false);
      } else {
        // 添加收藏
        const updatedFavorites = [news, ...favorites];
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        setIsFavorited(true);
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
    }
  };

  // 添加到历史记录
  const addToHistory = () => {
    try {
      const history = JSON.parse(localStorage.getItem('readingHistory') || '[]');
      const newHistory = [news, ...history.filter((item: NewsItem) => item.id !== news.id)].slice(0, 50);
      localStorage.setItem('readingHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('添加到历史记录失败:', error);
    }
  };

  const formatDuration = (duration: string) => {
    // 将秒数转换为 mm:ss 格式
    const seconds = parseInt(duration);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cardClass}>
      {/* 媒体内容区域 */}
      <div className="relative h-40 overflow-hidden group">
        {news.hasVideo && news.videoUrl ? (
          // 视频内容
          <div className="relative w-full h-full">
            <video
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
                setIsVideoMuted(!isVideoMuted);
              }}
              className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded hover:bg-black/70 transition-colors"
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