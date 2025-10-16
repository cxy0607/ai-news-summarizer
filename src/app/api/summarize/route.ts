import { NextRequest, NextResponse } from 'next/server';
import { generateAISummary } from '@/lib/ai-service';

// 定义请求体类型
interface SummarizeRequest {
  newsContent: string;
}

// 限制请求频率的简单内存缓存
const requestCache = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1分钟
const MAX_REQUESTS_PER_WINDOW = 10; // 每分钟最多10次请求

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
    // 获取客户端IP作为频率限制标识
const identifier =
  request.headers.get('x-forwarded-for') ||
  request.headers.get('x-real-ip') ||
  'unknown';
    
    // 检查频率限制
    if (!checkRateLimit(identifier)) {
      return NextResponse.json(
        { 
          error: '请求过于频繁，请稍后重试',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    const body: SummarizeRequest = await request.json();
    
    // 验证请求体
    if (!body.newsContent || body.newsContent.trim().length === 0) {
      return NextResponse.json(
        { error: '新闻内容不能为空' },
        { status: 400 }
      );
    }

    if (body.newsContent.length > 10000) {
      return NextResponse.json(
        { error: '新闻内容过长，请控制在10000字符以内' },
        { status: 400 }
      );
    }

    console.log('开始生成AI摘要，内容长度:', body.newsContent.length);
    
    // 调用AI服务生成摘要
    const startTime = Date.now();
    const aiSummary = await generateAISummary(body.newsContent);
    const processingTime = Date.now() - startTime;
    
    console.log(`AI摘要生成完成，耗时: ${processingTime}ms`);

    // 如果AI返回错误
    if (aiSummary.error) {
      return NextResponse.json(
        { 
          error: aiSummary.error,
          code: 'AI_SERVICE_ERROR'
        },
        { status: 500 }
      );
    }

    // 返回成功响应
    return NextResponse.json({
      success: true,
      data: aiSummary,
      processingTime: `${processingTime}ms`,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('API处理错误:', error);
    
    return NextResponse.json(
      { 
        error: '服务器内部错误',
        code: 'INTERNAL_SERVER_ERROR',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}

// 添加OPTIONS方法处理CORS预检请求
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}