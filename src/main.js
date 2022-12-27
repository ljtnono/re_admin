import Vue from "vue";
import App from "./App.vue";
import Router from "vue-router";
import router from "./router";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "@a/css/style.min.css";
import "@a/iconfont/iconfont.css";
import "element-ui/lib/theme-chalk/index.css";
import axios from "@/config/axiosConfig";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import store from "./store"
import * as echarts from "echarts";
import DateUtil from "@/util/dateUtil";

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

new Vue({
  render: (h) => h(App),
  router,
  store
}).$mount("#app");
