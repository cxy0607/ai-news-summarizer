import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;
    if (!email || !password || !name) {
      return NextResponse.json({ success: false, error: '缺少必要字段' }, { status: 400 });
    }

    // 检查是否已存在
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    // @ts-ignore
    if ((rows as any[]).length > 0) {
      return NextResponse.json({ success: false, error: '该邮箱已被注册' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = randomUUID();
    const prefs = JSON.stringify({ darkMode: false, subscriptions: [] });

    await pool.execute(
      'INSERT INTO users (id, email, name, password, avatar, preferences) VALUES (?, ?, ?, ?, ?, ?)',
      [id, email, name, hashed, null, prefs]
    );

    const user = {
      id,
      email,
      name,
      avatar: null,
      preferences: { darkMode: false, subscriptions: [] }
    };

    const res = NextResponse.json({ success: true, user });
    // 设置 cookie（显式 sameSite & secure）
    res.cookies.set('userId', id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    return res;
  } catch (error) {
    console.error('注册出错:', error);
    return NextResponse.json({ success: false, error: '注册失败' }, { status: 500 });
  }
}
