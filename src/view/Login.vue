<template>
  <div class="login">
    <LoginForm
      :verify-code-image-url="verifyCodeImageUrl"
      @submit="submit"
      @refreshVerifyCode="refreshVerifyCode"
    />
  </div>
</template>

<script>
import LoginForm from "@c/LoginForm";
import {ROUT_WORKSPACE_NAME} from "@/constant/commonConstant";
import router from "@/router";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import {refreshVerifyCode, login} from "@/api/auth";
import randomUtil from "@/util/randomUtil";

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
        let b = new window.Blob([res.data], {type: "image/jpeg"});
        let url = window.URL.createObjectURL(b);
        that.verifyCodeImageUrl = url;
      });
    },
    // 用户登录
    async submit(username, password, verifyCode) {
      // 调用之前显示加载中
      let that = this;
      that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      await login(username, password, that.verifyCodeKey, verifyCode).then((res) => {
        let outerData = res.data;
        let innerData = outerData.data;
        // 将用户信息存在sessionStorage中
        let userInfo = innerData.userInfo;
        let tokenInfo = innerData.tokenInfo;
        let menus = innerData.menus;
        sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
        sessionStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
        sessionStorage.setItem("menus", JSON.stringify(menus));
        // 跳转到home页面
        this.$message({
          type: "success",
          message: "登录成功",
          duration: 2000,
          center: false,
        });
        router.push({
          name: ROUT_WORKSPACE_NAME
        });
        that.$loading().close();
      }).catch(e => {
        that.$loading().close();
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
