// src/lib/rss-service.ts
import { parseString } from 'xml2js';
import { NewsItem } from '@/types/news';

// RSS源配置
export const RSS_SOURCES = [
  {
    name: '科技日报',
    url: 'https://www.stdaily.com/rss/tech.xml',
    category: '科技',
    type: 'rss'
  },
  {
    name: '新华网',
    url: 'https://www.news.cn/rss/politics.xml',
    category: '政治',
    type: 'rss'
  },
  {
    name: '中国环境网',
    url: 'https://www.cenews.com.cn/rss.xml',
    category: '环境',
    type: 'rss'
  },
  {
    name: '易车网',
    url: 'https://news.yiche.com/rss.xml',
    category: '汽车',
    type: 'rss'
  }
];

// 原有的HTML新闻源配置
export const NEWS_SOURCES = [
  {
    name: '科技日报',
    url: 'https://epaper.stdaily.com/statics/technology-site/index.html',
    backupUrl: 'https://www.stdaily.com/tech/',
    category: '科技',
    parseRules: {
      listSelector: '.news-list .article-item',
      titleSelector: 'h3 a, .title a',
      linkSelector: 'a',
      timeSelector: '.time, .pubdate',
      summarySelector: '.summary, .desc'
    }
  },
  // ... 其他HTML源配置
];

// RSS解析函数
async function parseRSSFeed(url: string): Promise<any[]> {
  try {
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&isHtml=false`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`RSS请求失败: ${response.status}`);
    }
    
    const xmlText = await response.text();
    
    return new Promise((resolve, reject) => {
      parseString(xmlText, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        
        const items = result?.rss?.channel?.[0]?.item || [];
        const parsedItems = items.map((item: any) => ({
          title: item.title?.[0] || '无标题',
          link: item.link?.[0] || '',
          pubDate: item.pubDate?.[0] || new Date().toISOString(),
          description: item.description?.[0] || '暂无摘要'
        }));
        
        resolve(parsedItems);
      });
    });
  } catch (error) {
    console.error('RSS解析失败:', error);
    throw error;
  }
}

// 模拟新闻数据
export function getMockNews(): NewsItem[] {
  return [
    {
      id: 'mock-1',
      title: '人工智能助力教育变革',
      content: 'AI技术正在重塑教育行业，个性化学习方案让每个学生都能获得定制化教学体验。',
      source: '科技日报',
      publishTime: new Date().toISOString().split('T')[0],
      category: '科技',
      summary: 'AI技术正在重塑教育行业，个性化学习方案让每个学生都能获得定制化教学体验。'
    }
  ];
}

// 解析HTML内容提取新闻
function parseHtmlNews(html: string, source: typeof NEWS_SOURCES[0]): { items: any[] } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const newsItems: any[] = [];
  const { listSelector, titleSelector, linkSelector, timeSelector, summarySelector } = source.parseRules;

  const articleElements = doc.querySelectorAll(listSelector);
  
  articleElements.forEach((el, index) => {
    try {
      const titleEl = el.querySelector(titleSelector);
      const title = titleEl?.textContent?.trim() || '无标题';

      const linkEl = el.querySelector(linkSelector);
      let link = linkEl?.getAttribute('href') || '';
      if (link && !link.startsWith('http')) {
        const baseUrl = new URL(source.url).origin;
        link = link.startsWith('/') ? `${baseUrl}${link}` : `${baseUrl}/${link}`;
      }

      const timeEl = el.querySelector(timeSelector);
      let pubDate = timeEl?.textContent?.trim() || '';
      if (pubDate) {
        try {
          pubDate = new Date(pubDate).toISOString().split('T')[0];
        } catch {
          pubDate = new Date().toISOString().split('T')[0];
        }
      } else {
        pubDate = new Date().toISOString().split('T')[0];
      }

      const summaryEl = el.querySelector(summarySelector);
      const description = summaryEl?.textContent?.trim() || '暂无摘要';

      newsItems.push({ title, link, pubDate, description });
    } catch (error) {
      console.error(`解析 ${source.name} 第 ${index} 条新闻失败:`, error);
    }
  });

  return { items: newsItems };
}

// 带重试的HTML请求函数
async function fetchHtmlWithRetry(source: typeof NEWS_SOURCES[0], retries = 2): Promise<any> {
  const attemptFetch = async (url: string, remainingRetries: number): Promise<any> => {
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&isHtml=true`;
      
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error(`请求超时`)), 10000)
      );

      const response = await Promise.race([
        fetch(proxyUrl, {
          headers: {
            'Accept': 'text/html,application/xhtml+xml'
          }
        }),
        timeoutPromise
      ]);

      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }

      const html = await response.text();
      return parseHtmlNews(html, source);
    } catch (error) {
      if (remainingRetries > 0) {
        console.log(`从 ${source.name} 获取失败，剩余重试次数: ${remainingRetries}，重试中...`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (3 - remainingRetries)));
        return attemptFetch(url, remainingRetries - 1);
      }
      throw error;
    }
  };

  try {
    return await attemptFetch(source.url, retries);
  } catch (primaryError) {
    if (source.backupUrl) {
      console.log(`主URL失败，尝试 ${source.name} 的备用URL...`);
      return await attemptFetch(source.backupUrl, retries);
    }
    throw primaryError;
  }
}

