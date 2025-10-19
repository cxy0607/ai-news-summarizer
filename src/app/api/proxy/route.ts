import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');
    const isHtml = searchParams.get('isHtml') === 'true';
    
    if (!targetUrl) {
      return NextResponse.json({ error: '缺少目标URL' }, { status: 400 });
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
      fetch(targetUrl, {  // 移除 timeout 属性
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          'Accept': isHtml ? 'text/html,application/xhtml+xml' : 'application/xml, */*',
          'Referer': new URL(targetUrl).origin + '/',
        },
        // 移除 timeout: 10000 这一行
      }),
      timeoutPromise
    ]);

    const content = await response.text();
    return new NextResponse(content, {
      headers: {
        'Content-Type': isHtml ? 'text/html' : response.headers.get('Content-Type') || 'application/xml',
        'Cache-Control': 'public, s-maxage=300',
      },
      status: response.status
    });

  } catch (error) {
    console.error('代理请求失败:', error);
    return NextResponse.json({ error: '代理请求失败' }, { status: 500 });
  }
}