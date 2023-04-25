const systemSetting = {
  namespaced: true,
  state: () => ({
    // 面包屑列表
    breadcrumbList: null,
    // 当前面包屑导航列表
    currentBreadcrumbList: null,
    routeList: []
  }),
  getters:{
  },
  actions:{

  },
  mutations:{
    changeBreadcrumbList(state, breadcrumbList) {
      state.breadcrumbList = breadcrumbList;
    },
    changeRouteList(state, routeList) {
      state.routeList = routeList;
    },
    // 修改面包屑列表
    changeCurrentBreadcrumbList(state, currentBreadcrumbList) {
      state.currentBreadcrumbList = currentBreadcrumbList;
    },
  }
};

export default systemSetting;