// 核心新闻获取函数
export async function fetchNews(
  category?: string,
  page: number = 1,
  pageSize: number = 6
): Promise<{ news: NewsItem[], failedSources: string[] }> {
  const allNews: NewsItem[] = [];
  const failedSources: string[] = [];

  // 优先使用RSS源
  const rssSources = RSS_SOURCES.filter(source => 
    !category || source.category === category
  );
  
  const htmlSources = NEWS_SOURCES.filter(source => 
    !category || source.category === category
  );

  // 并行获取RSS和HTML数据
  const promises = [
    ...rssSources.map(async (source) => {
      try {
        const items = await parseRSSFeed(source.url);
        return items.map((item: any, index: number): NewsItem => ({
          id: `rss-${source.name}-${Date.now()}-${index}`,
          title: item.title,
          content: item.description,
          source: source.name,
          publishTime: item.pubDate,
          category: source.category,
          summary: item.description.substring(0, 100) + (item.description.length > 100 ? '...' : ''),
          link: item.link
        }));
      } catch (error) {
        console.error(`RSS源 ${source.name} 失败:`, error);
        failedSources.push(source.name);
        return [];
      }
    }),
    ...htmlSources.map(async (source) => {
      try {
        const { items } = await fetchHtmlWithRetry(source);
        return items.map((item: any, index: number): NewsItem => ({
          id: `html-${source.name}-${Date.now()}-${index}`,
          title: item.title,
          content: item.description,
          source: source.name,
          publishTime: item.pubDate,
          category: source.category,
          summary: item.description.substring(0, 100) + (item.description.length > 100 ? '...' : ''),
          link: item.link
        }));
      } catch (error) {
        console.error(`HTML源 ${source.name} 失败:`, error);
        failedSources.push(source.name);
        return [];
      }
    })
  ];

  const results = await Promise.allSettled(promises);
  
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      allNews.push(...result.value);
    }
  });

  // 补充模拟数据（如果真实数据不足）
  if (allNews.length < pageSize) {
    let mockNews = getMockNews();
    if (category) {
      mockNews = mockNews.filter(item => item.category === category);
    }
    
    const existingTitles = new Set(allNews.map(item => item.title));
    const uniqueMockNews = mockNews.filter(item => !existingTitles.has(item.title));
    allNews.push(...uniqueMockNews);
  }

  // 按发布时间排序
  allNews.sort((a, b) => 
    new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
  );

  // 分页处理
  const startIndex = (page - 1) * pageSize;
  const paginatedNews = allNews.slice(startIndex, startIndex + pageSize);

  return { news: paginatedNews, failedSources };
}
