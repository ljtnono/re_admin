<template>
  <el-dialog
    title="找回密码"
    v-model="visible"
    width="640px"
    append-to-body
    :close-on-click-modal="false"
    @closed="handleClosed">
    <el-steps class="steps" :active="stepActive" finish-status="success" align-center>
      <el-step title="验证身份"/>
      <el-step title="设置新密码"/>
      <el-step title="重置成功"/>
    </el-steps>

    <!-- 第一步：验证身份 -->
    <div v-show="stepActive === 0" class="form-area">
      <el-form ref="validateFormRef" :model="validateForm" :rules="validateFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="validateForm.username"
            :prefix-icon="User"
            clearable
            placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="绑定邮箱" prop="email">
          <el-input
            v-model="validateForm.email"
            :prefix-icon="Message"
            clearable
            placeholder="请输入账号绑定的邮箱"/>
        </el-form-item>
        <el-form-item label="邮箱验证码" prop="code">
          <div class="code-row">
            <el-input
              v-model="validateForm.code"
              maxlength="6"
              placeholder="6位数字验证码"/>
            <el-button
              :disabled="sendCountdown > 0 || sending"
              :loading="sending"
              @click="sendCode">
              {{ sendCountdown > 0 ? sendCountdown + "s后重发" : "发送验证码" }}
            </el-button>
          </div>
          <p class="form-tip">验证码将发送至账号绑定的邮箱，5分钟内有效</p>
        </el-form-item>
      </el-form>
    </div>

    <!-- 第二步：设置新密码 -->
    <div v-show="stepActive === 1" class="form-area">
      <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordFormRules" label-width="100px">
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="passwordForm.password"
            show-password
            clearable
            placeholder="6-20位，须包含大小写字母和数字"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="rePassword">
          <el-input
            v-model="passwordForm.rePassword"
            show-password
            clearable
            placeholder="请再次输入新密码"/>
        </el-form-item>
      </el-form>
    </div>

    <!-- 第三步：重置成功 -->
    <div v-show="stepActive === 2" class="success-area">
      <CircleCheckFilled class="success-area__icon"/>
      <p class="success-area__text">密码重置成功，请使用新密码登录</p>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <template v-if="stepActive === 0">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="goNext">下一步</el-button>
        </template>
        <template v-else-if="stepActive === 1">
          <el-button @click="stepActive = 0">上一步</el-button>
          <el-button type="primary" :loading="submitting" @click="submitReset">确认重置</el-button>
        </template>
        <el-button v-else type="primary" @click="visible = false">去登录</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { User, Message, CircleCheckFilled } from "@element-plus/icons-vue";
import {
  LOGIN_USERNAME_REGEX,
  LOGIN_PASSWORD_REGEX,
  USER_ADD_EMAIL_REGEX
} from "@/constant/regexConstant";
import {
  LOGIN_USERNAME_EMPTY_ERROR_MESSAGE,
  LOGIN_USERNAME_FORMAT_ERROR_MESSAGE,
  LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE,
  LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE,
  USER_ADD_EMAIL_EMPTY_ERROR_MESSAGE,
  USER_ADD_EMAIL_FORMAT_ERROR_MESSAGE
} from "@/constant/errorMessageConstant";
import { sendForgetPasswordEmailCode, resetPasswordByEmailCode } from "@/api/user";

defineOptions({ name: "ForgetPasswordDialog" });

const visible = defineModel({ type: Boolean, default: false });

const validateFormRef = ref(null);
const passwordFormRef = ref(null);

// 当前步骤
const stepActive = ref(0);
// 发送验证码请求中
const sending = ref(false);
// 提交重置请求中
const submitting = ref(false);

// 第一步表单
const validateForm = reactive({
  username: "",
  email: "",
  code: ""
});

