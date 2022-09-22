import Vue from "vue"
import App from "./App.vue"
import ElementUI from "element-ui";
import axios from "axios";
import VueAxios from "vue-axios";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false


// 使用ElementUI
Vue.use(ElementUI);
Vue.use(VueAxios, axios);

new Vue({
  render: h => h(App),
}).$mount('#app');
