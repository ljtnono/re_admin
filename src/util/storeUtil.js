import { useUserStore } from "@/store/user";
import { useSystemSettingStore } from "@/store/systemSetting";
import { useCommonStore } from "@/store/common";

/**
 * 全局注销：清空所有store并清除sessionStorage中的持久化数据
 */
export const globalLogout = () => {
  useUserStore().logout();
  useSystemSettingStore().$reset();
  useCommonStore().$reset();
  window.sessionStorage.removeItem("user");
  window.sessionStorage.removeItem("systemSetting");
  window.sessionStorage.removeItem("common");
};

export default globalLogout;
