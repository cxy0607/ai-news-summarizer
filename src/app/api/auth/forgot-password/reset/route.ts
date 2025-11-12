import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { decrypt } from '@/lib/crypto';
// 假设你有用户模型和数据库操作（需替换为你的实际逻辑）
import { getUserByEmail, updateUserPassword } from '@/lib/user-service';

// 密码强度校验：8位以上，包含字母+数字
const passwordSchema = z
  .string()
  .min(8, '密码至少8位字符')
  .refine(
    (password) => /^(?=.*[A-Za-z])(?=.*\d).+$/.test(password),
    '密码必须包含字母和数字'
  );

// 表单校验Schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, '缺少验证token'),
  newPassword: passwordSchema,
  confirmPassword: passwordSchema,
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  { message: '两次输入的密码不一致' }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. 校验输入
    const validatedData = resetPasswordSchema.parse(body);
    const { token, newPassword } = validatedData;

    // 2. 解密token，获取邮箱
    const email = decrypt(token);
    if (!email) {
      return NextResponse.json(
        { success: false, message: '验证token无效' },
        { status: 400 }
      );
    }

    // 3. 检查用户是否存在
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    // 4. 加密新密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. 更新数据库密码（替换为你的实际数据库操作）
    await updateUserPassword(user.id, hashedPassword);

    return NextResponse.json({
      success: true,
      message: '密码重置成功，请使用新密码登录',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = (error as any).issues?.[0]?.message || String(error);
      return NextResponse.json(
        { success: false, message: msg },
        { status: 400 }
      );
    }

    console.error('重置密码失败：', error);
    return NextResponse.json(
      { success: false, message: (error as Error).message || '重置密码失败，请重试' },
      { status: 500 }
    );
  }
}