const initSqlJs = require('sql.js');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.SQL = null;
  }

  async connect(dbPath = './database.db') {
    this.SQL = await initSqlJs();
    
    // 如果数据库文件存在，读取它
    let data = null;
    if (fs.existsSync(dbPath)) {
      data = fs.readFileSync(dbPath);
    }
    
    this.db = new this.SQL.Database(data);
    console.log('Connected to SQLite database');
    await this.initTables();
  }

  async initTables() {
    // 创建用户表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        phone TEXT UNIQUE NOT NULL,
        password TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 创建验证码表
    this.db.run(`
      CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 添加测试用户（如果不存在）
    try {
      this.db.run(`
        INSERT OR IGNORE INTO users (phone) VALUES ('13812345678')
      `);
    } catch (error) {
      console.log('Test user already exists or error:', error.message);
    }

    console.log('Database tables initialized');
  }

  // DB-FindUserByPhone: 根据手机号查询用户
  async findUserByPhone(phone) {
    // TODO: 实现根据手机号查询用户的逻辑
    const stmt = this.db.prepare('SELECT * FROM users WHERE phone = ?');
    stmt.bind([phone]);
    if (stmt.step()) {
      const result = stmt.getAsObject();
      stmt.free();
      return result;
    }
    stmt.free();
    return null;
  }

  // DB-SaveVerificationCode: 保存验证码
  async saveVerificationCode(phone, code, expiresAt) {
    try {
      // 先删除该手机号的旧验证码
      this.db.run('DELETE FROM verification_codes WHERE phone = ?', [phone]);
      
      // 插入新验证码
      const expiresAtStr = typeof expiresAt === 'string' ? expiresAt : expiresAt.toISOString();
      this.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', [phone, code, expiresAtStr]);
    } catch (error) {
      console.error('保存验证码失败:', error);
      throw error;
    }
  }

  // DB-VerifyCode: 验证验证码
  async verifyCode(phone, code) {
    try {
      const stmt = this.db.prepare('SELECT * FROM verification_codes WHERE phone = ? AND code = ?');
      stmt.bind([phone, code]);
      
      if (!stmt.step()) {
        stmt.free();
        return { valid: false, reason: 'invalid' };
      }
      
      const result = stmt.getAsObject();
      stmt.free();
      
      // 检查是否过期
      const now = new Date();
      const expiresAt = new Date(result.expires_at);
      
      if (now > expiresAt) {
        // 删除过期验证码
        this.db.run('DELETE FROM verification_codes WHERE id = ?', [result.id]);
        return { valid: false, reason: 'expired' };
      }
      
      // 验证成功，删除验证码
      this.db.run('DELETE FROM verification_codes WHERE id = ?', [result.id]);
      return { valid: true };
    } catch (error) {
      console.error('验证码验证失败:', error);
      return { valid: false, reason: 'error' };
    }
  }

  // DB-CleanExpiredCodes: 清理过期验证码
  async cleanExpiredCodes() {
    // TODO: 实现清理过期验证码的逻辑
    const now = new Date().toISOString();
    this.db.run('DELETE FROM verification_codes WHERE expires_at < ?', [now]);
  }

  // DB-CreateUser: 创建新用户记录
  async createUser(phone, password = null) {
    // 生成唯一的用户ID (UUID)
    const userId = this.generateUUID();
    const createdAt = new Date().toISOString();
    
    // 检查手机号是否已存在
    const existingUser = await this.findUserByPhone(phone);
    if (existingUser) {
      throw new Error('Phone number already exists');
    }
    
    // 创建新用户记录
    try {
      this.db.run(`
        INSERT INTO users (id, phone, password, created_at) 
        VALUES (?, ?, ?, ?)
      `, [userId, phone, password, createdAt]);
      
      // 返回新创建用户的信息
      return {
        id: userId,
        phone: phone,
        password: password,
        created_at: createdAt
      };
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Phone number already exists');
      }
      throw error;
    }
  }

  generateUUID() {
    // 简单的UUID v4生成器
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  close() {
    if (this.db) {
      this.db.close();
      console.log('Database connection closed');
    }
  }
}

module.exports = new DatabaseManager();