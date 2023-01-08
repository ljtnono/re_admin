import Vuex from "vuex";
import Vue from "vue";
import common from "@/store/common";
import systemSetting from "@/store/systemSetting";
import user from "@/store/user";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
// 注册上面引入的各大模块
const store = new Vuex.Store({
  modules: {
    systemSetting,
    common,
    user
  },
  mutations: {
    logout(state) {
      state["user/userInfo"] = null;
      state["user/tokenInfo"] = null;
      state["user/menus"] = null;
      state["systemSetting/breadcrumbList"] = null;
      state["common/categoryList"] = null;
      state["common/tagList"] = null;
    }
  },
  // 配置插件
  plugins: [
    // 该插件默认把state里面的数据存储在localStorage里面
    createPersistedState({
      // 本地存储的key
      key: "re_admin_state",
      // 指定需要存储的模块
      paths: ["systemSetting", "common", "user"],
      storage: window.sessionStorage
    })
  ]
});

// 导出store并在 main.js中引用注册
export default store;
