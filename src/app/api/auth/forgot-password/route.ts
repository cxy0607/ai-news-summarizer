import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;
    if (!email) return NextResponse.json({ success: false, error: '缺少邮箱' }, { status: 400 });

    const [rows] = await pool.execute('SELECT id, email FROM users WHERE email = ?', [email]);
    // @ts-ignore
    if ((rows as any[]).length === 0) {
      // 不暴露用户不存在的信息，返回成功以防止枚举
      return NextResponse.json({ success: true });
    }

    // @ts-ignore
    const user = (rows as any[])[0];
    const token = randomBytes(24).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60).toISOString().slice(0, 19).replace('T', ' '); // 1小时

    await pool.execute('INSERT INTO password_resets (userId, token, expiresAt) VALUES (?, ?, ?)', [user.id, token, expiresAt]);

    // TODO: 实际项目中，这里应发送邮件给用户，包含重置链接。例如：
    // const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    // await sendEmail(user.email, '重置密码', `请点击链接重置密码：${resetUrl}`);

    // 为了方便开发，返回重置链接
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    return NextResponse.json({ success: true, resetUrl });
  } catch (error) {
    console.error('生成重置token失败:', error);
    return NextResponse.json({ success: false, error: '生成失败' }, { status: 500 });
  }
}
