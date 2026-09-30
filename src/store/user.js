import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null,
    tokenInfo: null,
    menus: null
  }),
  actions: {
    // 登录
    login(payload) {
      this.userInfo = payload.userInfo;
      this.tokenInfo = payload.tokenInfo;
      this.menus = payload.menus;
    },
    // 更新用户信息
    changeUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    // 注销/退出登录
    logout() {
      this.userInfo = null;
      this.tokenInfo = null;
      this.menus = null;
    }
  },
  persist: {
    storage: sessionStorage
  }
});
