# 模拟股票实验系统

一个基于 React + TypeScript + Vercel 的 A 股智能分析系统，支持实时行情、K线图表、AI智能分析和自动报告生成。

## 功能特性

- 📊 **A股实时行情** - 支持沪深股票实时报价和涨跌幅
- 📈 **K线图表** - 提供近30日历史价格走势图
- 🤖 **AI智能分析** - 集成 Google Gemini / DeepSeek，自动生成市场分析
- 📧 **邮件通知** - 每日交易日自动发送市场报告
- ⚡ **高性能缓存** - 5分钟实时数据缓存，1小时历史数据缓存
- 📱 **响应式设计** - 完美适配桌面和移动端

## 技术栈

- **前端**: React 19 + TypeScript + Vite
- **样式**: Tailwind CSS 4
- **图表**: Recharts
- **后端**: Vercel Serverless Functions
- **数据源**: Tushare API（A股数据）
- **AI服务**: Google Gemini / DeepSeek
- **部署**: Vercel + GitHub Actions

## 快速开始

### 前置要求

- Node.js 18+
- Tushare 账号（[注册地址](https://tushare.pro/register)）
- Gemini API Key 或 DeepSeek API Key
- Vercel 账号
- GitHub 账号

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/你的用户名/stock-simulation-system.git
   cd stock-simulation-system
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入必要的配置
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   - 打开浏览器访问 `http://localhost:5173`

## 配置指南

### 1. 注册 Tushare 并获取 Token

**这是数据源的关键配置，必须完成！**

1. 访问 [Tushare 注册页面](https://tushare.pro/register)
2. 使用手机号或邮箱注册账号
3. 登录后访问 [Token 页面](https://tushare.pro/user/token)
4. 复制你的 Token 并保存

详细步骤请参考：[docs/TUSHARE_SETUP.md](./docs/TUSHARE_SETUP.md)

### 2. 获取 AI API Key

**AI 分析功能必需！**

**方案 A：Google Gemini（推荐）**
- 访问 https://aistudio.google.com/apikey
- 创建 API Key 并复制

**方案 B：DeepSeek（国内友好）**
- 访问 https://platform.deepseek.com/
- 注册、充值（最低10元）、创建 API Key

详细步骤请参考：[docs/AI_CONFIG.md](./docs/AI_CONFIG.md)

### 3. 配置 GitHub Secrets

在 GitHub 仓库中配置以下 Secrets：

**必需配置：**
- `VERCEL_TOKEN` - Vercel 部署令牌
- `VERCEL_ORG_ID` - Vercel 组织 ID
- `VERCEL_PROJECT_ID` - Vercel 项目 ID
- `TUSHARE_TOKEN` - Tushare API Token
- `GEMINI_API_KEY` - Gemini API Key（或 `OPENAI_API_KEY`）

**可选配置（邮件通知）：**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_TO`

详细步骤请参考：[docs/GITHUB_SECRETS.md](./docs/GITHUB_SECRETS.md)

### 4. 部署到 Vercel

```bash
npm install -g vercel
vercel login
vercel
```

详细步骤请参考：[docs/VERCEL_SETUP.md](./docs/VERCEL_SETUP.md)

## 项目结构

```
模拟股票实验系统/
├── api/                    # Vercel Serverless Functions
│   ├── quotes.ts          # A股实时报价
│   ├── history.ts         # 历史K线数据
│   └── analyze.ts         # AI分析
├── src/
│   ├── components/        # React组件
│   ├── pages/            # 页面组件
│   ├── context/          # 全局状态
│   └── types/            # TypeScript类型
├── .github/workflows/     # GitHub Actions
├── docs/                  # 配置文档
└── scripts/               # 辅助脚本
```

## API 端点

### GET /api/quotes

获取 A 股实时报价

**参数：**
- `symbol` (可选) - 股票代码（如：600000.SH）

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "ts_code": "600000.SH",
      "name": "浦发银行",
      "close": 8.52,
      "pct_chg": 1.20,
      "vol": 125000,
      ...
    }
  ]
}
```

### GET /api/history

获取历史 K 线数据

**参数：**
- `symbol` (必需) - 股票代码
- `days` (可选) - 天数，默认30

### GET /api/analyze

获取 AI 智能分析

**参数：**
- `symbol` (必需) - 股票代码

## 常见问题

### Q: Tushare API 调用失败？

**解决方法：**
- 检查 Token 是否正确配置
- 确认账号积分是否充足
- 检查网络连接

### Q: AI 分析不工作？

**解决方法：**
- 检查 API Key 是否有效
- 确认 API 额度未用完
- 查看 Vercel Function Logs

### Q: 邮件没有收到？

**解决方法：**
- 检查垃圾邮件文件夹
- 确认使用的是授权码，不是密码
- 查看 GitHub Actions 日志

更多问题请查看：[docs/FAQ.md](./docs/FAQ.md)

## 注意事项

1. **数据延迟**：Tushare 免费数据有约15分钟延迟
2. **交易时间**：定时任务仅在交易日执行（周一至周五）
3. **API 限制**：注意 Tushare 和 AI API 的调用频率限制
4. **成本控制**：Gemini 免费版有配额限制，DeepSeek 按量计费

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 联系方式

- 项目地址: https://github.com/你的用户名/stock-simulation-system
- 问题反馈: https://github.com/你的用户名/stock-simulation-system/issues

## 免责声明

⚠️ 本系统仅供学习研究使用，不构成任何投资建议。投资有风险，入市需谨慎。
# 触发重新部署
