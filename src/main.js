import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import moment from "moment";
import config from '@/config'
import mavonEditor from 'mavon-editor'
import './index.less'
import '@/assets/icons/iconfont.css'
import 'mavon-editor/dist/css/index.css'

Vue.use(mavonEditor);
Vue.use(iView);

/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false;

/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config;

// 配置全局过滤器
Vue.filter("timeFormat", function (time) {
  return moment(time).format("YYYY-MM-DD");
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
