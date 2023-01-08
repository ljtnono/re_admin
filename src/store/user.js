const user = {
  namespaced: true,
  state: () => ({
    userInfo: null,
    tokenInfo: null,
    menus: null
  }),
  getters:{},
  actions:{

  },
  mutations:{
    // 修改用户信息
    changeUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 修改token信息
    changeTokenInfo(state, tokenInfo) {
      state.tokenInfo = tokenInfo;
    },
    // 修改菜单信息
    changeMenus(state, menus) {
      state.menus = menus;
    },
    // 登录
    login(state, payload) {
      state.userInfo = payload.userInfo;
      state.tokenInfo = payload.tokenInfo;
      state.menus = payload.menus;
    }
  }
};

export default user;
