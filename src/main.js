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
import routeUtil from "@/util/routeUtil";

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

let routeList = store.state.systemSetting.routeList;
let existRouteNameList = router.getRoutes().map(vueRoute => {
  return vueRoute.name;
});
if (routeList !== [] || routeList.length !== 0) {
  routeList.forEach(route => {
    if (!existRouteNameList.includes(route.name)) {
      router.addRoute(routeUtil.dfsRouteList(route));
    }
  });
}

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount("#app");
