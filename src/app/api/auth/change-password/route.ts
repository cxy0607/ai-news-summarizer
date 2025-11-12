import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

function getUserIdFromRequest(request: Request) {
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|; )userId=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export async function POST(request: Request) {
  try {
    const userId = getUserIdFromRequest(request);
  if (!userId) return NextResponse.json({ success: false, message: '未登录' }, { status: 401 });

    const body = await request.json();
    const { currentPassword, newPassword } = body;
  if (!currentPassword || !newPassword) return NextResponse.json({ success: false, message: '缺少字段' }, { status: 400 });

    const [rows] = await pool.execute('SELECT password FROM users WHERE id = ?', [userId]);
    // @ts-ignore
  if ((rows as any[]).length === 0) return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });

    // @ts-ignore
    const r = (rows as any[])[0];
    const match = await bcrypt.compare(currentPassword, r.password);
  if (!match) return NextResponse.json({ success: false, message: '当前密码错误' }, { status: 401 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

    return NextResponse.json({ success: true });
  } catch (error) {
  console.error('修改密码失败:', error);
  return NextResponse.json({ success: false, message: '修改失败' }, { status: 500 });
  }
}
