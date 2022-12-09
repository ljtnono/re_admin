import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);
// 注册上面引入的各大模块
const store = new Vuex.Store({
  modules: {

  },
  state: {

  },
  getters:{},
  actions:{},
  mutations:{}
})

// 导出store并在 main.js中引用注册
export default store
