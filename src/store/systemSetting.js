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

export default systemSetting;
