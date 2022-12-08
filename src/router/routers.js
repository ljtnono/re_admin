export default [
  {
    path: "/",
    redirect: {
      name: "Login",
    },
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "Login - 登录",
      hideInMenu: true,
    },
    component: () => import("@v/Login.vue"),
  },
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "主页",
      hideInMenu: true,
    },
    children: [
      {
        path: "/updatePassword",
        name: "UpdatePassword",
        meta: {
          title: "修改密码",
          hideInMenu: true,
        },
        component: () => import("@v/UpdatePassword.vue"),
      },
      {
        path: "/writeArticle",
        name: "WriteArticle",
        meta: {
          title: "写文章",
          hideInMenu: true,
        },
        component: () => import("@v/WriteArticle.vue"),
      },
      {
        path: "/personal",
        name: "Personal",
        meta: {
          title: "个人中心",
          hideInMenu: true,
        },
        component: () => import("@v/Personal.vue"),
      },
      {
        path: "/workspace",
        name: "Workspace",
        meta: {
          title: "工作台",
          hideInMenu: true,
        },
        component: () => import("@v/Workspace.vue"),
      },
      {
        path: "/blog/article",
        name: "Blog-Article",
        meta: {
          title: "文章管理",
          hideInMenu: true,
        },
        component: () => import("@v/ArticleManage.vue"),
      },
      {
        path: "/blog/category",
        name: "Blog-Category",
        meta: {
          title: "分类管理",
          hideInMenu: true,
        },
        component: () => import("@v/CategoryManage.vue"),
      },
      {
        path: "/blog/comment",
        name: "Blog-Comment",
        meta: {
          title: "评论管理",
          hideInMenu: true,
        },
        component: () => import("@v/CommentManage.vue"),
      },
      {
        path: "/system/user",
        name: "System-User",
        meta: {
          title: "用户管理",
          hideInMenu: true,
        },
        component: () => import("@v/UserManage.vue"),
      },
      {
        path: "/system/role",
        name: "System-Role",
        meta: {
          title: "角色管理",
          hideInMenu: true,
        },
        component: () => import("@v/RoleManage.vue"),
      },
      {
        path: "/system/websiteConfig",
        name: "System-WebsiteConfig",
        meta: {
          title: "网站配置",
          hideInMenu: true,
        },
        component: () => import("@v/WebsiteConfig.vue"),
      },
      {
        path: "/system/monitor",
        name: "System-Monitor",
        meta: {
          title: "系统监控",
          hideInMenu: true,
        },
        component: () => import("@v/SystemMonitor.vue"),
      },
    ],
    component: () => import("@v/Home.vue"),
  },
  {
    path: "*",
    name: "404",
    meta: {
      title: "404",
      name: "找不到页面",
      hideInMenu: true,
    },
    component: () => import("@v/error/404"),
  },
];
