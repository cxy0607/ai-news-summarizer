import { NextResponse } from 'next/server';
import { generateAISummary } from '@/lib/ai-service';

// 简单的速率限制实现
const rateLimits = new Map<string, { count: number; lastReset: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1分钟
  const maxRequests = 5; // 每分钟最多5次请求

  const entry = rateLimits.get(identifier) || { count: 0, lastReset: now };
  
  // 如果超过时间窗口，重置计数
  if (now - entry.lastReset > windowMs) {
    entry.count = 1;
    entry.lastReset = now;
    rateLimits.set(identifier, entry);
    return true;
  }
  
  // 检查是否超过请求限制
  if (entry.count < maxRequests) {
    entry.count++;
    rateLimits.set(identifier, entry);
    return true;
  }
  
  return false;
}

export async function POST(request: Request) {
  try {
    const { newsContent } = await request.json();
    
    if (!newsContent) {
      return NextResponse.json(
        { error: '缺少新闻内容' },
        { status: 400 }
      );
    }
    
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