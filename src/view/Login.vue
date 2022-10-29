<template>
  <div class="login">
    <LoginForm :verify-code-image-url="verifyCodeImageUrl" @submit="submit" @refreshVerifyCode="refreshVerifyCode"/>
  </div>
</template>

<script>

import LoginForm from '@c/LoginForm'
import axios from "axios";
import {HTTP_RESULT_SUCCESS_CODE, HTTP_RESULT_SUCCESS_MESSAGE, ROUT_HOME_NAME} from "@/constant/commonConstant";
import router from "@/router";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import '../mock/login'

export default {
  name: 'Login',
  data() {
    return {
      verifyCodeImageUrl: ""
    }
  },
  components: {
    LoginForm
  },
  methods: {
    // 刷新用户验证码
    refreshVerifyCode() {
      axios.get("/api-backend/refreshVerifyCode").then(res => {
        let outerData = res.data;
        if (outerData.code === HTTP_RESULT_SUCCESS_CODE && outerData.message === HTTP_RESULT_SUCCESS_MESSAGE) {
          let innerData = outerData.data;
          this.verifyCodeImageUrl = innerData;
        }
      });
    },
    // 用户登录
    submit(username, password, verifyCodeKey, verifyCode) {
      // 调用之前显示加载中
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      axios.post("/api-backend/login", {
        username,
        password,
        verifyCodeKey,
        verifyCode
      }).then(res => {
        let outerData = res.data;
        if (outerData.code === HTTP_RESULT_SUCCESS_CODE && outerData.message === HTTP_RESULT_SUCCESS_MESSAGE) {
          let innerData = outerData.data;
          // 将用户信息存在sessionStorage中
          let userInfo = innerData.userInfo;
          let tokenInfo = innerData.tokenInfo;
          let menus = innerData.menus;
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          sessionStorage.setItem("tokenInfo", JSON.stringify(tokenInfo));
          sessionStorage.setItem("menus", JSON.stringify(menus));
          // 跳转到home页面
          router.push({
            name: ROUT_HOME_NAME
          });
          this.$loading().close();
        } else {
          // TODO 弹出错误消息
          this.$loading().close();
        }
      });
    }
  },
  mounted() {
    // 页面渲染完成，调用接口获取验证码
    this.refreshVerifyCode();
  }
}

</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('../assets/images/login-bg.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
}
</style>
