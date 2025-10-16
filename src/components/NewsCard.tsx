'use client';

import Link from 'next/link';
import { NewsItem } from '@/types/news';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

export default function NewsCard({ news, index }: NewsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link 
        href={`/news/${news.id}`}
        className="block group"
      >
        <div className="glass-card p-6 hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-1 border border-white/30">
          {/* 分类标签和来源 */}
          <div className="flex justify-between items-center mb-3">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-medium">
              {news.category}
            </span>
            <span className="text-gray-500 text-sm flex items-center">
              {news.source}
            </span>
          </div>
          
          {/* 新闻标题 */}
          <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {news.title}
          </h2>
          
          {/* 新闻摘要 */}
          {news.summary && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
              {news.summary}
            </p>
          )}
          
          {/* 底部信息 */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {news.publishTime}
            </div>
            <div className="flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700 transition-colors">
              <span>AI解读</span>
              <ExternalLink className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}