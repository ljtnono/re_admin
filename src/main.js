import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "@a/css/style.min.css";
import "../src/assets/iconfont/iconfont.css";
import "element-ui/lib/theme-chalk/index.css";
import axios from "@/config/axiosConfig";
// 引入echarts
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
// 使用ElementUI
Vue.use(ElementUI);
Vue.use(VueAxios, axios);

new Vue({
  render: (h) => h(App),
  router,
}).$mount("#app");
