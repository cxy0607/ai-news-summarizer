// src/types/ai.ts - 新增文件
export interface AISummary {
  summary: string;
  timeline: string[];
  knowledgePoints: string[];
  impact: string;
  tags: string[];
  error?: string;
}

// 在news/[id]/page.tsx中导入
import { NewsItem } from '@/types/news';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft, Bookmark, Calendar, Clock, Lightbulb, Share2, Tag, User } from 'lucide-react';
import Link from 'next/link';

// 补充模拟新闻数据库
const newsDatabase: Record<string, NewsItem> = {
  '1': {
    id: '1',
    title: '人工智能在医疗领域取得突破性进展',
    content: '近日，人工智能技术在医疗诊断领域取得重大突破...',
    source: '科技日报',
    publishTime: '2023-11-15',
    category: '科技',
    imageUrl: '/images/news1.jpg'
  },
  // 补充更多新闻数据...
  '4': {
    id: '4',
    title: '全球气候变化峰会达成新协议',
    content: '在刚刚结束的全球气候变化峰会上，各国代表达成了一项新的协议...',
    source: '环球时报',
    publishTime: '2023-11-14',
    category: '环境',
    imageUrl: '/images/news4.jpg'
  }
  // 继续补充其他ID的新闻...
};