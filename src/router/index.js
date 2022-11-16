import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import {ROUT_HOME_NAME} from "@/constant/commonConstant";
import message from "element-ui/packages/message";

Vue.use(Router);

// 创建导航，使用历史模式
const router = new Router({
  routes,
  base: '/',
  mode: "history"
});

// 特殊页面数组
const SPECIAL_PAGES = [
  "/login",
  "/404",
  "/500",
  "/401"
]

// 设置路由守卫
router.beforeEach((to, from, next) => {
  let toPath = to.path;
  let toName = to.name;
  // TODO 如果token存在，并且路由路径为/,那么直接跳转到工作台页面
  if (toPath === "/" + ROUT_HOME_NAME) {
    next({name: "Workspace"})
  }
  // 除了特殊页面之外，如果跳转到正常页面，需要校验token等信息是否存在
  if (!SPECIAL_PAGES.includes(toPath)) {
    let userInfo = sessionStorage.getItem("userInfo");
    let tokeInfo = sessionStorage.getItem("tokenInfo");
    let menus = sessionStorage.getItem("menus");

    if (menus && tokeInfo && userInfo) {
      next();
    } else {
      message.error({
        message: "用户未认证"
      });
      next({name: "Login"});
    }
  }

  next();
});

export default router;
