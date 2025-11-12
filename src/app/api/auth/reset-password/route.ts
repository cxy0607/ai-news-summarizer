import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, newPassword } = body;
    if (!token || !newPassword) return NextResponse.json({ success: false, error: '缺少字段' }, { status: 400 });

    // 查找token
    const [rows] = await pool.execute('SELECT id, userId, expiresAt FROM password_resets WHERE token = ?', [token]);
    // @ts-ignore
    if ((rows as any[]).length === 0) return NextResponse.json({ success: false, error: '无效的或已过期的 token' }, { status: 400 });

    // @ts-ignore
    const pr = (rows as any[])[0];
    const expiresAt = new Date(pr.expiresAt).getTime();
    if (Date.now() > expiresAt) {
      // 删除过期token
      await pool.execute('DELETE FROM password_resets WHERE id = ?', [pr.id]);
      return NextResponse.json({ success: false, error: 'token 已过期' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.execute('UPDATE users SET password = ? WHERE id = ?', [hashed, pr.userId]);

    // 删除token
    await pool.execute('DELETE FROM password_resets WHERE id = ?', [pr.id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('重置密码失败:', error);
    return NextResponse.json({ success: false, error: '重置失败' }, { status: 500 });
  }
}
