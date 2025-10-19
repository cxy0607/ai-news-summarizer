export {};

import { NewsItem } from '@/types/news';

// 新闻源配置（包含网页地址和解析规则）
export const NEWS_SOURCES = [
  {
    name: '科技日报',
    url: 'https://epaper.stdaily.com/statics/technology-site/index.html',
    backupUrl: 'https://www.stdaily.com/tech/',
    category: '科技',
    // HTML解析规则（根据实际网页结构调整）
    parseRules: {
      listSelector: '.news-list .article-item', // 新闻列表项选择器
      titleSelector: 'h3 a, .title a', // 标题选择器
      linkSelector: 'a', // 链接选择器
      timeSelector: '.time, .pubdate', // 时间选择器
      summarySelector: '.summary, .desc' // 摘要选择器
    }
  },
  {
    name: '新华网 - 国内',
    url: 'http://www.xinhuanet.com/politics/',
    backupUrl: 'http://www.xinhuanet.com/politics/index.htm',
    category: '政治',
    parseRules: {
      listSelector: '.news-list li, .mod-news-list .item',
      titleSelector: 'a',
      linkSelector: 'a',
      timeSelector: '.time',
      summarySelector: '.intro'
    }
  },
  {
    name: '中国环境网',
    url: 'https://www.cenews.com.cn/hjyw/',
    backupUrl: 'https://www.envir.gov.cn/mtjj/',
    category: '环境',
    parseRules: {
      listSelector: '.news_list .news_item, .list_news li',
      titleSelector: 'h3 a, .title a',
      linkSelector: 'a',
      timeSelector: '.date',
      summarySelector: '.content'
    }
  },
  {
    name: '易车网',
    url: 'https://news.yiche.com/',
    backupUrl: 'https://www.autohome.com.cn/news/',
    category: '汽车',
    parseRules: {
      listSelector: '.news-wrap .item, .article-wrapper .article-item',
      titleSelector: '.title a, h3 a',
      linkSelector: 'a',
      timeSelector: '.time',
      summarySelector: '.desc'
    }
  }
];

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
    },
    // ... 其他模拟数据
  ];
}

// 解析HTML内容提取新闻
function parseHtmlNews(html: string, source: typeof NEWS_SOURCES[0]): { items: any[] } {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const newsItems: any[] = [];
  const { listSelector, titleSelector, linkSelector, timeSelector, summarySelector } = source.parseRules;

  // 获取新闻列表元素
  const articleElements = doc.querySelectorAll(listSelector);
  
  articleElements.forEach((el, index) => {
    try {
      // 提取标题
      const titleEl = el.querySelector(titleSelector);
      const title = titleEl?.textContent?.trim() || '无标题';

      // 提取链接
      const linkEl = el.querySelector(linkSelector);
      let link = linkEl?.getAttribute('href') || '';
      // 补全相对路径
      if (link && !link.startsWith('http')) {
        const baseUrl = new URL(source.url).origin;
        link = link.startsWith('/') ? `${baseUrl}${link}` : `${baseUrl}/${link}`;
      }

      // 提取时间
      const timeEl = el.querySelector(timeSelector);
      let pubDate = timeEl?.textContent?.trim() || '';
      // 格式化时间（尝试转换为标准格式）
      if (pubDate) {
        try {
          pubDate = new Date(pubDate).toISOString().split('T')[0];
        } catch {
          pubDate = new Date().toISOString().split('T')[0]; // 转换失败用当前时间
        }
      } else {
        pubDate = new Date().toISOString().split('T')[0];
      }

      // 提取摘要
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

  // 尝试主URL → 备用URL
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

  // 筛选需要请求的新闻源
  const sourcesToFetch = category 
    ? NEWS_SOURCES.filter(source => source.category === category)
    : NEWS_SOURCES;

  for (const source of sourcesToFetch) {
    try {
      const { items } = await fetchHtmlWithRetry(source);

      if (items.length > 0) {
        const newsItems = items.map((item: any, index: number): NewsItem => ({
          id: `html-${source.name}-${Date.now()}-${index}`,
          title: item.title,
          content: item.description,
          source: source.name,
          publishTime: item.pubDate,
          category: source.category,
          summary: item.description.substring(0, 100) + (item.description.length > 100 ? '...' : ''),
          link: item.link
        }));

        allNews.push(...newsItems);
        console.log(`成功从 ${source.name} 获取 ${newsItems.length} 条新闻`);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`处理 ${source.name} 失败:`, errorMsg);
      failedSources.push(source.name);
      continue;
    }
  }

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
// 在文件末尾添加以下代码
export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  // 尝试从所有新闻源中查找匹配的新闻
  // 1. 先检查是否是模拟新闻ID
  const mockNews = getMockNews();
  const mockItem = mockNews.find(item => item.id === id);
  if (mockItem) {
    return mockItem;
  }

  // 2. 检查是否是真实抓取的新闻（通过API获取所有新闻后筛选）
  try {
    const { news } = await fetchNews(); // 获取所有新闻
    return news.find(item => item.id === id);
  } catch (error) {
    console.error('获取新闻详情失败:', error);
    return undefined;
  }
}