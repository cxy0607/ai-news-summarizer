import nodemailer from 'nodemailer';

// 配置邮件 transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * 发送忘记密码验证码邮件
 * @param to 目标邮箱
 * @param code 验证码（6位数字）
 */
export async function sendResetPasswordEmail(to: string, code: string) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const mailOptions = {
      from: `"AI新闻摘要" <${process.env.EMAIL_FROM}>`,
      to,
      subject: '密码重置验证码',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #333; font-size: 18px; margin-bottom: 20px;">密码重置验证</h2>
          <p style="color: #666; line-height: 1.6;">你正在申请重置密码，请使用以下验证码完成操作：</p>
          <div style="margin: 20px 0; padding: 15px; background: #f5fafe; border-radius: 4px; text-align: center;">
            <span style="font-size: 24px; font-weight: bold; color: #2d7ff9;">${code}</span>
          </div>
          <p style="color: #666; line-height: 1.6;">验证码有效期为15分钟，请勿泄露给他人。</p>
          <p style="color: #999; font-size: 14px; margin-top: 30px;">如果不是你本人操作，请忽略此邮件。</p>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            此邮件由系统自动发送，请勿回复。
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`验证码邮件已发送至：${to}`);
    return true;
  } catch (error) {
    console.error('发送邮件失败：', error);
    throw new Error('邮件发送失败，请检查邮箱是否正确');
  }
}