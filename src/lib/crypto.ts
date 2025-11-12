import crypto from 'crypto';

const SECRET = process.env.ENCRYPT_SECRET || '';
if (!SECRET) throw new Error('ENCRYPT_SECRET 环境变量未配置');

/**
 * 加密数据（用于存储验证码）
 */
export function encrypt(data: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(SECRET), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * 解密数据（用于验证验证码）
 */
export function decrypt(encryptedData: string): string {
  try {
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(SECRET), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    throw new Error('验证码无效或已过期');
  }
}