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
    component: () => import('@v/Home.vue')
  }
]
