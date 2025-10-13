const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const database = require('./database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(helmet());
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/auth', authRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 启动服务器
async function startServer() {
  try {
    const dbPath = process.env.NODE_ENV === 'test' ? './test.db' : './database.db';
    await database.connect(dbPath);
    console.log('数据库连接成功');
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;