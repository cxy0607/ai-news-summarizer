import { NextResponse } from 'next/server';
import { fetchNews } from '@/lib/rss-service';
import { NewsItem } from '@/types/news';

const rateLimits = new Map<string, { count: number; lastReset: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 10;

  const entry = rateLimits.get(identifier) || { count: 0, lastReset: now };
  
  if (now - entry.lastReset > windowMs) {
    entry.count = 1;
    entry.lastReset = now;
    rateLimits.set(identifier, entry);
    return true;
  }
  
  if (entry.count < maxRequests) {
    entry.count++;
    rateLimits.set(identifier, entry);
    return true;
  }
  
  return false;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // 关键修复：从URL参数解析category并定义变量
    const category = searchParams.get('category') || undefined; // 定义category变量
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '6', 10);

    const identifier = request.headers.get('x-forwarded-for') || 'unknown';
    
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { success: false, error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }
    
    // 现在可以正确使用category变量了
    const result = await fetchNews(category, page, pageSize);
    const news = result.news;
    
    let filteredNews: NewsItem[] = news;
    if (category && category !== '全部') {
      filteredNews = filteredNews.filter(item => item.category === category);
    }
    
    filteredNews.sort((a, b) => 
      new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime()
    );
    
    const startIndex = (page - 1) * pageSize;
    const paginatedNews = filteredNews.slice(startIndex, startIndex + pageSize);
    
    return NextResponse.json({
      success: true,
      data: paginatedNews,
      pagination: {
        total: filteredNews.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredNews.length / pageSize)
      },
      failedSources: result.failedSources
    });
  } catch (error) {
    console.error('获取新闻接口错误:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '服务器内部错误' 
      },
      { status: 500 }
    );
  }
}