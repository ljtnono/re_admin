const systemSetting = {
  namespaced: true,
  state: () => ({
    // 面包屑列表
    breadcrumbList: null,
    routeList: []
  }),
  getters:{},
  actions:{

  },
  mutations:{
    // 修改面包屑列表
    changeBreadcrumbList(state, breadcrumbList) {
      state.breadcrumbList = breadcrumbList;
    },
    // 修改路由列表
    changeRouteList(state, routeList) {
      state.routeList = routeList;
    }
  }
};

export default systemSetting;
