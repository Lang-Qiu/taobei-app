const request = require('supertest');
const app = require('../../src/app');
const database = require('../../src/database');

describe('Auth Routes', () => {
  beforeAll(async () => {
    // 使用测试数据库
    process.env.NODE_ENV = 'test';
    await database.connect('./test.db');
  });

  afterAll(async () => {
    database.close();
  });

  beforeEach(async () => {
    // 清理测试数据
    try {
      database.db.run('DELETE FROM users');
      database.db.run('DELETE FROM verification_codes');
    } catch (error) {
      console.error('清理测试数据失败:', error);
    }
  });

  describe('POST /api/auth/send-verification-code', () => {
    describe('API-POST-SendVerificationCode acceptanceCriteria', () => {
      test('应该验证手机号格式（11位数字，1开头）', async () => {
        const response = await request(app)
          .post('/api/auth/send-verification-code')
          .send({ phoneNumber: '123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('请输入正确的手机号码');
      });

      test('应该为有效手机号生成6位随机数字验证码', async () => {
        const response = await request(app)
          .post('/api/auth/send-verification-code')
          .send({ phoneNumber: '13812345678' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('验证码已发送');
        expect(response.body.expiresIn).toBe(60);
      });

      test('应该将验证码保存到数据库，有效期60秒', async () => {
        await request(app)
          .post('/api/auth/send-verification-code')
          .send({ phoneNumber: '13812345678' });

        // 验证数据库中是否保存了验证码
        const stmt = database.db.prepare('SELECT * FROM verification_codes WHERE phone = ?');
        stmt.bind(['13812345678']);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();

        expect(results.length).toBe(1);
        expect(results[0].phone).toBe('13812345678');
        expect(results[0].code).toMatch(/^\d{6}$/); // 6位数字
      });

      test('应该实现频率限制，同一手机号60秒内只能请求一次', async () => {
        // 第一次请求
        const response1 = await request(app)
          .post('/api/auth/send-verification-code')
          .send({ phoneNumber: '13812345678' });
        expect(response1.status).toBe(200);

        // 立即第二次请求
        const response2 = await request(app)
          .post('/api/auth/send-verification-code')
          .send({ phoneNumber: '13812345678' });
        expect(response2.status).toBe(429);
        expect(response2.body.error).toBe('请求过于频繁，请稍后再试');
      });
    });
  });

  describe('POST /api/auth/login', () => {
    describe('API-POST-Login acceptanceCriteria', () => {
      beforeEach(async () => {
        try {
          // 创建测试用户
          database.db.run('INSERT INTO users (phone) VALUES (?)', ['13812345678']);
          
          // 创建有效验证码
          const expiresAt = new Date(Date.now() + 60000).toISOString();
          database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13812345678', '123456', expiresAt]);
        } catch (error) {
          console.error('创建测试数据失败:', error);
        }
      });

      test('应该验证手机号格式', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ phoneNumber: '123', verificationCode: '123456' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('请输入正确的手机号码');
      });

      test('应该检查手机号是否已注册', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ phoneNumber: '13987654321', verificationCode: '123456' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('该手机号未注册，请先完成注册');
      });

      test('应该验证验证码的正确性', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ phoneNumber: '13812345678', verificationCode: '654321' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('验证码错误');
      });

      test('应该验证验证码的有效性（过期检查）', async () => {
        // 创建过期验证码
        const expiredTime = new Date(Date.now() - 1000).toISOString();
        await database.db.run(
          'UPDATE verification_codes SET expires_at = ? WHERE phone = ?',
          [expiredTime, '13812345678']
        );

        const response = await request(app)
          .post('/api/auth/login')
          .send({ phoneNumber: '13812345678', verificationCode: '123456' });

        expect(response.status).toBe(410);
        expect(response.body.error).toBe('验证码已过期');
      });

      test('登录成功后应该生成JWT token', async () => {
        const response = await request(app)
          .post('/api/auth/login')
          .send({ phoneNumber: '13812345678', verificationCode: '123456' });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('登录成功');
        expect(response.body.userId).toBeDefined();
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
      });
    });
  });
});