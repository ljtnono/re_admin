<template>
  <el-card id="login-card" class="box-card m20" @keyup.enter="commit">
    <!-- 登录提示头 -->
    <template #header>
      <div class="clearfix">
        <span>欢迎登录</span>
      </div>
    </template>
    <!--登录表单-->
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="rules"
      ref="loginFormRef">
      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input
          class="fr"
          v-model="loginForm.username"
          :prefix-icon="User"
          placeholder="请输入用户名"
          clearable
          maxlength="50"/>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          class="fr"
          :prefix-icon="Lock"
          v-model="loginForm.password"
          placeholder="请输入密码"
          show-password
          clearable/>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="verifyCode">
        <el-input
          class="fl mr20"
          placeholder="请输入验证码"
          v-model="loginForm.verifyCode"
          style="width: 200px"/>
        <img
          class="verify-code-img fl"
          :src="verifyCodeImageUrl"
          @click="refresh()"/>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item>
        <el-button
          class="btn-submit"
          type="primary"
          @click="commit">
          登录
        </el-button>
        <div class="forget-password">
          <span class="forget-password__link" @click="forgetPasswordVisible = true">忘记密码？</span>
        </div>
      </el-form-item>
    </el-form>
    <!-- 忘记密码弹窗 -->
    <ForgetPasswordDialog v-model="forgetPasswordVisible"/>
  </el-card>
</template>

<script setup>
import { ref, reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { LOGIN_PASSWORD_REGEX, LOGIN_USERNAME_REGEX } from "@/constant/regexConstant";
import ForgetPasswordDialog from "@c/ForgetPasswordDialog.vue";
import {
  LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE,
  LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE,
  LOGIN_USERNAME_EMPTY_ERROR_MESSAGE,
  LOGIN_USERNAME_FORMAT_ERROR_MESSAGE,
  LOGIN_VERIFY_CODE_EMPTY_ERROR_MESSAGE
} from "@/constant/errorMessageConstant";

defineOptions({ name: "LoginForm" });

defineProps({
  verifyCodeImageUrl: String
});

const emit = defineEmits(["submit", "refreshVerifyCode"]);

// 忘记密码弹窗是否显示
const forgetPasswordVisible = ref(false);
const loginFormRef = ref(null);

const loginForm = reactive({
  username: "",
  password: "",
  verifyCode: ""
});

const rules = {
  username: [
    {
      required: true,
      message: LOGIN_USERNAME_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    },
    {
      pattern: LOGIN_USERNAME_REGEX,
      message: LOGIN_USERNAME_FORMAT_ERROR_MESSAGE,
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    },
    {
      pattern: LOGIN_PASSWORD_REGEX,
      message: LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE,
      trigger: "blur"
    }
  ],
  verifyCode: [
    {
      required: true,
      message: LOGIN_VERIFY_CODE_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    }
  ]
};

const refresh = () => {
  emit("refreshVerifyCode");
};

const commit = () => {
  loginFormRef.value.validate((valid) => {
    // 校验成功，请求登录接口
    if (valid) {
      emit("submit", loginForm.username, loginForm.password, loginForm.verifyCode);
    }
  });
};
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

    :deep(.el-form-item:nth-child(2)) {
      margin-bottom: 30px;
    }

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

    .forget-password {
      margin-top: 10px;
      text-align: right;

      &__link {
        font-size: 13px;
        color: #409eff;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
