# Tushare 配置指南

Tushare 是国内领先的金融数据平台，提供 A 股市场数据。本指南将帮助你注册账号并获取 API Token。

## 为什么选择 Tushare？

- ✅ 国内访问稳定
- ✅ 数据质量高
- ✅ 免费用户有基础数据权限
- ✅ API 简单易用
- ✅ 支持沪深股票、指数、基金等

## 注册步骤

### 步骤 1：访问注册页面

打开浏览器访问：https://tushare.pro/register

### 步骤 2：填写注册信息

- **手机号**：输入你的手机号码
- **验证码**：点击获取验证码，输入收到的验证码
- **密码**：设置登录密码（建议使用强密码）
- **邀请码**：可选，如有邀请码可填写

或者使用邮箱注册：
- **邮箱**：输入你的邮箱地址
- **验证码**：从邮箱中获取验证码
- **密码**：设置登录密码

### 步骤 3：完成注册

点击"注册"按钮，完成账号创建。

---

## 获取 Token

### 步骤 1：登录账号

访问 https://tushare.pro/ 并登录你的账号。

### 步骤 2：进入 Token 页面

登录后，访问：https://tushare.pro/user/token

或者：
1. 点击右上角的用户名
2. 选择"接口TOKEN"

### 步骤 3：复制 Token

页面会显示你的 Token，格式类似：
```
1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd
```

**重要：** 请妥善保管你的 Token，不要泄露给他人！

---

## 积分说明

Tushare 使用积分制度来控制 API 访问权限。

### 新用户积分

- 注册即送 **120 积分**
- 基础行情数据免费使用

### 积分用途

| 数据类型 | 所需积分 | 说明 |
|---------|---------|------|
| 日线行情 | 0 | 免费 |
| 分钟行情 | 2000+ | 需要积分 |
| 实时行情 | 5000+ | 需要积分 |
| 财务数据 | 不同等级 | 部分需要积分 |

### 获取更多积分

1. **每日签到**：每天登录签到可获得积分
2. **分享推广**：邀请好友注册可获得积分
3. **社区贡献**：在社区发帖、回答问题可获得积分
4. **付费购买**：可以直接购买积分

---

## 配置到项目

### 方法一：配置到 .env 文件（本地开发）

1. 复制 `.env.example` 为 `.env`：
   ```bash
   cp .env.example .env
   ```

2. 编辑 `.env` 文件，填入你的 Token：
   ```
   TUSHARE_TOKEN=你的Token
   ```

### 方法二：配置到 GitHub Secrets（生产环境）

1. 访问 GitHub 仓库页面
2. 点击 Settings → Secrets and variables → Actions
3. 点击 "New repository secret"
4. Name: `TUSHARE_TOKEN`
5. Value: 粘贴你的 Token
6. 点击 "Add secret"

### 方法三：配置到 Vercel 环境变量

1. 访问 Vercel Dashboard
2. 进入你的项目
3. 点击 Settings → Environment Variables
4. 添加新变量：
   - Key: `TUSHARE_TOKEN`
   - Value: 你的 Token
   - Environment: 选择 Production, Preview, Development
5. 点击 "Save"

---

## 测试 Token

### 使用命令行测试

```bash
curl -X POST http://api.tushare.pro \
  -H "Content-Type: application/json" \
  -d '{
    "api_name": "daily",
    "token": "你的Token",
    "params": {
      "ts_code": "600000.SH",
      "trade_date": "20240315"
    },
    "fields": "ts_code,trade_date,open,high,low,close"
  }'
```

### 使用项目测试脚本

```bash
cd 模拟股票实验系统
TUSHARE_TOKEN=你的Token node scripts/test-api.js
```

如果返回股票数据，说明配置成功！

---

## API 使用限制

### 免费用户限制

- **调用频率**：每分钟 200 次
- **数据延迟**：约 15 分钟
- **历史数据**：最近 3 年

### 付费用户权限

- 更高的调用频率
- 实时数据
- 更长的历史数据
- 更多数据接口

---

## 常见问题

### Q1: Token 无效或过期

**解决方法：**
- 检查 Token 是否完整复制（无多余空格）
- 确认账号是否正常（未被封禁）
- 重新登录获取新 Token

### Q2: 积分不足

**错误信息：** `抱歉，您的积分不足`

**解决方法：**
- 检查所需数据的积分要求
- 使用免费的基础数据接口
- 通过签到、分享等方式获取积分

### Q3: 调用频率超限

**错误信息：** `接口调用超过频率限制`

**解决方法：**
- 减少 API 调用频率
- 使用缓存机制（项目已实现）
- 升级到付费账号

### Q4: 数据为空

**解决方法：**
- 检查股票代码格式是否正确（如：600000.SH）
- 确认交易日期是否为交易日
- 检查该股票是否存在

---

## 支持的股票代码格式

### 上海证券交易所（.SH）

- 主板：600000.SH - 600999.SH
- 科创板：688000.SH - 688999.SH

### 深圳证券交易所（.SZ）

- 主板：000001.SZ - 000999.SZ
- 中小板：002000.SZ - 002999.SZ
- 创业板：300000.SZ - 300999.SZ

---

## 相关链接

- Tushare 官网：https://tushare.pro/
- API 文档：https://tushare.pro/document/2
- 社区论坛：https://waditu.com/
- 积分规则：https://tushare.pro/document/1?doc_id=13

---

## 下一步

完成 Tushare 配置后，继续：
1. [配置 AI 功能](./AI_CONFIG.md)
2. [配置 GitHub Secrets](./GITHUB_SECRETS.md)
3. [部署到 Vercel](./VERCEL_SETUP.md)
