<template>
  <el-card id="login-card" class="box-card m20">
    <!-- 登录提示头 -->
    <div slot="header" class="clearfix">
      <span>欢迎登录</span>
    </div>
    <!--登录表单-->
    <el-form class="login-form" ref="loginForm" :model="loginForm" :rule="rules">
      <el-form-item prop="username">
        <el-input class="input-text fr" v-model="loginForm.username" prefix-icon="el-icon-user-solid"
          placeholder="请输入用户名" clearable maxlength="50" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input class="input-password fr" prefix-icon="el-icon-lock" v-model="loginForm.password" placeholder="请输入密码"
          show-password clearable />
      </el-form-item>
      <el-button class="btn-submit" type="primary" @click="submitForm">登录</el-button>
    </el-form>
  </el-card>
</template>

<script>
import router from '../router';

export default {
  name: 'LoginForm',
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  methods: {
    submitForm() {
      this.$refs.loginForm.validate((valid, fields) => {
        if (valid) {
          router.push({
            name: "Home"
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  },
  props: {

  },
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

    .btn-submit {
      width: 100%;
      height: 40px;
    }
  }
}
</style>