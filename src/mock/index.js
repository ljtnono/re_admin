// 临时 mock 入口，仅用于本地 UI 验证，验证完成后删除
import Mock from "mockjs";
import {
  HTTP_RESULT_SUCCESS_CODE,
  HTTP_RESULT_SUCCESS_MESSAGE,
} from "@/constant/commonConstant";

const ok = (data = null) => () => ({
  code: HTTP_RESULT_SUCCESS_CODE,
  message: HTTP_RESULT_SUCCESS_MESSAGE,
  data,
});

Mock.mock(/\/api-backend\/article\/draftList/, "get", ok([
  {draftId: "draft00000000001", title: "CentOS 7 下 MySQL 8 最小化安装实践", saveTime: "2026-09-28 22:14:36"},
  {draftId: "draft00000000002", title: "Spring Cloud Gateway 网关踩坑记录与调优", saveTime: "2026-09-25 09:30:12"},
  {draftId: "draft00000000003", title: "Vue2 老项目渐进式升级到 Vue3 的思路整理", saveTime: "2026-09-20 18:02:55"},
  {draftId: "draft00000000004", title: "关于博客系统重构的一些想法与总结", saveTime: "2026-09-12 08:45:03"},
  {draftId: "draft00000000005", title: "MinIO 替代本地文件存储的实践笔记", saveTime: "2026-08-30 23:11:47"},
]));

Mock.mock(/\/api-backend\/article\/draft\//, "get", ok({
  draftId: "draft00000000001",
  title: "CentOS 7 下 MySQL 8 最小化安装实践",
  saveTime: "2026-09-28 22:14:36",
  markdownContent: [
    "# CentOS 7 下 MySQL 8 最小化安装实践",
    "",
    "> 本文记录一次生产环境中 MySQL 8 最小化安装的完整过程，避免踩坑。",
    "",
    "## 1. 下载并解压安装包",
    "",
    "```shell",
    "wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.25-linux-glibc2.17-x86_64-minimal.tar.xz",
    "tar xvf mysql-8.0.25-linux-glibc2.17-x86_64-minimal.tar.xz",
    "```",
    "",
    "## 2. 初始化数据库",
    "",
    "```bash",
    "groupadd mysql",
    "useradd -r -g mysql -s /bin/false mysql",
    "bin/mysqld --initialize --user=mysql",
    "```",
    "",
    "## 3. 修改 root 密码",
    "",
    "```mysql",
    "ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';",
    "FLUSH PRIVILEGES;",
    "```",
    "",
    "## 小结",
    "",
    "最小化安装不依赖系统包管理器，适合离线环境，但要注意 `libaio` 等依赖需要提前准备好。",
    "",
  ].join("\n"),
}));

Mock.mock(/\/api-backend\/article\/saveOrUpdateDraft/, "post", ok("draft00000000001"));
Mock.mock(/\/api-backend\/article\/deleteDraft\//, "delete", ok(null));
Mock.mock(/\/api-backend\/article\/publishArticle/, "post", ok(null));

// 已发布文章列表
Mock.mock(/\/api-backend\/article\/list/, "get", ok({
  records: [
    {id: "1900000000000000001", title: "一文搞懂 Spring Cloud 网关原理", summary: "从请求链路出发，深入解析 Spring Cloud Gateway 的核心组件。", category: "后端", author: "lingjiatong", view: 1286, favorite: 96, recommend: 1, top: 1, tagList: ["Java", "SpringCloud"], createTime: "2026-09-26 21:30:00", modifyTime: "2026-09-26 21:30:00"},
    {id: "1900000000000000002", title: "MySQL 8 新特性全解析", summary: "盘点 MySQL 8 最值得关注的特性。", category: "后端", author: "lingjiatong", view: 863, favorite: 54, recommend: 0, top: 0, tagList: ["MySQL"], createTime: "2026-09-15 10:12:00", modifyTime: "2026-09-15 10:12:00"},
    {id: "1900000000000000003", title: "博客系统 Docker 化部署实录", summary: "记录博客系统完整 Docker 化过程。", category: "运维", author: "lingjiatong", view: 432, favorite: 31, recommend: 0, top: 0, tagList: ["Docker"], createTime: "2026-09-02 08:45:00", modifyTime: "2026-09-02 08:45:00"},
  ],
  total: 3,
  size: 100,
  current: 1,
}));

// 已发布文章详情
Mock.mock(/\/api-backend\/article\/detail\//, "get", ok({
  id: "1900000000000000001",
  title: "一文搞懂 Spring Cloud 网关原理",
  summary: "从请求链路出发，深入解析 Spring Cloud Gateway 的核心组件与工作原理。",
  markdownContent: [
    "# 一文搞懂 Spring Cloud 网关原理",
    "",
    "> 网关是微服务流量的总入口，理解它的工作原理对排查线上问题至关重要。",
    "",
    "## 核心概念",
    "",
    "- **Route（路由）**：路由是网关的基本单元，由 ID、目标 URI、谓词集合和过滤器集合组成",
    "- **Predicate（谓词）**：匹配请求的条件，比如路径、请求头、请求方法等",
    "- **Filter（过滤器）**：在请求前后对请求进行增强处理",
    "",
    "```java",
    "@Bean",
    "public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {",
    "    return builder.routes()",
    "        .route(\"article\", r -> r.path(\"/api/article/**\")",
    "            .uri(\"lb://re-service-article\"))",
    "        .build();",
    "}",
    "```",
    "",
    "## 请求处理流程",
    "",
    "1. DispatcherHandler 将请求交给 GatewayHandlerMapping",
    "2. 根据谓词匹配到对应的路由",
    "3. 按顺序执行过滤器链",
    "4. 转发到目标服务并回写响应",
    "",
    "## 小结",
    "",
    "掌握谓词与过滤器的组合使用，就能覆盖绝大多数网关场景。",
    "",
  ].join("\n"),
  htmlContent: "",
  categoryId: 1,
  tagList: ["Java", "SpringCloud"],
  recommend: 1,
  top: 0,
  creationType: 1,
  coverUrl: null,
  transportInfo: null,
  quoteInfo: null,
  createTime: "2026-09-26 21:30:00",
  modifyTime: "2026-09-26 21:30:00",
}));

// 更新文章
Mock.mock(/\/api-backend\/article\/update/, "put", ok(null));
