import { addMinutes, isAfter } from 'date-fns';

// 内存存储验证码记录（生产环境建议用Redis）
const codeStore: {
  [email: string]: {
    code: string;
    expiresAt: Date;
    sendCount: number;
    lastSendAt: Date;
  };
} = {};

// 配置
const CODE_EXPIRE_MINUTES = 15; // 验证码有效期15分钟
const DAILY_SEND_LIMIT = 5; // 单日发送次数限制
const SEND_INTERVAL_MINUTES = 1; // 两次发送间隔1分钟

/**
 * 生成6位随机验证码
 */
export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 检查邮箱发送频率是否合规
 * @param email 用户邮箱
 */
export function checkSendFrequency(email: string): { valid: boolean; message: string } {
  const record = codeStore[email];
  const now = new Date();

  // 检查单日发送次数
  if (record && record.sendCount >= DAILY_SEND_LIMIT) {
    // 检查是否跨天（重置发送次数）
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (isAfter(record.lastSendAt, todayStart)) {
      return { valid: false, message: '单日发送验证码次数已达上限，请明天再试' };
    } else {
      // 跨天重置记录
      codeStore[email] = { ...record, sendCount: 0, lastSendAt: now };
    }
  }

  // 检查发送间隔
  if (record && isAfter(now, addMinutes(record.lastSendAt, SEND_INTERVAL_MINUTES))) {
    return { valid: false, message: '发送过于频繁，请1分钟后再试' };
  }

  return { valid: true, message: '' };
}

/**
 * 存储验证码记录
 * @param email 用户邮箱
 * @param code 验证码
 */
export function storeCode(email: string, code: string) {
  const now = new Date();
  const record = codeStore[email] || {
    code: '',
    expiresAt: now,
    sendCount: 0,
    lastSendAt: new Date(0),
  };

  codeStore[email] = {
    code,
    expiresAt: addMinutes(now, CODE_EXPIRE_MINUTES),
    sendCount: record.sendCount + 1,
    lastSendAt: now,
  };
}

/**
 * 验证验证码是否有效
 * @param email 用户邮箱
 * @param inputCode 用户输入的验证码
 */
export function verifyCode(email: string, inputCode: string): { valid: boolean; message: string } {
  const record = codeStore[email];
  const now = new Date();

  if (!record) {
    return { valid: false, message: '验证码未发送，请先获取验证码' };
  }

  if (isAfter(now, record.expiresAt)) {
    delete codeStore[email]; // 过期删除记录
    return { valid: false, message: '验证码已过期，请重新获取' };
  }

  if (record.code !== inputCode) {
    return { valid: false, message: '验证码错误，请重新输入' };
  }

  // 验证通过，删除记录（防止重复使用）
  delete codeStore[email];
  return { valid: true, message: '' };
}