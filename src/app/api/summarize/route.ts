import { NextRequest, NextResponse } from 'next/server';
import { generateAISummary } from '@/lib/ai-service';

// 限流配置
const RATE_LIMIT_WINDOW = 60 * 1000; // 1分钟
const MAX_REQUESTS_PER_WINDOW = 10; // 每分钟最多10次请求
const requestCache = new Map<string, number[]>();

// 检查限流
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

export async function POST(request: NextRequest) {
  try {
    // 获取客户端IP作为限流标识（修正部分）
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // 检查限流
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      );
    }
    
    const { content } = await request.json();
    
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的新闻内容' },
        { status: 400 }
      );
    }
    
    const summary = await generateAISummary(content);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('摘要生成API错误:', error);
    return NextResponse.json(
      { error: '生成摘要时发生错误' },
      { status: 500 }
    );
  }
}