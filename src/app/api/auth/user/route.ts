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
  if (!userId) return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });

    const [rows] = await pool.execute('SELECT id, email, name, avatar, preferences, joinDate, lastLogin FROM users WHERE id = ?', [userId]);
    // @ts-ignore
  if ((rows as any[]).length === 0) return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });

    // @ts-ignore
    const r = (rows as any[])[0];
    const user = {
      id: r.id,
      email: r.email,
      name: r.name,
      avatar: r.avatar,
      preferences: r.preferences ? JSON.parse(r.preferences) : { darkMode: false, subscriptions: [] },
      joinDate: r.joinDate,
      lastLogin: r.lastLogin
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
  console.error('获取用户信息失败:', error);
  return NextResponse.json({ success: false, message: '内部错误' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });

    const body = await request.json();
    const fields: string[] = [];
    const values: any[] = [];

    if (body.name) { fields.push('name = ?'); values.push(body.name); }
    if (body.email) { fields.push('email = ?'); values.push(body.email); }
    if (body.avatar) { fields.push('avatar = ?'); values.push(body.avatar); }
    if (body.preferences) { fields.push('preferences = ?'); values.push(JSON.stringify(body.preferences)); }

    if (fields.length === 0) {
  return NextResponse.json({ success: false, message: '没有要更新的字段' }, { status: 400 });
    }

    values.push(userId);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await pool.execute(sql, values);

    const [rows] = await pool.execute('SELECT id, email, name, avatar, preferences, joinDate, lastLogin FROM users WHERE id = ?', [userId]);
    // @ts-ignore
    const r = (rows as any[])[0];
    const user = {
      id: r.id,
      email: r.email,
      name: r.name,
      avatar: r.avatar,
      preferences: r.preferences ? JSON.parse(r.preferences) : { darkMode: false, subscriptions: [] },
      joinDate: r.joinDate,
      lastLogin: r.lastLogin
    };

    return NextResponse.json({ success: true, user });
  } catch (error) {
  console.error('更新用户信息失败:', error);
  return NextResponse.json({ success: false, message: '更新失败' }, { status: 500 });
  }
}
