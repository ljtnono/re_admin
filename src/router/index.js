import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import {ROUT_HOME_NAME} from "@/constant/commonConstant";

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
  let toName = to.name;
  // TODO 如果token存在，并且路由路径为/,那么直接跳转到工作台页面


  if (toPath === "/" + ROUT_HOME_NAME) {
    next({name: "Workspace"})
  } else {
    next();
  }
});

export default router;
