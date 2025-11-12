import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_news_summary',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// 测试数据库连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('数据库连接成功');
    connection.release();
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

// 初始化必要的表
async function initTables() {
  // 用户表
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      avatar VARCHAR(255),
      preferences JSON,
      joinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastLogin DATETIME
    )
  `;

  // 收藏表
  const createFavoritesTable = `
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      newsId VARCHAR(255) NOT NULL,
      newsData JSON NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_user_news (userId, newsId),
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // 阅读历史表
  const createHistoryTable = `
    CREATE TABLE IF NOT EXISTS readingHistory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      newsId VARCHAR(255) NOT NULL,
      newsData JSON NOT NULL,
      accessedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    )
  `;

  // 密码重置表
  const createPasswordResetsTable = `
    CREATE TABLE IF NOT EXISTS password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId VARCHAR(255) NOT NULL,
      token VARCHAR(255) NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE KEY unique_token (token)
    )
  `;

  try {
    await pool.execute(createUsersTable);
    await pool.execute(createFavoritesTable);
    await pool.execute(createHistoryTable);
    await pool.execute(createPasswordResetsTable);
    console.log('数据库表初始化成功');
  } catch (error) {
    console.error('数据库表初始化失败:', error);
  }
}

// 初始化数据库
testConnection();
initTables();

export default pool;