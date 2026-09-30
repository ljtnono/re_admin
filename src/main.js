import { createApp } from "vue";
import * as echarts from "echarts";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import App from "@/App.vue";
import router from "@/router";
import pinia from "@/store";
import RouteUtil from "@/util/routeUtil";
import { useSystemSettingStore } from "@/store/systemSetting";
import "@a/css/style.min.css";
import "@a/iconfont/iconfont.css";
import "@a/scss/table.scss";
import { config as mdEditorConfig } from "md-editor-v3";

// md-editor-v3 全局配置：关闭 KaTeX 严格模式，避免中文内容里的 $ 被当作公式时刷屏控制台警告
mdEditorConfig({
  katexConfig(base) {
    return {
      ...base,
      strict: false
    };
  }
});

const app = createApp(App);
app.config.globalProperties.$echarts = echarts;
app.use(pinia);

// 刷新页面后，从持久化的路由列表恢复动态路由
// 注意：必须在 app.use(router) 之前注册，否则首屏导航匹配不到动态路由会落到 404
const systemSettingStore = useSystemSettingStore();
const routeList = systemSettingStore.routeList;
if (routeList && routeList.length > 0) {
  const existRouteNameSet = new Set(router.getRoutes().map((route) => route.name));
  routeList.forEach((route) => {
    if (!existRouteNameSet.has(route.name)) {
      router.addRoute(RouteUtil.dfsRouteList(route));
    }
  });
}

app.use(router);
app.use(ElementPlus, { locale: zhCn });
app.mount("#app");

// 开发环境调试句柄（排查问题用）
if (import.meta.env.DEV) {
  Promise.all([import("@/store/user"), import("@/store/systemSetting")]).then(
    ([{ useUserStore }, { useSystemSettingStore: useSystemSettingStoreFn }]) => {
      window.__RE_ADMIN_DEBUG__ = {
        router,
        RouteUtil,
        useUserStore,
        useSystemSettingStore: useSystemSettingStoreFn
      };
    }
  );
}
