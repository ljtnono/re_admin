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

axios.get(BASE_URL + "/api-backend/route/list").then(res => {
  let data = res.data.data;
  // 生成组件列表
  data.forEach(route => {
    let childrenSource = route.children;
    let children = [];
    if (childrenSource !== [] && childrenSource.length !== 0) {
      children = childrenSource.map(child => {
        let componentPath = child.component.substring(child.component.lastIndexOf("/") + 1);
        return {
          name: child.name,
          path: child.path,
          redirect: child.redirect ? JSON.parse(child.redirect) : null,
          props: child.props,
          meta: JSON.parse(child.meta),
          component: () => import("@v/" + componentPath)
        }
      });
    }
    let componentPath = route.component.substring(route.component.lastIndexOf("/") + 1);
    let routeConfig = {
      name: route.name,
      path: route.path,
      redirect: route.redirect ? JSON.parse(route.redirect) : null,
      props: route.props,
      meta: JSON.parse(route.meta),
      children: children,
      component: () => import("@v/" + componentPath)
    };
    router.addRoute(routeConfig);
  });
});

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount("#app");
