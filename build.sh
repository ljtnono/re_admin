#!/usr/bin/env bash
# 构建 re-admin 管理后台镜像（openresty 托管静态资源）
# 前提：已安装 node/npm 和 docker
# 用法：bash build.sh
set -e

ROOT=$(cd "$(dirname "$0")" && pwd)
cd "$ROOT"

echo "==> 安装依赖并构建静态资源"
npm ci
npm run build

echo "==> 构建镜像 re-admin:latest"
# Dockerfile 中 COPY 路径以 project/ 为构建上下文，dist 需复制进去
rm -rf project/dist
cp -r dist project/dist
docker build -t re-admin:latest project/
rm -rf project/dist

echo "==> 完成：re-admin:latest"
