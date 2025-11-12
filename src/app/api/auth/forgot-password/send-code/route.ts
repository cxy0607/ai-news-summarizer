import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod'; // 修复：明确导入 ZodError
import { sendResetPasswordEmail } from '@/lib/email';
import { generateCode, checkSendFrequency, storeCode } from '@/lib/code';

// 表单校验Schema
const sendCodeSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. 校验输入
    const validatedData = sendCodeSchema.parse(body);
    const { email } = validatedData;

    // 2. 检查发送频率
    const frequencyCheck = checkSendFrequency(email);
    if (!frequencyCheck.valid) {
      return NextResponse.json(
        { success: false, message: frequencyCheck.message },
        { status: 400 }
      );
    }

    // 3. 生成验证码
    const code = generateCode();

    // 4. 存储验证码记录
    storeCode(email, code);

    // 5. 发送邮件
    await sendResetPasswordEmail(email, code);

    return NextResponse.json({
      success: true,
      message: '验证码已发送至你的邮箱，请在15分钟内完成验证',
    });
  } catch (error) {
    if (error instanceof ZodError) {
      const msg = (error as any).issues?.[0]?.message || String(error);
      return NextResponse.json(
        { success: false, message: msg },
        { status: 400 }
      );
    }

    console.error('发送验证码失败：', error);
    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}