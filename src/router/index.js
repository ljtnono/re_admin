import Router from "vue-router";
// import routes from "./routers";
import axios from "@/config/axiosConfig";
import {BASE_URL} from "@/constant/commonConstant";
import { ROUT_HOME_NAME } from "@/constant/commonConstant";
import store from "@/store";
import RouteUtil from "@/util/routeUtil";
import ElementUI from "element-ui";

// 创建导航，使用历史模式
const router = new Router({
  routes: [],
  base: "/",
  mode: "history",
});
// 特殊页面数组
const SPECIAL_PAGES = ["/login", "/404", "/500", "/401"];
// 解决重复点击路由报错的BUG
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
}

// 动态获取路由列表
axios.get(BASE_URL + "/api-backend/route/list").then(res => {
  let data = res.data.data;
  for (let i = 0; i < data.length; i++) {
    let route = data[i];
    router.addRoute({
      name: route.name,
      path: route.path,
      // TODO 这里redirect可能为字符串，也可能是一个json对象，需要进行判断然后处理
      redirect: route.redirect ? JSON.parse(route.redirect) : null,
      props: route.props,
      alias: route.alias,
      meta: route.meta,
      component: route.component == null ? null :  () => import(route.component.replace(/^.*\('@(.+)'\).*$/, "$1"))
    });
  }
});

// 设置路由守卫
router.beforeEach((to, from, next) => {
  let toPath = to.path;
  let toName = to.name;
  // 设置面包屑导航
  let breadcrumbList = RouteUtil.getBreadcrumb(toName);
  store.commit("systemSetting/changeBreadcrumbList", breadcrumbList);

  // 如果token存在，并且路由路径为/,那么直接跳转到工作台页面
  if (toPath === "/" + ROUT_HOME_NAME) {
    next({ name: "Workspace" });
  }
  // 除了特殊页面之外，如果跳转到正常页面，需要校验token等信息是否存在
  if (!SPECIAL_PAGES.includes(toPath)) {
    let userInfo = store.state.user.userInfo;
    let tokeInfo = store.state.user.tokenInfo;
    let menus = store.state.user.menus;
    if (menus && tokeInfo && userInfo) {
      next();
    } else {
      // 弹出错误消息
      ElementUI.Message.error({
        message: "用户未认证",
        duration: 2000,
        center: false
      });
      next({ name: "Login" });
    }
  }

  next();
});

export default router;
