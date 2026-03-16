#!/bin/bash

# 模拟股票实验系统 - 部署脚本

echo "=========================================="
echo "模拟股票实验系统 - 自动部署"
echo "=========================================="

# 1. 推送代码到 GitHub
echo ""
echo "步骤 1: 推送代码到 GitHub..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo "❌ 推送失败，请检查网络连接"
    echo "提示: 如果在国内，可能需要配置代理或使用 VPN"
    exit 1
fi

echo "✅ 代码推送成功"

# 2. 安装依赖
echo ""
echo "步骤 2: 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装成功"

# 3. 部署到 Vercel
echo ""
echo "步骤 3: 部署到 Vercel..."
echo "请确保已安装 Vercel CLI: npm install -g vercel"

vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Vercel 部署失败"
    exit 1
fi

echo "✅ Vercel 部署成功"

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo ""
echo "下一步："
echo "1. 访问 Vercel Dashboard 获取 PROJECT_ID"
echo "2. 在 GitHub 仓库配置 Secrets"
echo "3. 配置完成后，GitHub Actions 将自动工作"
