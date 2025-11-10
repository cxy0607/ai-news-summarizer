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

    const [rows] = await pool.execute('SELECT newsId, newsData, createdAt FROM favorites WHERE userId = ? ORDER BY createdAt DESC', [userId]);
    // @ts-ignore
    const items = (rows as any[]).map(r => ({ newsId: r.newsId, newsData: JSON.parse(r.newsData), createdAt: r.createdAt }));
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('获取收藏失败:', error);
    return NextResponse.json({ success: false, error: '获取收藏失败' }, { status: 500 });
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
      await pool.execute('INSERT INTO favorites (userId, newsId, newsData) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE newsData = VALUES(newsData)', [userId, newsId, JSON.stringify(newsData)]);
    } catch (e) {
      // 如果存在唯一约束冲突也可忽略
      console.warn('插入收藏可能已存在:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('添加收藏失败:', error);
    return NextResponse.json({ success: false, error: '添加收藏失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
    if (!userId) return NextResponse.json({ success: false, error: '未登录' }, { status: 401 });

    const body = await request.json();
    const { newsId } = body;
    if (!newsId) return NextResponse.json({ success: false, error: '缺少 newsId' }, { status: 400 });

    await pool.execute('DELETE FROM favorites WHERE userId = ? AND newsId = ?', [userId, newsId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除收藏失败:', error);
    return NextResponse.json({ success: false, error: '删除收藏失败' }, { status: 500 });
  }
}
