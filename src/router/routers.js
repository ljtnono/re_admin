export default [
  {
    path: '/login',
    name: 'Login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@v/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '主页',
      hideInMenu: true
    },
    children: [
      {
        path: "/workspace",
        name: "工作台",
        hideInMenu: true,
        component: () => import("@v/Workspace.vue")
      },
      {
        path: "/blog/article",
        name: "文章管理",
        hideInMenu: true,
        component: () => import("@v/ArticleManage.vue")
      },
      {
        path: "/blog/category",
        name: "分类管理",
        hideInMenu: true,
        component: () => import("@v/CategoryManage.vue")
      },
      {
        path: "/blog/comment",
        name: "评论管理",
        hideInMenu: true,
        component: () => import("@v/CommentManage.vue")
      },
      {
        path: "/system/user",
        name: "用户管理",
        hideInMenu: true,
        component: () => import("@v/UserManage.vue")
      },
      {
        path: "/system/role",
        name: "角色管理",
        hideInMenu: true,
        component: () => import("@v/RoleManage.vue")
      },
      {
        path: "/system/websiteConfig",
        name: "网站配置",
        hideInMenu: true,
        component: () => import("@v/WebsiteConfig.vue")
      },
      {
        path: "/system/monitor",
        name: "系统监控",
        hideInMenu: true,
        component: () => import("@v/SystemMonitor.vue")
      }
    ],
    component: () => import('@v/Home.vue')
  }
]
