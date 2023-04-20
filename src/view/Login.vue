<template>
  <div class="login">
    <LoginForm
      :verify-code-image-url="verifyCodeImageUrl"
      @submit="submit"
      @refreshVerifyCode="refreshVerifyCode"/>
  </div>
</template>

<script>
import LoginForm from "@c/LoginForm";
import {ROUT_WORKSPACE_NAME} from "@/constant/commonConstant";
import router from "@/router";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import {login, refreshVerifyCode} from "@/api/auth";
import randomUtil from "@/util/randomUtil";
import {findRouteList} from "@/api/route";
import routeUtil from "@/util/routeUtil";
export default {
  name: "Login",
  data() {
    return {
      verifyCodeImageUrl: null,
      verifyCodeKey: null
    };
  },
  components: {
    LoginForm
  },
  methods: {
    // 刷新用户验证码
    refreshVerifyCode() {
      let that = this;
      let verifyCodeKey = randomUtil.getUUID();
      that.verifyCodeKey = verifyCodeKey;
      refreshVerifyCode(verifyCodeKey).then(res => {
        let data = res.data.data;
        that.verifyCodeImageUrl = "data:image/jpeg;base64," + data;
      });
    },

    // 用户登录
    async submit(username, password, verifyCode) {
      // 调用之前显示加载中
      let that = this;
      that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      await login(username, password, that.verifyCodeKey, verifyCode).then(async (res) => {
        let outerData = res.data;
        let innerData = outerData.data;
        let userInfo = innerData.userInfo;
        let tokenInfo = innerData.tokenInfo;
        let menus = innerData.menus;
        this.$store.commit("user/login", {userInfo, tokenInfo, menus});
        // 跳转到home页面
        this.$message({
          type: "success",
          message: "登录成功",
          duration: 2000,
          center: false,
        });

        // 获取路由
        await findRouteList().then(res => {
          let data = res.data.data;
          let routeList = [];
          let existRouteNameList = router.getRoutes().map(vueRoute => {
            return vueRoute.name;
          });
          // 生成组件列表
          data.forEach(route => {
            routeList.push(route);
            if (!existRouteNameList.includes(route.name)) {
              router.addRoute(routeUtil.dfsRouteList(route));
            }
          });
          this.$store.commit("systemSetting/changeRouteList", routeList);
        });
        await router.push({
          name: ROUT_WORKSPACE_NAME
        });
        that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
      }).catch(e => {
        that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
      });
    },
  },
  mounted() {
    // 页面渲染完成，调用接口获取验证码
    this.refreshVerifyCode();
  },
};
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
