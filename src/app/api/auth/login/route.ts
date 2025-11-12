import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ success: false, error: '缺少邮箱或密码' }, { status: 400 });
    }

    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    // @ts-ignore
    if ((rows as any[]).length === 0) {
      return NextResponse.json({ success: false, message: '用户不存在' }, { status: 404 });
    }

    // @ts-ignore
    const userRow = (rows as any[])[0];
    const match = await bcrypt.compare(password, userRow.password);
    if (!match) {
      return NextResponse.json({ success: false, message: '密码错误' }, { status: 401 });
    }

    const user = {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      avatar: userRow.avatar,
      preferences: userRow.preferences ? JSON.parse(userRow.preferences) : { darkMode: false, subscriptions: [] }
    };

    const res = NextResponse.json({ success: true, user });
    // Set cookie with explicit sameSite and secure options for reliability
    res.cookies.set('userId', user.id, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    });
    return res;
  } catch (error) {
    console.error('登录出错:', error);
    return NextResponse.json({ success: false, message: '登录失败' }, { status: 500 });
  }
}
