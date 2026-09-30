<template>
  <el-dialog
    title="找回密码"
    :visible.sync="innerVisible"
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
      <el-form ref="validateForm" :model="validateForm" :rules="validateFormRules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="validateForm.username"
            prefix-icon="el-icon-user-solid"
            clearable
            placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item label="绑定邮箱" prop="email">
          <el-input
            v-model="validateForm.email"
            prefix-icon="el-icon-message"
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
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordFormRules" label-width="100px">
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
      <i class="el-icon-circle-check success-area__icon"/>
      <p class="success-area__text">密码重置成功，请使用新密码登录</p>
    </div>

    <div slot="footer" class="dialog-footer">
      <template v-if="stepActive === 0">
        <el-button @click="innerVisible = false">取 消</el-button>
        <el-button type="primary" @click="goNext">下一步</el-button>
      </template>
      <template v-else-if="stepActive === 1">
        <el-button @click="stepActive = 0">上一步</el-button>
        <el-button type="primary" :loading="submitting" @click="submitReset">确认重置</el-button>
      </template>
      <el-button v-else type="primary" @click="innerVisible = false">去登录</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
import {sendForgetPasswordEmailCode, resetPasswordByEmailCode} from "@/api/user";

export default {
  name: "ForgetPasswordDialog",
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 当前步骤
      stepActive: 0,
      // 发送验证码请求中
      sending: false,
      // 提交重置请求中
      submitting: false,
      // 第一步表单
      validateForm: {
        username: "",
        email: "",
        code: ""
      },
      // 第一步表单校验规则
      validateFormRules: {
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
      },
      // 第二步表单
      passwordForm: {
        password: "",
        rePassword: ""
      },
      // 第二步表单校验规则
      passwordFormRules: {
        password: [
          {required: true, message: LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE, trigger: "blur"},
          {pattern: LOGIN_PASSWORD_REGEX, message: LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE, trigger: "blur"}
        ],
        rePassword: [
          {required: true, message: "请再次输入新密码", trigger: "blur"},
          {
            validator: (rule, value, callback) => {
              if (value !== this.passwordForm.password) {
                return callback(new Error("两次输入的密码不一致"));
              }
              return callback();
            },
            trigger: "blur"
          }
        ]
      },
      // 发送验证码倒计时（秒）
      sendCountdown: 0,
      // 倒计时定时器
      countdownTimer: null
    };
  },
  computed: {
    innerVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  methods: {
    // 发送忘记密码邮箱验证码
    sendCode() {
      let that = this;
      // 注意：element-ui的validateField传入字段数组时回调会按字段触发多次，这里逐字段校验各触发一次
      Promise.all([
        new Promise((resolve) => that.$refs.validateForm.validateField("username", (msg) => resolve(!msg))),
        new Promise((resolve) => that.$refs.validateForm.validateField("email", (msg) => resolve(!msg)))
      ]).then((results) => {
        if (results.includes(false) || that.sending) {
          return;
        }
        that.sending = true;
        sendForgetPasswordEmailCode({
          username: that.validateForm.username,
          email: that.validateForm.email
        }).then(() => {
          that.$message.success("验证码已发送，请查收邮件");
          that.sendCountdown = 60;
          that.countdownTimer = setInterval(() => {
            that.sendCountdown--;
            if (that.sendCountdown <= 0) {
              clearInterval(that.countdownTimer);
              that.countdownTimer = null;
            }
          }, 1000);
        }).catch(() => {
          // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
        }).finally(() => {
          that.sending = false;
        });
      });
    },
    // 第一步校验通过后进入设置新密码
    goNext() {
      this.$refs.validateForm.validate((valid) => {
        if (valid) {
          this.stepActive = 1;
        }
      });
    },
    // 提交重置密码
    submitReset() {
      let that = this;
      that.$refs.passwordForm.validate((valid) => {
        if (!valid) {
          return;
        }
        that.submitting = true;
        resetPasswordByEmailCode({
          username: that.validateForm.username,
          code: that.validateForm.code,
          newPassword: that.passwordForm.password
        }).then(() => {
          that.$message.success("密码重置成功");
          that.stepActive = 2;
        }).catch(() => {
          // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
        }).finally(() => {
          that.submitting = false;
        });
      });
    },
    // 弹窗关闭后重置状态
    handleClosed() {
      this.stepActive = 0;
      this.validateForm = {username: "", email: "", code: ""};
      this.passwordForm = {password: "", rePassword: ""};
      if (this.$refs.validateForm) {
        this.$refs.validateForm.resetFields();
      }
      if (this.$refs.passwordForm) {
        this.$refs.passwordForm.resetFields();
      }
    }
  },
  beforeDestroy() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }
};
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
