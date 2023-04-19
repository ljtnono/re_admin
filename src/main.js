import Vue from "vue";
import Router from "vue-router";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import App from "@/App.vue";
import router from "@/router";
import "@a/css/style.min.css";
import "@a/iconfont/iconfont.css";
import axios from "@/config/axiosConfig";
import store from "@/store"
import * as echarts from "echarts";
import DateUtil from "@/util/dateUtil";
import {BASE_URL} from "@/constant/commonConstant";

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;

// 使用ElementUI
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(mavonEditor);
Vue.use(Router);
// 全局过滤器
Vue.filter("dateFormat", function(value, style) {
  return DateUtil.format(value, style);
});

/**
 * 深度优先算法处理路由列表
 *
 * @param route 菜单路由对象
 * @returns {{redirect: (any|null), path, component: (function(): Promise<*>), meta: any, name, props}}
 */
function dfsRouteList(route) {
  let componentPath = route.component.substring("src/view/".length);
  let routeConfig = {
    name: route.name,
    path: route.path,
    redirect: route.redirect ? JSON.parse(route.redirect) : null,
    props: route.props,
    meta: JSON.parse(route.meta),
    component: () => import("@v/" + componentPath)
  };
  let childrenSource = route.children;
  if (childrenSource === null || childrenSource === []) {
    routeConfig.children = [];
    return routeConfig;
  }
  routeConfig.children = childrenSource.map(child => {
    return dfsRouteList(child);
  });
  return routeConfig;
}

axios.get(BASE_URL + "/api-backend/route/list").then(res => {
  let data = res.data.data;
  // 生成组件列表
  data.forEach(route => {router.addRoute(dfsRouteList(route))});
});

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount("#app");
