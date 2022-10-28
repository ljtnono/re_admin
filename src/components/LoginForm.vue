<template>
  <el-card id="login-card" class="box-card m20">
    <!-- 登录提示头 -->
    <div slot="header" class="clearfix">
      <span>欢迎登录</span>
    </div>
    <!--登录表单-->
    <el-form class="login-form" :model="loginForm" :rules="rules" ref="loginForm">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input class="input-text fr" v-model="loginForm.username" prefix-icon="el-icon-user-solid"
                  placeholder="请输入用户名" clearable maxlength="50"/>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input class="input-password fr" prefix-icon="el-icon-lock" v-model="loginForm.password"
                  placeholder="请输入密码" show-password clearable/>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="verifyCode">
        <el-input class="input-password fl mr20" placeholder="请输入验证码" v-model="loginForm.verifyCode" style="width: 200px"/>
        <img class="verify-code-img fl"  :src="verifyCodeImageUrl" @click="refresh()"/>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item>
        <el-button class="btn-submit" type="primary" @click="commit('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'LoginForm',
  data() {
    return {
      verifyCodeKey: "",
      loginForm: {
        username: "",
        password: "",
        verifyCode: ""
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        verifyCode: [
          {required: true, message: '请输入验证码', trigger: 'blur'}
        ]
      }
    }
  },
  props: {
    verifyCodeImageUrl: String
  },
  computed: {},
  methods: {
    refresh() {
      this.$emit("refreshVerifyCode");
    },
    commit(formName) {
      // 开启进度栏
      this.$refs[formName].validate((valid) => {
        // 校验成功，请求登录接口
        if (valid) {
          console.log("fdaf")
          this.$emit("submit", this.loginForm);
          return true;
        } else {
          return false;
        }
      });
    },

  }
}
</script>

<style lang="scss" scoped>
#login-card {
  position: absolute;
  right: 160px;
  top: 50%;
  transform: translateY(-60%);
  width: 400px;

  .login-form {
    width: 100%;
    height: 100%;

    .verify-code-img {
      display: block;
      width: 100px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
    }

    .btn-submit {
      width: 100%;
      height: 40px;
    }
  }
}
</style>
