# 手动上传到 GitHub 指南

由于网络连接问题，无法直接推送代码。请使用以下方法之一：

---

## 方法 1: 使用 GitHub Desktop（最简单）⭐

1. **下载安装 GitHub Desktop**
   - 访问：https://desktop.github.com/
   - 下载并安装

2. **添加本地仓库**
   - 打开 GitHub Desktop
   - 登录你的 GitHub 账号（wangsikebruno-creator）
   - File → Add Local Repository
   - 选择：`C:\Users\bruno\模拟股票实验系统`
   - 点击 "Add Repository"

3. **发布到 GitHub**
   - 点击顶部的 "Publish repository" 按钮
   - 确认仓库名称：`stock-simulation-system`
   - 点击 "Publish Repository"

✅ 完成！代码已上传到 GitHub

---

## 方法 2: 使用 Git Bundle（备用）

如果 GitHub Desktop 也无法连接，使用这个方法：

1. **Bundle 文件位置**
   - 文件：`C:\Users\bruno\stock-system.bundle`
   - 这个文件包含了完整的 Git 历史

2. **在另一台电脑或网络环境下**
   ```bash
   # 克隆 bundle
   git clone stock-system.bundle stock-simulation-system
   cd stock-simulation-system

   # 添加远程仓库
   git remote add origin https://github.com/wangsikebruno-creator/stock-simulation-system.git

   # 推送
   git push -u origin main
   ```

---

## 方法 3: 直接上传文件（最后选择）

1. **访问 GitHub 仓库**
   - https://github.com/wangsikebruno-creator/stock-simulation-system

2. **上传文件**
   - 点击 "uploading an existing file"
   - 将整个项目文件夹拖拽到页面
   - 或点击 "choose your files" 选择所有文件

3. **提交**
   - Commit message: `Initial commit: 模拟股票实验系统`
   - 点击 "Commit changes"

⚠️ 注意：这个方法会丢失 Git 历史记录

---

## 上传成功后的下一步

### 1. 配置 GitHub Secrets

访问：https://github.com/wangsikebruno-creator/stock-simulation-system/settings/secrets/actions

添加以下 Secrets：

| Name | Value |
|------|-------|
| `VERCEL_TOKEN` | `vcp_5jm3vO6YcahtQjtQp8sIYiKzqr11YgV7TO02PrQV3nLSc2lKgT0dW4jv` |
| `VERCEL_ORG_ID` | `team_URPTnfccSplHk7KtS7wtOhds` |
| `TUSHARE_TOKEN` | `4dc510748f939b9f2d64fa36811bf737b139e39af6e7999c6c4767e2ffb3` |
| `GEMINI_API_KEY` | `sk-A0Gq7YQBdy33V3sBlEREt7k5hFJo80ECbe2z1kCIXzO3QOu7` |

**注意：** `VERCEL_PROJECT_ID` 等部署后再添加

---

### 2. 部署到 Vercel

**方法 A: 通过 Vercel Dashboard**

1. 访问：https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择 `wangsikebruno-creator/stock-simulation-system`
4. 配置环境变量：
   - `TUSHARE_TOKEN`: `4dc510748f939b9f2d64fa36811bf737b139e39af6e7999c6c4767e2ffb3`
   - `GEMINI_API_KEY`: `sk-A0Gq7YQBdy33V3sBlEREt7k5hFJo80ECbe2z1kCIXzO3QOu7`
5. 点击 "Deploy"

**方法 B: 使用 Vercel CLI**

```bash
cd "C:\Users\bruno\模拟股票实验系统"
npm install -g vercel
vercel login
vercel --prod
```

---

### 3. 获取 PROJECT_ID

部署成功后：

1. 进入 Vercel Dashboard → 你的项目
2. Settings → General
3. 复制 "Project ID"（格式：`prj_xxxxx`）
4. 回到 GitHub，添加 Secret：
   - Name: `VERCEL_PROJECT_ID`
   - Value: 你复制的 ID

---

### 4. 测试应用

访问 Vercel 提供的 URL，测试：
- ✅ 股票列表显示
- ✅ 点击查看详情
- ✅ K线图显示
- ✅ AI 分析功能

---

## 推荐方案

**最推荐：方法 1（GitHub Desktop）**
- 最简单
- 保留完整 Git 历史
- 图形界面操作

**如果方法 1 不行：方法 2（Git Bundle）**
- 在网络好的环境下操作
- 保留完整 Git 历史

**最后选择：方法 3（直接上传）**
- 最快速
- 但会丢失 Git 历史

---

## 需要帮助？

所有配置信息都在 `DEPLOYMENT_GUIDE.md` 文件中。

祝你部署顺利！🚀
