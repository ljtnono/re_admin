import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/blog',
    name: 'blog',
    meta: {
      icon: "md-bookmarks",
      title: "博客管理"
    },
    component: Main,
    children: [
      {
        path: 'blog-list',
        name: 'blog-list',
        meta: {
          title: '博客列表'
        },
        component: () => import('@/view/blog/blog-list')
      },
      {
        path: 'blog-detail',
        name: 'blog-detail',
        meta: {
          title: '博客详情',
          hideInMenu: true
        },
        component: () => import('@/view/blog/blog-detail')
      },
      {
        path: 'blog-edit',
        name: 'blog-edit',
        meta: {
          title: '博客编辑'
        },
        component: () => import('@/view/blog/blog-edit')
      }
    ]
  },
  {
    path: '/blogType',
    name: 'blogType',
    meta: {
      icon: "ios-keypad",
      title: "博客类型管理"
    },
    component: Main,
    children: [
      {
        path: 'blogType-list',
        name: 'blogType-list',
        meta: {
          title: '博客类型列表'
        },
        component: () => import('@/view/blogType/blogType-list')
      },
      {
        path: 'blogType-detail',
        name: 'blogType-detail',
        meta: {
          title: '博客类型详情',
          hideInMenu: true
        },
        component: () => import('@/view/blogType/blogType-detail')
      },
      {
        path: 'blogType-add',
        name: 'blogType-add',
        meta: {
          title: '博客类型新增'
        },
        component: () => import('@/view/blogType/blogType-add')
      }
    ]
  },
  {
    path: '/image',
    name: 'image',
    meta: {
      icon: "md-images",
      title: "图片管理"
    },
    component: Main,
    children: [
      {
        path: 'image-list',
        name: 'image-list',
        meta: {
          title: '图片列表'
        },
        component: () => import('@/view/image/image-list')
      },
      {
        path: 'image-upload',
        name: 'image-upload',
        meta: {
          title: '图片上传'
        },
        component: () => import('@/view/image/image-upload')
      }
    ]
  },
  {
    path: '/link',
    name: 'link',
    meta: {
      icon: "md-link",
      title: "链接管理"
    },
    component: Main,
    children: [
      {
        path: 'link-list',
        name: 'link-list',
        meta: {
          title: '链接列表'
        },
        component: () => import('@/view/link/link-list')
      },
      {
        path: 'link-add',
        name: 'link-add',
        meta: {
          title: '链接新增'
        },
        component: () => import('@/view/link/link-add')
      },
      {
        path: 'link-detail',
        name: 'link-detail',
        meta: {
          title: '链接详情',
          hideInMenu: true
        },
        component: () => import('@/view/link/link-detail')
      }
    ]
  },
  {
    path: '/linkType',
    name: 'linkType',
    meta: {
      icon: "ios-keypad",
      title: "链接类型管理"
    },
    component: Main,
    children: [
      {
        path: 'linkType-list',
        name: 'linkType-list',
        meta: {
          title: '链接类型列表'
        },
        component: () => import('@/view/linkType/linkType-list')
      },
      {
        path: 'linkType-add',
        name: 'linkType-add',
        meta: {
          title: '链接类型新增'
        },
        component: () => import('@/view/linkType/linkType-add')
      },
      {
        path: 'linkType-detail',
        name: 'linkType-detail',
        meta: {
          title: '链接类型详情',
          hideInMenu: true
        },
        component: () => import('@/view/linkType/linkType-detail')
      }
    ]
  },
  {
    path: '/skill',
    name: 'skill',
    meta: {
      icon: "logo-buffer",
      title: "技能管理"
    },
    component: Main,
    children: [
      {
        path: 'skill-list',
        name: 'skill-list',
        meta: {
          title: '技能列表'
        },
        component: () => import('@/view/skill/skill-list')
      },
      {
        path: 'skill-add',
        name: 'skill-add',
        meta: {
          title: '技能新增'
        },
        component: () => import('@/view/skill/skill-add')
      },
      {
        path: 'skill-detail',
        name: 'skill-detail',
        meta: {
          title: '技能详情',
          hideInMenu: true
        },
        component: () => import('@/view/skill/skill-detail')
      }
    ]
  },
  {
    path: '/timeline',
    name: 'timeline',
    meta: {
      icon: "md-podium",
      title: "时间轴管理"
    },
    component: Main,
    children: [
      {
        path: 'timeline-list',
        name: 'timeline-list',
        meta: {
          title: '时间轴列表'
        },
        component: () => import('@/view/timeline/timeline-list')
      },
      {
        path: 'timeline-add',
        name: 'timeline-add',
        meta: {
          title: '时间轴新增'
        },
        component: () => import('@/view/timeline/timeline-add')
      },
      {
        path: 'timeline-detail',
        name: 'timeline-detail',
        meta: {
          title: '时间轴详情',
          hideInMenu: true
        },
        component: () => import('@/view/timeline/timeline-detail')
      },
      {
        path: 'timeline-log',
        name: 'timeline-log',
        meta: {
          title: '时间轴日志'
        },
        component: () => import('@/view/timeline/timeline-log')
      }
    ]
  },
  {
    path: '/role',
    name: 'role',
    meta: {
      icon: "ios-people",
      title: "角色管理"
    },
    component: Main,
    children: [
      {
        path: 'role-list',
        name: 'role-list',
        meta: {
          title: '角色列表'
        },
        component: () => import('@/view/role/role-list')
      },
      {
        path: 'role-add',
        name: 'role-add',
        meta: {
          title: '角色新增'
        },
        component: () => import('@/view/role/role-add')
      },
      {
        path: 'role-detail',
        name: 'role-detail',
        meta: {
          title: '角色详情',
          hideInMenu: true
        },
        component: () => import('@/view/role/role-detail')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: "md-person",
      title: "用户管理"
    },
    component: Main,
    children: [
      {
        path: 'user-list',
        name: 'user-list',
        meta: {
          title: '用户列表'
        },
        component: () => import('@/view/user/user-list')
      },
      {
        path: 'user-add',
        name: 'user-add',
        meta: {
          title: '用户新增'
        },
        component: () => import('@/view/user/user-add')
      },
      {
        path: 'user-detail',
        name: 'user-detail',
        meta: {
          title: '用户详情',
          hideInMenu: true
        },
        component: () => import('@/view/user/user-detail')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Main,
    meta: {
      hideInBread: true,
      hideInMenu: true
    },
    children: [
      {
        path: 'message_page',
        name: 'message_page',
        meta: {
          icon: 'md-notifications',
          title: '消息中心'
        },
        component: () => import('@/view/single-page/message/index.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
