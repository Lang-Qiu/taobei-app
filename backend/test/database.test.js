const database = require('../src/database');

describe('Database Operations', () => {
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

  describe('DB-FindUserByPhone', () => {
    test('应该根据手机号查询用户信息', async () => {
      // 插入测试用户
      await database.db.run(
        'INSERT INTO users (phone) VALUES (?)',
        ['13812345678']
      );

      const user = await database.findUserByPhone('13812345678');
      expect(user).toBeDefined();
      expect(user.phone).toBe('13812345678');
    });

    test('用户不存在时应该返回null', async () => {
      const user = await database.findUserByPhone('13987654321');
      expect(user).toBeNull();
    });
  });

  describe('DB-SaveVerificationCode', () => {
    test('应该保存验证码到数据库', async () => {
      const phone = '13812345678';
      const code = '123456';
      const expiresAt = new Date(Date.now() + 60000);

      await database.saveVerificationCode(phone, code, expiresAt);

      // 验证数据库中保存了验证码
        const stmt = database.db.prepare('SELECT * FROM verification_codes WHERE phone = ?');
        stmt.bind([phone]);
        const results = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject());
        }
        stmt.free();

        expect(results.length).toBe(1);
        expect(results[0].phone).toBe(phone);
        expect(results[0].code).toBe(code);
    });

    test('同一手机号的新验证码应该覆盖旧验证码', async () => {
      const phone = '13812345678';
      const expiresAt = new Date(Date.now() + 60000);

      // 保存第一个验证码
      await database.saveVerificationCode(phone, '111111', expiresAt);
      
      // 保存第二个验证码
      await database.saveVerificationCode(phone, '222222', expiresAt);

      // 验证只有最新的验证码存在
      const stmt = database.db.prepare('SELECT * FROM verification_codes WHERE phone = ?');
      stmt.bind([phone]);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();

      expect(results.length).toBe(1);
      expect(results[0].code).toBe('222222');
    });
  });

  describe('DB-VerifyCode', () => {
    beforeEach(async () => {
      // 插入有效验证码
      const expiresAt = new Date(Date.now() + 60000).toISOString();
      await database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13812345678', '123456', expiresAt]);
    });

    test('应该验证正确的验证码', async () => {
      const result = await database.verifyCode('13812345678', '123456');
      expect(result.valid).toBe(true);
    });

    test('应该拒绝错误的验证码', async () => {
      const result = await database.verifyCode('13812345678', '654321');
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('invalid');
    });

    test('应该拒绝过期的验证码', async () => {
      // 更新验证码为过期状态
      const expiredTime = new Date(Date.now() - 1000).toISOString();
      database.db.run('UPDATE verification_codes SET expires_at = ? WHERE phone = ?', [expiredTime, '13812345678']);

      const result = await database.verifyCode('13812345678', '123456');
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('expired');
    });

    test('验证成功后应该删除验证码', async () => {
      await database.verifyCode('13812345678', '123456');

      // 验证验证码已被删除
      const stmt = database.db.prepare('SELECT * FROM verification_codes WHERE phone = ?');
      stmt.bind(['13812345678']);
      const hasResult = stmt.step();
      stmt.free();

      expect(hasResult).toBe(false);
    });
  });

  describe('DB-CleanExpiredCodes', () => {
    test('应该清理过期的验证码', async () => {
      const now = new Date();
      const expiredTime = new Date(now.getTime() - 1000).toISOString();
      const validTime = new Date(now.getTime() + 60000).toISOString();

      // 插入过期和有效的验证码
      database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13812345678', '111111', expiredTime]);
      database.db.run('INSERT INTO verification_codes (phone, code, expires_at) VALUES (?, ?, ?)', ['13987654321', '222222', validTime]);

      await database.cleanExpiredCodes();

      // 验证只有有效的验证码保留
      const stmt = database.db.prepare('SELECT * FROM verification_codes');
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();

      expect(results.length).toBe(1);
      expect(results[0].phone).toBe('13987654321');
      expect(results[0].code).toBe('222222');
    });
  });
});