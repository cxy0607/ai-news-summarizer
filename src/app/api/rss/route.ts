// ai-news-summarizer/src/app/api/summarize/route.ts
import { NextResponse } from 'next/server';
import { generateAISummary } from '@/lib/ai-service';

// 补充缺失的常量和缓存对象
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟
const MAX_REQUESTS_PER_WINDOW = 10;
const requestCache = new Map<string, number[]>();

// 每分钟最多10次请求
function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // 清理过期的记录
  for (const [key, timestamps] of requestCache.entries()) {
    const validTimestamps = timestamps.filter((time: number) => time > windowStart);
    if (validTimestamps.length === 0) {
      requestCache.delete(key);
    } else {
      requestCache.set(key, validTimestamps);
    }
  }
  
  // 检查当前用户的请求频率
  const userRequests = requestCache.get(identifier) || [];
  const recentRequests = userRequests.filter((time: number) => time > windowStart);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  recentRequests.push(now);
  requestCache.set(identifier, recentRequests);
  return true;
}

// 处理POST请求
export async function POST(request: Request) {
  try {
    const { newsContent } = await request.json();
    
    // 获取客户端IP作为标识符
    const identifier = request.headers.get('x-forwarded-for') || 'unknown';
    
    // 检查速率限制
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }
    
    const result = await generateAISummary(newsContent);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('摘要生成接口错误:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '服务器内部错误' },
      { status: 500 }
    );
  }
}