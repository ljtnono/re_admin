<template>
  <div class="update-password">
    <div class="update-card">
      <header class="update-card__header">修改密码</header>
      <el-steps class="update-card__steps" :active="stepActive" finish-status="success" align-center>
        <el-step title="验证身份"/>
        <el-step title="设置新密码"/>
        <el-step title="修改成功"/>
      </el-steps>

      <!-- 未绑定邮箱提示：修改密码依赖邮箱验证 -->
      <div v-if="!emailBound" class="no-email">
        <i class="el-icon-warning-outline no-email__icon"/>
        <p class="no-email__text">修改密码需要先绑定邮箱，用于接收验证验证码</p>
        <el-button type="primary" round @click="$router.push({name: 'Personal'})">去绑定邮箱</el-button>
      </div>

      <template v-else>
        <!-- 第一步：验证身份 -->
        <div v-show="stepActive === 0" class="form-area">
          <el-form ref="validateForm" :model="validateForm" :rules="validateFormRules" label-width="110px">
            <el-form-item label="当前密码" prop="oldPassword">
              <el-input
                v-model="validateForm.oldPassword"
                style="width: 340px"
                show-password
                clearable
                placeholder="请输入当前密码"/>
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="emailCode">
              <div class="code-row">
                <el-input
                  v-model="validateForm.emailCode"
                  maxlength="6"
                  placeholder="6位数字验证码"/>
                <el-button
                  class="code-row__send-btn"
                  :disabled="sendCountdown > 0"
                  @click="sendCode">
                  {{ sendCountdown > 0 ? sendCountdown + "s后重发" : "发送验证码" }}
                </el-button>
              </div>
              <p class="form-tip">验证码将发送至已绑定邮箱 {{ maskedEmail }}</p>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="goNext">下一步</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 第二步：设置新密码 -->
        <div v-show="stepActive === 1" class="form-area">
          <el-form ref="passwordForm" :model="passwordForm" :rules="passwordFormRules" label-width="110px">
            <el-form-item label="新密码" prop="password">
              <el-input
                v-model="passwordForm.password"
                style="width: 340px"
                show-password
                clearable
                placeholder="6-20位，须包含大小写字母和数字"/>
            </el-form-item>
            <el-form-item label="确认新密码" prop="rePassword">
              <el-input
                v-model="passwordForm.rePassword"
                style="width: 340px"
                show-password
                clearable
                placeholder="请再次输入新密码"/>
            </el-form-item>
            <el-form-item>
              <el-button @click="stepActive = 0">上一步</el-button>
              <el-button type="primary" :loading="submitting" @click="submitUpdate">确认修改</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 第三步：修改成功 -->
        <div v-show="stepActive === 2" class="success-area">
          <i class="el-icon-circle-check success-area__icon"/>
          <p class="success-area__text">密码修改成功，当前登录状态已失效</p>
          <el-button type="primary" round @click="backToLogin">重新登录</el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import {sendUpdatePasswordEmailCode, updatePassword} from "@/api/user";
import {LOGIN_PASSWORD_REGEX} from "@/constant/regexConstant";
import {
  LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE,
  LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE
} from "@/constant/errorMessageConstant";

export default {
  name: "UpdatePassword",
  data() {
    return {
      // 当前步骤
      stepActive: 0,
      // 第一步表单
      validateForm: {
        oldPassword: "",
        emailCode: ""
      },
      // 第一步表单校验规则
      validateFormRules: {
        oldPassword: [
          {required: true, message: LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE, trigger: "blur"},
          {pattern: LOGIN_PASSWORD_REGEX, message: LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE, trigger: "blur"}
        ],
        emailCode: [
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
      countdownTimer: null,
      // 提交中
      submitting: false
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    // 是否已绑定邮箱
    emailBound() {
      return !!(this.userInfo && this.userInfo.email);
    },
    // 脱敏后的邮箱
    maskedEmail() {
      let email = this.userInfo && this.userInfo.email;
      if (!email) {
        return "";
      }
      let atIndex = email.indexOf("@");
      if (atIndex <= 1) {
        return email;
      }
      return email.charAt(0) + "***" + email.substring(atIndex);
    }
  },
  methods: {
    // 密码修改成功后当前会话已被服务端强制下线，清理本地登录态并返回登录页
    backToLogin() {
      this.$store.commit("logout");
      this.$router.push({name: "Login"});
    },
    // 发送修改密码邮箱验证码
    sendCode() {
      let that = this;
      sendUpdatePasswordEmailCode().then(() => {
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
    // 提交修改密码
    submitUpdate() {
      let that = this;
      that.$refs.passwordForm.validate((valid) => {
        if (!valid) {
          return;
        }
        that.submitting = true;
        updatePassword({
          oldPassword: that.validateForm.oldPassword,
          newPassword: that.passwordForm.password,
          emailCode: that.validateForm.emailCode
        }).then(() => {
          that.$message.success("密码修改成功");
          that.stepActive = 2;
        }).catch(() => {
          // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
        }).finally(() => {
          that.submitting = false;
        });
      });
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
$primary: #409eff;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$border-light: #f2f6fc;
$page-bg: #f1f1f1;

.update-password {
  padding: 20px;
  background: $page-bg;
  box-sizing: border-box;
}

.update-card {
  max-width: 760px;
  margin: 0 auto;
  padding: 24px 32px 40px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;

  &__header {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
    padding-bottom: 16px;
    border-bottom: 1px solid $border-light;
  }

  &__steps {
    margin: 32px auto 8px;
    max-width: 560px;
  }
}

.form-area {
  max-width: 480px;
  margin: 40px auto 0;

  .code-row {
    display: flex;
    gap: 10px;
    width: 340px;

    .el-input {
      flex: 1;
    }

    &__send-btn {
      flex-shrink: 0;
    }
  }

  .form-tip {
    margin: 6px 0 0;
    font-size: 12px;
    color: $text-secondary;
    line-height: 1.4;
  }
}

.no-email {
  margin: 48px auto 24px;
  text-align: center;

  &__icon {
    font-size: 48px;
    color: #e6a23c;
  }

  &__text {
    margin: 16px 0 20px;
    font-size: 14px;
    color: $text-regular;
  }
}

.success-area {
  margin: 48px auto 24px;
  text-align: center;

  &__icon {
    font-size: 64px;
    color: #67c23a;
  }

  &__text {
    margin: 16px 0 24px;
    font-size: 18px;
    font-weight: 600;
    color: $text-primary;
  }
}
</style>
