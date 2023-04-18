export default [
  {
    path: "/",
    name: "Root",
    redirect: {
      name: "Login"
    }
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "Login - 登录",
      hideInMenu: true
    },
    component: () => import("@v/Login.vue")
  },
  {
    path: "*",
    name: "NotFound",
    meta: {
      title: "404",
      name: "找不到页面",
      hideInMenu: true
    },
    component: () => import("@v/error/NotFound.vue")
  }
];
