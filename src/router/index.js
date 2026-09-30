import { createRouter, createWebHistory } from "vue-router";
import { ElMessage } from "element-plus";
import staticRoutes from "@/router/routes";
import { ROUT_HOME_NAME } from "@/constant/commonConstant";
import { useUserStore } from "@/store/user";
import { useSystemSettingStore } from "@/store/systemSetting";

// 创建导航，使用历史模式
const router = createRouter({
  history: createWebHistory("/"),
  routes: staticRoutes
});

// 特殊页面数组
const SPECIAL_PAGES = ["/login", "/404", "/500", "/401"];

// 设置路由守卫
router.beforeEach((to, from, next) => {
  const toPath = to.path;
  const toName = to.name;
  const systemSettingStore = useSystemSettingStore();
  const currentBreadcrumbList = systemSettingStore.breadcrumbList.filter(
    (breadcrumb) => breadcrumb.routeName === toName
  );
  if (currentBreadcrumbList.length !== 0) {
    systemSettingStore.changeCurrentBreadcrumbList(currentBreadcrumbList[0]["breadcrumbList"]);
  }

  // 如果token存在，并且路由路径为/,那么直接跳转到工作台页面
  if (toPath === "/" + ROUT_HOME_NAME) {
    next({ name: "Workspace" });
    return;
  }
  // 除了特殊页面之外，如果跳转到正常页面，需要校验token等信息是否存在
  if (!SPECIAL_PAGES.includes(toPath)) {
    const userStore = useUserStore();
    if (userStore.menus && userStore.tokenInfo && userStore.userInfo) {
      next();
    } else {
      ElMessage.error({
        message: "用户未认证",
        duration: 2000,
        center: false
      });
      next({ name: "Login" });
    }
    return;
  }
  next();
});

export default router;
