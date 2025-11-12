// src/lib/user-service.ts
import pool from '@/lib/db'; // MySQL 连接池

/**
 * 根据邮箱查询用户（原生 SQL 适配 MySQL）
 */
export async function getUserByEmail(email: string) {
  // MySQL 中使用 ? 作为占位符（防止 SQL 注入）
  const [rows] = await pool.execute(
    'SELECT id, email, password FROM users WHERE email = ? LIMIT 1',
    [email] // 传入参数（自动转义，避免注入）
  );

  // rows 是数组，取第一个元素（用户信息）
  return (rows as any[])[0] || null;
}

/**
 * 更新用户密码（原生 SQL 适配 MySQL）
 * @param userId 用户ID
 * @param hashedPassword 加密后的新密码
 */
export async function updateUserPassword(userId: string, hashedPassword: string) {
  const [result] = await pool.execute(
    'UPDATE users SET password = ?, lastLogin = CURRENT_TIMESTAMP WHERE id = ?',
    [hashedPassword, userId] // 顺序对应 SQL 中的 ?
  );

  // 检查是否更新成功（affectedRows 为受影响的行数）
  return (result as any).affectedRows > 0;
}