import Vue from "vue";
import App from "./App.vue";
import router from './router';
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from 'element-ui';

import "element-ui/lib/theme-chalk/index.css";
import "@a/css/style.min.css";

Vue.config.productionTip = false

// 使用ElementUI
Vue.use(ElementUI);
Vue.use(VueAxios, axios);

new Vue({
  render: h => h(App),
  router,
}).$mount('#app');
