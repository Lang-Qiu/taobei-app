const request = require('supertest');
const express = require('express');
const authRoutes = require('../../src/routes/auth');
const database = require('../../src/database');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('API-POST-Register', () => {
  beforeAll(async () => {
    await database.connect('./test.db');
  });

  afterAll(async () => {
    database.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    await database.db.run('DELETE FROM users');
    await database.db.run('DELETE FROM verification_codes');
  });

  describe('手机号格式校验', () => {
    it('应该拒绝无效的手机号格式', async () => {
      const invalidPhones = [
        '',
        '123',
        '22345678901',  // 11位但不是1开头
        '2234567890',   // 不是1开头
        '1234567890a',  // 包含字母
        '1234567890',   // 10位
        '123456789012', // 12位
      ];

      for (const phone of invalidPhones) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            phone,
            code: '123456',
            agreeToTerms: true
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('手机号');
      }
    });

    it('应该接受有效的手机号格式', async () => {
      // 先插入有效验证码
      const phone = '13800138000';
      const code = '123456';
      const expiresAt = new Date(Date.now() + 60000).toISOString();
      await database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', [phone, code, expiresAt]);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone,
          code,
          agreeToTerms: true
        });

      // 应该成功注册
      expect(response.status).toBe(201);
      expect(response.body.message).toBe('注册成功');
      expect(response.body.userId).toBeDefined();
      expect(response.body.token).toBeDefined();
    });
  });

  describe('验证码校验', () => {
    beforeEach(async () => {
      // 插入有效验证码
      const expiresAt = new Date(Date.now() + 60000).toISOString();
      await database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13800138000', '123456', expiresAt]);
    });

    it('应该拒绝无效的验证码格式', async () => {
      const invalidCodes = [
        '',
        '123',      // 少于6位
        '1234567',  // 多于6位
        '12345a',   // 包含字母
        'abcdef',   // 全字母
      ];

      for (const code of invalidCodes) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            phone: '13800138000',
            code,
            agreeToTerms: true
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('验证码');
      }
    });

    it('应该拒绝错误的验证码', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '654321', // 错误的验证码
          agreeToTerms: true
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('验证码');
    });

    it('应该拒绝过期的验证码', async () => {
      // 更新验证码为过期状态
      const expiredTime = new Date(Date.now() - 1000).toISOString();
      await database.db.run('UPDATE verification_codes SET expires_at = ? WHERE phone = ?', [expiredTime, '13800138000']);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(410);
      expect(response.body.error).toContain('过期');
    });
  });

  describe('协议同意校验', () => {
    beforeEach(async () => {
      // 插入有效验证码
      const expiresAt = new Date(Date.now() + 60000).toISOString();
      await database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13800138000', '123456', expiresAt]);
    });

    it('应该拒绝未同意协议的注册请求', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '123456',
          agreeToTerms: false
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('协议');
    });

    it('应该拒绝缺少协议同意字段的请求', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '123456'
          // 缺少 agreeToTerms 字段
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('协议');
    });
  });

  describe('检查用户是否已存在', () => {
    beforeEach(async () => {
      // 插入有效验证码
      const expiresAt = new Date(Date.now() + 60000).toISOString();
      await database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13800138000', '123456', expiresAt]);
    });

    it('应该拒绝已注册的手机号', async () => {
      // 先插入一个已存在的用户
      await database.db.run('INSERT INTO users (phone) VALUES (?)', ['13800138000']);

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(409);
      expect(response.body.error).toContain('已注册');
    });
  });

  describe('创建新用户并返回信息', () => {
    beforeEach(async () => {
      // 插入有效验证码
      const expiresAt = new Date(Date.now() + 60000).toISOString();
      await database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13800138000', '123456', expiresAt]);
    });

    it('应该成功创建新用户并返回用户信息和JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', '注册成功');
      expect(response.body).toHaveProperty('userId');
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });

    it('应该在数据库中创建新用户记录', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(201);

      // 验证用户确实被创建到数据库中
      const user = await database.findUserByPhone('13800138000');
      expect(user).toBeDefined();
      expect(user.phone).toBe('13800138000');
      expect(user.id).toBe(response.body.userId);
    });

    it('应该在注册成功后删除验证码', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          phone: '13800138000',
          code: '123456',
          agreeToTerms: true
        });

      expect(response.status).toBe(201);

      // 验证验证码已被删除
      const stmt = database.db.prepare('SELECT * FROM verification_codes WHERE phone = ?');
      stmt.bind(['13800138000']);
      const hasResult = stmt.step();
      stmt.free();

      expect(hasResult).toBe(false);
    });
  });
});