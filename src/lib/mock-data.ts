import { NewsItem } from '@/types/news';

// 生成模拟新闻数据
export const getMockNews = (count = 10): NewsItem[] => {
  const categories = ['科技', '环境', '汽车', '医疗', '航天', '政治'];
  const sources = ['科技日报', '环球时报', '新华社', '人民日报', '央视新闻'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `mock-news-${i + 1}`,
    title: `模拟新闻标题 ${i + 1}`,
    content: `这是模拟新闻内容 ${i + 1}，用于在无法获取真实新闻数据时展示。这部分内容仅作为占位符使用。这是模拟新闻内容 ${i + 1}，用于在无法获取真实新闻数据时展示。这部分内容仅作为占位符使用。`,
    source: sources[Math.floor(Math.random() * sources.length)],
    publishTime: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
    category: categories[Math.floor(Math.random() * categories.length)],
    summary: `这是模拟新闻摘要 ${i + 1}，简要介绍了新闻的主要内容和核心要点。`,
    imageUrl: `https://picsum.photos/seed/${i + 1}/400/200`,
    link: `#mock-link-${i + 1}`
  }));
};