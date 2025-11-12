import { NextResponse } from 'next/server';
import { verifyCode } from '@/lib/code';
import { encrypt } from '@/lib/crypto';
import { z, ZodError } from 'zod'; // 明确导入 ZodError 类型

// 表单校验Schema
const verifyCodeSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  code: z.string().length(6, '验证码必须为6位数字'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. 校验输入
    const validatedData = verifyCodeSchema.parse(body);
    const { email, code } = validatedData;

    // 2. 验证验证码
    const codeVerify = verifyCode(email, code);
    if (!codeVerify.valid) {
      return NextResponse.json(
        { success: false, message: codeVerify.message },
        { status: 400 }
      );
    }

    // 3. 生成临时token（用于后续重置密码校验，有效期15分钟）
    const token = encrypt(email);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    return NextResponse.json({
      success: true,
      message: '验证码验证通过',
      data: { token, expiresAt }, // 返回token给前端，重置密码时携带
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const msg = (error as any).issues?.[0]?.message || String(error);
      return NextResponse.json(
        { success: false, message: msg },
        { status: 400 }
      );
    }

    console.error('验证验证码失败：', error);
    return NextResponse.json(
      { success: false, message: '验证失败，请重试' },
      { status: 500 }
    );
  }
}