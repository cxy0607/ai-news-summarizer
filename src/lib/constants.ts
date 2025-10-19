// src/lib/constants.ts
// 根据你的业务需求定义常量，示例如下：

// API 相关常量
export const API_BASE_URL = 'https://api.example.com';
export const NEWS_ENDPOINT = '/api/news';
export const AI_SUMMARY_ENDPOINT = '/api/ai/summary';

// 本地存储相关常量
export const LOCAL_STORAGE_KEYS = {
  BOOKMARKS: 'bookmarks',
  READING_HISTORY: 'readingHistory',
  DARK_MODE: 'darkMode',
} as const;

// 新闻分类常量
export const NEWS_CATEGORIES = [
  '科技', '财经', '体育', '娱乐', '健康', '教育'
] as const;

// 分页相关常量
export const PAGE_SIZE = 10;
export const MAX_HISTORY_COUNT = 50;