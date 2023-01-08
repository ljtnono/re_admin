import Vuex from "vuex";
import Vue from "vue";
import common from "@/store/common";
import systemSetting from "@/store/systemSetting";
import user from "@/store/user";

Vue.use(Vuex);
// 注册上面引入的各大模块
const store = new Vuex.Store({
  modules: {
    systemSetting,
    common,
    user
  }
});

// 导出store并在 main.js中引用注册
export default store;
