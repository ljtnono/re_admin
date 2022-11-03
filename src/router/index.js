import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";

Vue.use(Router);

// 创建导航，使用历史模式
const router = new Router({
  routes,
  base: '/',
  mode: "history"
});

// 设置路由守卫
router.beforeEach((to, from, next) => {
  let toPath = to.path;
  if (toPath === "/") {
    next({ name: "Login" });
    return true;
  } else {
    next();
  }
});

export default router;
