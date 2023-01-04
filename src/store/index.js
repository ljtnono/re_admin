import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);
const systemSetting = {
  namespaced: true,
  state: () => ({
    // 面包屑列表
    breadcrumbList: null
  }),
  getters:{},
  actions:{

  },
  mutations:{
    // 修改面包屑列表
    changeBreadcrumbList(state, breadcrumbList) {
      state.breadcrumbList = breadcrumbList;
    }
  }
};

// 注册上面引入的各大模块
const store = new Vuex.Store({
  modules: {
    systemSetting
  }
});

// 导出store并在 main.js中引用注册
export default store
