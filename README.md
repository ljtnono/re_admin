# re_admin

根元素博客（RootElement）后台管理系统前端，基于 Vue 3 全家桶构建。

## 技术栈

| 依赖 | 版本 | 说明 |
| --- | --- | --- |
| Vue | ^3.5 | 渐进式框架，组合式 API + `<script setup>` |
| Vite | ^6 | 构建工具 |
| Element Plus | ^2.9 | UI 组件库 |
| Vue Router | ^4.5 | 路由，菜单路由由后端动态下发 |
| Pinia | ^3 | 状态管理（含持久化插件 pinia-plugin-persistedstate） |
| axios | ^1.7 | HTTP 请求 |
| md-editor-v3 | ^5.8 | Markdown 编辑器（写文章） |
| echarts | ^5.6 | 图表（系统监控页） |
| sass | ^1.83 | CSS 预处理器 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认端口 8080，可用 --port 指定）
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview
```

> 开发环境默认请求本机网关 `http://127.0.0.1:9100`，请先启动后端服务（re_backend + re_local docker 环境）。

## 环境变量

基于 Vite 的 [环境变量机制](https://vite.dev/guide/env-and-mode)，通过项目根目录下的 `.env` 文件配置：

| 文件 | 加载时机 | 说明 |
| --- | --- | --- |
| `.env` | 所有环境 | 通用配置，可被模式配置覆盖 |
| `.env.development` | `npm run dev` | 开发环境配置 |
| `.env.production` | `npm run build` | 生产环境配置 |
| `.env.local` / `.env.*.local` | 对应模式 | 本地私有配置，已 gitignore |
| `.env.example` | - | 模板，复制后按需修改 |

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| `VITE_API_BASE_URL` | 后端网关地址 | 开发：`http://127.0.0.1:9100`，生产：`http://api.lingjiatong.cn:30152` |
| `VITE_APP_TITLE` | 应用标题（注入页面 `<title>`） | 根元素博客后台管理系统 |

只有以 `VITE_` 前缀的变量才会暴露给前端代码，通过 `import.meta.env.VITE_XXX` 读取。

## 目录结构

```
├── index.html                  # 入口 HTML
├── vite.config.js              # Vite 配置（别名 @、@v、@c、@a）
├── .env*                       # 环境变量配置
├── public/                     # 静态资源（免构建）
└── src/
    ├── main.js                 # 应用入口（动态路由恢复、编辑器全局配置）
    ├── App.vue                 # 根组件
    ├── api/                    # 后端接口封装
    ├── assets/                 # 样式、图标、图片
    ├── components/             # 公共组件（Header、UserAvatar 等）
    ├── config/                 # axios 等全局配置
    ├── constant/               # 常量池（BASE_URL、错误码等）
    ├── router/                 # 静态路由（业务路由由登录后后端下发并动态注册）
    ├── store/                  # Pinia 状态（user / systemSetting / common）
    ├── util/                   # 工具类
    └── view/                   # 页面
        ├── Workspace.vue       # 工作台
        ├── WriteArticle.vue    # 写文章（Markdown，支持纯预览模式）
        ├── Personal.vue        # 个人中心
        ├── UpdatePassword.vue  # 修改密码
        ├── blog/               # 博客管理（文章 / 分类 / 评论）
        ├── system/             # 系统管理（用户 / 角色 / 菜单 / 监控）
        └── error/              # 异常页（404 / 403 / 500）
```

## 说明

- **动态路由**：登录成功后由后端返回菜单路由，前端动态注册并持久化到 sessionStorage，刷新页面不丢失。
- **纯预览模式**：文章管理列表点击文章标题跳转写文章页时带 `preview=1` 参数，编辑器以只读预览渲染。
- **后端项目**：[re_backend](../re_backend)（Spring Cloud 微服务），本地依赖 [re_local](../re_local) 提供的 MySQL / Redis / MinIO / Nacos 等中间件。