// 第一步表单校验规则
const validateFormRules = {
  username: [
    {required: true, message: LOGIN_USERNAME_EMPTY_ERROR_MESSAGE, trigger: "blur"},
    {pattern: LOGIN_USERNAME_REGEX, message: LOGIN_USERNAME_FORMAT_ERROR_MESSAGE, trigger: "blur"}
  ],
  email: [
    {required: true, message: USER_ADD_EMAIL_EMPTY_ERROR_MESSAGE, trigger: "blur"},
    {pattern: USER_ADD_EMAIL_REGEX, message: USER_ADD_EMAIL_FORMAT_ERROR_MESSAGE, trigger: "blur"}
  ],
  code: [
    {required: true, message: "请输入邮箱验证码", trigger: "blur"},
    {pattern: /^\d{6}$/, message: "验证码为6位数字", trigger: "blur"}
  ]
};

// 第二步表单
const passwordForm = reactive({
  password: "",
  rePassword: ""
});

// 第二步表单校验规则
const passwordFormRules = {
  password: [
    {required: true, message: LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE, trigger: "blur"},
    {pattern: LOGIN_PASSWORD_REGEX, message: LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE, trigger: "blur"}
  ],
  rePassword: [
    {required: true, message: "请再次输入新密码", trigger: "blur"},
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.password) {
          return callback(new Error("两次输入的密码不一致"));
        }
        return callback();
      },
      trigger: "blur"
    }
  ]
};

// 发送验证码倒计时（秒）
const sendCountdown = ref(0);
// 倒计时定时器
let countdownTimer = null;

// 发送忘记密码邮箱验证码
const sendCode = () => {
  // 注意：element-plus的validateField传入字段数组时回调会按字段触发多次，这里逐字段校验各触发一次
  Promise.all([
    new Promise((resolve) => validateFormRef.value.validateField("username", (msg) => resolve(!msg))),
    new Promise((resolve) => validateFormRef.value.validateField("email", (msg) => resolve(!msg)))
  ]).then((results) => {
    if (results.includes(false) || sending.value) {
      return;
    }
    sending.value = true;
    sendForgetPasswordEmailCode({
      username: validateForm.username,
      email: validateForm.email
    }).then(() => {
      ElMessage.success("验证码已发送，请查收邮件");
      sendCountdown.value = 60;
      countdownTimer = setInterval(() => {
        sendCountdown.value--;
        if (sendCountdown.value <= 0) {
          clearInterval(countdownTimer);
          countdownTimer = null;
        }
      }, 1000);
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
    }).finally(() => {
      sending.value = false;
    });
  });
};

// 第一步校验通过后进入设置新密码
const goNext = () => {
  validateFormRef.value.validate((valid) => {
    if (valid) {
      stepActive.value = 1;
    }
  });
};

// 提交重置密码
const submitReset = () => {
  passwordFormRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    submitting.value = true;
    resetPasswordByEmailCode({
      username: validateForm.username,
      code: validateForm.code,
      newPassword: passwordForm.password
    }).then(() => {
      ElMessage.success("密码重置成功");
      stepActive.value = 2;
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
    }).finally(() => {
      submitting.value = false;
    });
  });
};

// 弹窗关闭后重置状态
const handleClosed = () => {
  stepActive.value = 0;
  validateForm.username = "";
  validateForm.email = "";
  validateForm.code = "";
  passwordForm.password = "";
  passwordForm.rePassword = "";
  if (validateFormRef.value) {
    validateFormRef.value.resetFields();
  }
  if (passwordFormRef.value) {
    passwordFormRef.value.resetFields();
  }
};

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>

<style lang="scss" scoped>
.steps {
  margin: 0 auto 24px;
  max-width: 400px;
}

.form-area {
  min-height: 200px;

  .code-row {
    display: flex;
    gap: 10px;

    .el-input {
      flex: 1;
    }

    .el-button {
      flex-shrink: 0;
    }
  }

  .form-tip {
    margin: 6px 0 0;
    font-size: 12px;
    color: #909399;
    line-height: 1.4;
  }
}

.success-area {
  padding: 40px 0 24px;
  text-align: center;

  &__icon {
    font-size: 56px;
    color: #67c23a;
  }

  &__text {
    margin: 14px 0 0;
    font-size: 15px;
    color: #606266;
  }
}

.dialog-footer {
  text-align: center;
}
</style>
