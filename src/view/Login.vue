<template>
  <div class="login">
    <LoginForm
      :verify-code-image-url="verifyCodeImageUrl"
      @submit="submit"
      @refreshVerifyCode="refreshVerifyCode"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import LoginForm from "@c/LoginForm.vue";
import { ROUT_WORKSPACE_NAME } from "@/constant/commonConstant";
import router from "@/router";
import { ELEMENT_PAGE_LOADING_CONFIG } from "@/config/commonConfig";
import { login, refreshVerifyCode as fetchVerifyCode } from "@/api/auth";
import randomUtil from "@/util/randomUtil";
import { findRouteList } from "@/api/route";
import routeUtil from "@/util/routeUtil";
import { findBreadcrumbList } from "@/api/menu";
import { useUserStore } from "@/store/user";
import { useSystemSettingStore } from "@/store/systemSetting";

defineOptions({ name: "Login" });

const verifyCodeImageUrl = ref(null);
const verifyCodeKey = ref(null);

const userStore = useUserStore();
const systemSettingStore = useSystemSettingStore();

// 刷新用户验证码
const refreshVerifyCode = () => {
  const key = randomUtil.getUUID();
  verifyCodeKey.value = key;
  fetchVerifyCode(key).then((res) => {
    const data = res.data.data;
    verifyCodeImageUrl.value = "data:image/jpeg;base64," + data;
  });
};

// 用户登录
const submit = async (username, password, verifyCode) => {
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  try {
    const loginRes = await login(username, password, verifyCodeKey.value, verifyCode);
    const innerData = loginRes.data.data;
    userStore.login({
      userInfo: innerData.userInfo,
      tokenInfo: innerData.tokenInfo,
      menus: innerData.menus
    });
    ElMessage.success({
      message: "登录成功",
      duration: 2000,
      center: false
    });

    // 获取路由
    const routeRes = await findRouteList();
    const routeList = routeRes.data.data;
    const existRouteNameSet = new Set(router.getRoutes().map((route) => route.name));
    routeList.forEach((route) => {
      if (!existRouteNameSet.has(route.name)) {
        router.addRoute(routeUtil.dfsRouteList(route));
      }
    });
    systemSettingStore.changeRouteList(routeList);

    // 获取面包屑导航
    const breadcrumbRes = await findBreadcrumbList();
    systemSettingStore.changeBreadcrumbList(breadcrumbRes.data.data);

    await router.push({
      name: ROUT_WORKSPACE_NAME
    });
  } catch (e) {
    // 错误消息已由axios响应拦截器统一弹出
  } finally {
    loading.close();
  }
};

onMounted(() => {
  // 页面渲染完成，调用接口获取验证码
  refreshVerifyCode();
});
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url("@a/images/login-bg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>
