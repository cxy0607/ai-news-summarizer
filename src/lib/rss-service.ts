import { NewsItem } from '@/types/news';
import Parser from 'rss-parser';

const parser = new Parser();
const BASE_URL = '';

export const RSS_SOURCES = [
  { name: 'Solidot',           url: 'https://www.solidot.org/index.rss',           category: '科技', type: 'rss' },
  { name: 'Engadget 中文版',   url: 'https://chinese.engadget.com/rss.xml',        category: '科技', type: 'rss' },
  { name: '知乎每日精选',      url: 'https://www.zhihu.com/rss',                   category: '综合', type: 'rss' },
  { name: '虎嗅',              url: 'https://rss.huxiu.com/',                      category: '商业', type: 'rss' },
  { name: '澎湃新闻',          url: 'https://www.thepaper.cn/rss.xml',             category: '综合', type: 'rss' },
  { name: '丁香园',            url: 'https://feed.iplaysoft.com/health.xml',       category: '健康', type: 'rss' },
  { name: '新浪娱乐',          url: 'https://ent.sina.com.cn/rss/',               category: '娱乐', type: 'rss' },
  { name: '新浪体育',          url: 'https://sports.sina.com.cn/rss/',             category: '体育', type: 'rss' },
  { name: '新浪财经',          url: 'https://finance.sina.com.cn/rss/',            category: '财经', type: 'rss' }
];

export const NEWS_SOURCES: any[] = [];

async function parseRSSFeed(url: string): Promise<NewsItem[]> {
  try {
    const base = process.env.NEXT_PUBLIC_APP_URL;
    const xmlText = await fetch(`${base}/api/proxy?url=${encodeURIComponent(url)}&isHtml=false`)
                .then(r => r.text());
    const data = await parser.parseString(xmlText);
    const items = data.rss?.channel?.[0]?.item || [];
    return items.map((item: any, i: number) => ({
      id: `rss-${Date.now()}-${i}`,
      title: item.title?.[0] || '无标题',
      summary: item.description?.[0] || '',
      source: new URL(url).hostname,
      publishTime: item.pubDate?.[0] || new Date().toISOString(),
      url: item.link?.[0] || '#',
      category: '科技',
      aiSummary: null
    }));
  } catch (e) {
    console.error(`RSS 解析失败: ${url}`, e);
    return [];
  }
}

export async function fetchNews(category?: string, page: number = 1, pageSize: number = 12) {
  const allNews: NewsItem[] = [];
  const failedSources: string[] = [];

  const promises = RSS_SOURCES.map(async src => {
    if (category && src.category !== category) return [];
    const news = await parseRSSFeed(src.url);
    if (news.length === 0) failedSources.push(src.name);
    return news;
  });

  const results = await Promise.allSettled(promises);
  results.forEach(r => { if (r.status === 'fulfilled') allNews.push(...r.value); });

  allNews.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
  const start = (page - 1) * pageSize;
  return { news: allNews.slice(start, start + pageSize), failedSources };
}