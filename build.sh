#!/usr/bin/env bash
# 构建 re-admin 管理后台镜像（openresty 托管静态资源）
# 前提：已安装 node/npm 和 docker
# 用法：bash build.sh
set -e

ROOT=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT"

# 从 package.json 读取应用版本号，作为镜像 tag
VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "")
if [ -z "$VERSION" ]; then
    echo "!! 未能从 package.json 解析 version，默认使用 latest"
    VERSION="latest"
fi
echo "==> 应用版本：$VERSION"

# 同步版本号到 docker 编排目录的 .env（供 compose 引用镜像 tag，与 re_backend 仓库平级）
ENV_FILE="$ROOT/../re_backend/project/docker/.env"
if [ -f "$ENV_FILE" ]; then
    if grep -q '^RE_ADMIN_VERSION=' "$ENV_FILE"; then
        sed -i "s/^RE_ADMIN_VERSION=.*/RE_ADMIN_VERSION=$VERSION/" "$ENV_FILE"
    else
        echo "RE_ADMIN_VERSION=$VERSION" >> "$ENV_FILE"
    fi
else
    echo "!! 未找到 $ENV_FILE，跳过版本同步（compose 将无法解析镜像 tag）"
fi

echo "==> 安装依赖并构建静态资源"
npm ci
npm run build

echo "==> 构建镜像 re-admin:$VERSION"
# Dockerfile 中 COPY 路径以 project/ 为构建上下文，dist 需复制进去
rm -rf project/dist
cp -r dist project/dist
docker build -t "re-admin:$VERSION" project/
rm -rf project/dist

echo "==> 完成：re-admin:$VERSION"
