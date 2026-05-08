#!/bin/bash
# English Kids - GitHub Pages 部署脚本
# 回家后在终端运行：bash ~/english-kids/deploy.sh

cd ~/english-kids

echo "🚀 开始部署 English Kids..."

# 1. 构建生产包
echo "📦 构建中..."
npx vite build

# 2. 推送到 GitHub
echo "📤 推送到 GitHub..."
git remote add origin https://github.com/shxq0829/english-kids.git 2>/dev/null
git branch -M main 2>/dev/null
git add .
git commit -m "🚀 Deploy" 2>/dev/null || true
git push -u origin main

echo ""
echo "✅ 推送完成！接下来在 GitHub 网页上："
echo "   Settings → Pages → Source: GitHub Actions"
echo "   或直接访问: https://shxq0829.github.io/english-kids/"
