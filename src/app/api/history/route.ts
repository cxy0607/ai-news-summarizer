import { NextResponse } from 'next/server';
import pool from '@/lib/db';

function getUserIdFromRequest(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )userId=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });

    const [rows] = await pool.execute('SELECT newsId, newsData, accessedAt FROM readingHistory WHERE userId = ? ORDER BY accessedAt DESC LIMIT 200', [userId]);
    // @ts-ignore
    const items = (rows as any[]).map(r => ({ newsId: r.newsId, newsData: JSON.parse(r.newsData), accessedAt: r.accessedAt }));
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('获取历史失败:', error);
    return NextResponse.json({ success: false, error: '获取历史失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });

    const body = await request.json();
    const { newsId, newsData } = body;
    if (!newsId || !newsData) return NextResponse.json({ success: false, error: '缺少字段' }, { status: 400 });

    try {
      await pool.execute('INSERT INTO readingHistory (userId, newsId, newsData) VALUES (?, ?, ?)', [userId, newsId, JSON.stringify(newsData)]);
    } catch (e) {
      console.warn('插入历史失败:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('添加历史失败:', error);
    return NextResponse.json({ success: false, error: '添加历史失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });

    await pool.execute('DELETE FROM readingHistory WHERE userId = ?', [userId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('清空历史失败:', error);
    return NextResponse.json({ success: false, error: '清空历史失败' }, { status: 500 });
  }
}
