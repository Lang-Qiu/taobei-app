# 淘贝应用 (Taobei App)

一个基于React + Node.js的全栈Web应用，实现了用户登录和注册功能。

## 项目结构

```
taobei/
├── frontend/          # React前端应用
├── backend/           # Node.js后端API
├── .artifacts/        # 接口规格文档
├── requirement.md     # 原始需求文档
├── requirement_new.md # 更新的需求文档
└── 课程作业说明.md    # 课程作业说明
```

## 技术栈

### 前端
- **React 18** - UI框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Vitest** - 测试框架
- **@testing-library/react** - 组件测试

### 后端
- **Node.js** - 运行时环境
- **Express** - Web框架
- **SQLite** - 数据库
- **Jest** - 测试框架
- **bcrypt** - 密码加密

## 功能特性

- ✅ 用户注册（手机号 + 验证码）
- ✅ 用户登录
- ✅ 密码加密存储
- ✅ 协议同意功能
- ✅ 完整的前后端测试覆盖

## 快速开始

### 环境要求
- Node.js >= 16
- npm >= 8

### 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

### 运行项目

#### 启动后端服务
```bash
cd backend
npm start
```
后端服务将在 http://localhost:3000 启动

#### 启动前端开发服务器
```bash
cd frontend
npm run dev
```
前端应用将在 http://localhost:5173 启动

### 测试执行方式

#### 运行后端测试
```bash
cd backend
npm test
```

#### 运行前端测试
```bash
cd frontend
npm test
```

#### 运行所有测试
```bash
# 在项目根目录
npm run test:all  # 如果配置了此脚本
```

## 测试覆盖

### 后端测试 (34个测试用例)
- 数据库连接和操作测试
- 用户认证API测试
- 用户注册API测试

### 前端测试 (49个测试用例)
- RegisterPage组件测试 (15个)
- AgreementCheckbox组件测试 (12个)
- RegisterButton组件测试 (22个)

## API接口

### 用户认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/send-verification-code` - 发送验证码

详细的API文档请参考 `.artifacts/api_interface.yml`

## 开发模式

本项目遵循 **测试驱动开发 (TDD)** 模式：
1. 需求分析 → 2. 接口设计 → 3. 测试编写 → 4. 功能实现

## 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情