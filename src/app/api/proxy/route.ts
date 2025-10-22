// src/app/api/proxy/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const isHtml = searchParams.get('isHtml') === 'true';
    
    if (!targetUrl) {
      return NextResponse.json({ error: '缺少目标URL' }, { status: 400 });
    }

    // 验证URL安全性
    const urlObj = new URL(targetUrl);
    const allowedDomains = [
      'www.stdaily.com',
      'www.news.cn', 
      'www.cenews.com.cn',
      'news.yiche.com'
    ];
    
    if (!allowedDomains.includes(urlObj.hostname)) {
      return NextResponse.json({ error: '不允许的域名' }, { status: 403 });
    }

    // 定义超时时间（10秒）
    const TIMEOUT_MS = 10000;
    
    // 创建超时Promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error(`请求超时（${TIMEOUT_MS}ms）`));
      }, TIMEOUT_MS);
    });

    // 使用Promise.race实现超时控制
    const response = await Promise.race([
      fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': isHtml ? 'text/html,application/xhtml+xml' : 'application/xml, */*',
          'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Referer': urlObj.origin + '/',
        },
        // 注意：这里不要添加 retry 配置，因为原生 fetch 不支持
      }),
      timeoutPromise
    ]);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const content = await response.text();
    return new NextResponse(content, {
      headers: {
        'Content-Type': isHtml ? 'text/html; charset=utf-8' : 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      status: response.status
    });

  } catch (error) {
    console.error('代理请求失败:', error);
    return NextResponse.json({ 
      error: '代理请求失败', 
      details: error instanceof Error ? error.message : '未知错误'
    }, { status: 500 });
  }
}