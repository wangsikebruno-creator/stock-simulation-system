# 部署操作指南

## 当前状态

✅ 项目代码已创建完成
✅ Git 已提交到本地仓库
✅ GitHub 仓库已创建
⏳ 需要推送代码到 GitHub（网络问题）

---

## 你的配置信息

**已获取：**
- Tushare Token: `4dc510748f939b9f2d64fa36811bf737b139e39af6e7999c6c4767e2ffb3`
- AI API Key: `sk-A0Gq7YQBdy33V3sBlEREt7k5hFJo80ECbe2z1kCIXzO3QOu7`
- Vercel Token: `vcp_5jm3vO6YcahtQjtQp8sIYiKzqr11YgV7TO02PrQV3nLSc2lKgT0dW4jv`
- Vercel Org ID: `team_URPTnfccSplHk7KtS7wtOhds`
- GitHub 用户名: `wangsikebruno-creator`
- GitHub 仓库: `stock-simulation-system`

---

## 步骤 1: 推送代码到 GitHub

### 方法 A: 使用命令行（推荐）

打开 Git Bash 或终端，执行：

```bash
cd "C:\Users\bruno\模拟股票实验系统"
git push -u origin main
```

**如果遇到网络问题：**
- 检查是否需要配置代理
- 或使用 GitHub Desktop 推送
- 或使用 VPN

### 方法 B: 使用 GitHub Desktop

1. 打开 GitHub Desktop
2. File → Add Local Repository
3. 选择 `C:\Users\bruno\模拟股票实验系统`
4. 点击 "Publish repository"

### 方法 C: 手动上传

1. 访问 https://github.com/wangsikebruno-creator/stock-simulation-system
2. 点击 "uploading an existing file"
3. 将项目文件夹拖拽上传

---

## 步骤 2: 配置 GitHub Secrets

推送成功后，配置 Secrets：

1. 访问 https://github.com/wangsikebruno-creator/stock-simulation-system/settings/secrets/actions
2. 点击 "New repository secret"
3. 依次添加以下 Secrets：

### 必需的 Secrets

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | `vcp_5jm3vO6YcahtQjtQp8sIYiKzqr11YgV7TO02PrQV3nLSc2lKgT0dW4jv` |
| `VERCEL_ORG_ID` | `team_URPTnfccSplHk7KtS7wtOhds` |
| `VERCEL_PROJECT_ID` | 稍后从 Vercel 获取 |
| `TUSHARE_TOKEN` | `4dc510748f939b9f2d64fa36811bf737b139e39af6e7999c6c4767e2ffb3` |
| `GEMINI_API_KEY` | `sk-A0Gq7YQBdy33V3sBlEREt7k5hFJo80ECbe2z1kCIXzO3QOu7` |

**注意：** 先不要添加 `VERCEL_PROJECT_ID`，等部署后再添加。

---

## 步骤 3: 部署到 Vercel

### 方法 A: 使用 Vercel CLI（推荐）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 进入项目目录
cd "C:\Users\bruno\模拟股票实验系统"

# 部署
vercel
```

按照提示操作：
- Set up and deploy? **Y**
- Which scope? 选择你的账户
- Link to existing project? **N**
- What's your project's name? `stock-simulation-system`
- In which directory is your code located? `./`
- Want to override the settings? **N**

### 方法 B: 通过 Vercel Dashboard

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择 `wangsikebruno-creator/stock-simulation-system`
4. 点击 "Import"
5. 配置环境变量（见下方）
6. 点击 "Deploy"

---

## 步骤 4: 配置 Vercel 环境变量

在 Vercel Dashboard → 项目 → Settings → Environment Variables 添加：

| Key | Value | Environment |
|-----|-------|-------------|
| `TUSHARE_TOKEN` | `4dc510748f939b9f2d64fa36811bf737b139e39af6e7999c6c4767e2ffb3` | All |
| `GEMINI_API_KEY` | `sk-A0Gq7YQBdy33V3sBlEREt7k5hFJo80ECbe2z1kCIXzO3QOu7` | All |

---

## 步骤 5: 获取 VERCEL_PROJECT_ID

部署成功后：

1. 在 Vercel Dashboard 进入项目
2. Settings → General
3. 滚动到底部，找到 "Project ID"
4. 复制 Project ID（格式：`prj_xxxxx`）
5. 回到 GitHub，添加 Secret：
   - Name: `VERCEL_PROJECT_ID`
   - Value: 你复制的 Project ID

---

## 步骤 6: 测试验证

### 6.1 访问应用

打开 Vercel 提供的 URL（如：`https://stock-simulation-system.vercel.app`）

### 6.2 测试功能

- ✅ 首页显示股票列表
- ✅ 点击股票查看详情
- ✅ K线图正常显示
- ✅ AI 分析按钮可用

### 6.3 测试 GitHub Actions

1. 修改 README.md 文件
2. 提交并推送
3. 查看 GitHub Actions 是否自动运行

---

## 可选：配置邮件通知

如需邮件通知功能，在 GitHub Secrets 添加：

| Name | Value |
|------|-------|
| `SMTP_HOST` | `smtp.qq.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | 你的QQ邮箱 |
| `SMTP_PASS` | QQ邮箱授权码 |
| `EMAIL_TO` | 接收邮箱 |

---

## 故障排查

### 问题 1: 推送 GitHub 失败

**解决方法：**
```bash
# 检查网络
ping github.com

# 配置代理（如果有）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy http://127.0.0.1:7890

# 重试推送
git push -u origin main
```

### 问题 2: Vercel 部署失败

**解决方法：**
- 检查环境变量是否正确配置
- 查看 Vercel 部署日志
- 确认 Node.js 版本兼容（需要 18+）

### 问题 3: API 返回错误

**解决方法：**
- 检查 Tushare Token 是否有效
- 确认 Gemini API Key 是否正确
- 查看 Vercel Function Logs

---

## 完成后的效果

✅ 访问应用可以看到 A 股实时行情
✅ 点击股票可以查看 K 线图
✅ AI 分析功能正常工作
✅ 代码推送自动触发部署
✅ 每日交易日自动发送报告（如已配置邮件）

---

## 需要帮助？

如果遇到问题：
1. 查看项目 README.md
2. 查看 docs/TUSHARE_SETUP.md
3. 检查 Vercel Function Logs
4. 查看 GitHub Actions 日志

祝你部署顺利！🎉
