// src/app/api/proxy/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const isHtml = searchParams.get('isHtml') === 'true';

  if (!targetUrl) {
    return NextResponse.json({ error: '缺少 url 参数' }, { status: 400 });
  }

  try {
    const headers: HeadersInit = {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
      Accept: isHtml
        ? 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        : 'application/rss+xml,application/xml,text/xml',
      Referer: new URL(targetUrl).origin,
    };

    const response = (await fetch(targetUrl, { headers })) as Response;

    if (!response.ok) {
      return NextResponse.json(
        { error: `目标服务器返回 ${response.status}` },
        { status: response.status }
      );
    }

    const text = await response.text();
    return new NextResponse(text, {
      status: 200,
      headers: {
        'Content-Type': isHtml ? 'text/html; charset=utf-8' : 'application/xml',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: '代理请求异常', detail: err.message }, { status: 500 });
  }
}