import { defineStore } from "pinia";

export const useSystemSettingStore = defineStore("systemSetting", {
  state: () => ({
    // 面包屑列表
    breadcrumbList: [],
    // 当前面包屑导航列表
    currentBreadcrumbList: [],
    // 后端下发的路由列表
    routeList: []
  }),
  actions: {
    changeBreadcrumbList(breadcrumbList) {
      this.breadcrumbList = breadcrumbList;
    },
    changeRouteList(routeList) {
      this.routeList = routeList;
    },
    changeCurrentBreadcrumbList(currentBreadcrumbList) {
      this.currentBreadcrumbList = currentBreadcrumbList;
    }
  },
  persist: {
    storage: sessionStorage
  }
});
