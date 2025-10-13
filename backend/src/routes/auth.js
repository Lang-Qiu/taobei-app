const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const database = require('../database');

// 存储频率限制信息
const rateLimitMap = new Map();

// 手机号格式校验函数
function validatePhoneNumber(phoneNumber) {
  if (!phoneNumber || typeof phoneNumber !== 'string') {
    return false;
  }
  // 11位数字，1开头
  const phoneRegex = /^1\d{10}$/;
  return phoneRegex.test(phoneNumber);
}

// 生成6位随机验证码
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 验证码发送接口
router.post('/send-verification-code', async (req, res) => {
  try {
    const { phone, phoneNumber } = req.body;
    const phoneNum = phone || phoneNumber; // 兼容两种字段名

    // 手机号格式校验
    if (!phoneNum || !/^1\d{10}$/.test(phoneNum)) {
      return res.status(400).json({ error: '请输入正确的手机号码' });
    }

    // 频率限制检查 - 检查60秒内是否已发送过验证码
    try {
      const stmt = database.db.prepare('SELECT * FROM verification_codes WHERE phone = ? AND created_at > datetime("now", "-60 seconds")');
      stmt.bind([phoneNum]);
      const hasRow = stmt.step();
      let recentCode = null;
      if (hasRow) {
        recentCode = stmt.getAsObject();
      }
      stmt.free();

      if (recentCode) {
        return res.status(429).json({ error: '请求过于频繁，请稍后再试' });
      }
    } catch (error) {
      console.error('频率限制检查失败:', error);
      return res.status(500).json({ error: '服务器内部错误' });
    }

    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 打印验证码到控制台（模拟短信发送）
    console.log(`验证码发送到 ${phoneNum}: ${code}`);

    // 保存验证码到数据库（60秒有效期，匹配测试期望）
    const expiresAt = new Date(Date.now() + 60 * 1000).toISOString();
    await database.saveVerificationCode(phoneNum, code, expiresAt);

    res.json({ 
      message: '验证码已发送',
      expiresIn: 60
    });
  } catch (error) {
    console.error('发送验证码失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 登录接口
router.post('/login', async (req, res) => {
  try {
    const { phone, phoneNumber, code, verificationCode } = req.body;
    const phoneNum = phone || phoneNumber; // 兼容两种字段名
    const inputCode = code || verificationCode; // 兼容两种字段名

    // 手机号格式校验
    if (!phoneNum || !/^1\d{10}$/.test(phoneNum)) {
      return res.status(400).json({ error: '请输入正确的手机号码' });
    }

    // 验证码格式校验
    if (!inputCode || !/^\d{6}$/.test(inputCode)) {
      return res.status(400).json({ error: '请输入正确的验证码' });
    }

    // 检查用户是否已注册
    const userStmt = database.db.prepare('SELECT * FROM users WHERE phone = ?');
    userStmt.bind([phoneNum]);
    let user = null;
    if (userStmt.step()) {
      user = userStmt.getAsObject();
    }
    userStmt.free();
    
    if (!user) {
      return res.status(404).json({ error: '该手机号未注册，请先完成注册' });
    }

    // 验证验证码
    const result = await database.verifyCode(phoneNum, inputCode);
    
    if (!result.valid) {
      if (result.reason === 'expired') {
        return res.status(410).json({ error: '验证码已过期' });
      } else {
        return res.status(401).json({ error: '验证码错误' });
      }
    }

    // 生成JWT token
    const token = jwt.sign(
      { userId: user.id, phone: phoneNum },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: '登录成功',
      userId: user.id,
      token
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

module.exports = router;