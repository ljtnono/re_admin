<template>
  <div class="update-password-container">
    <div class="content-container">
      <header>
        <span>修改用户密码</span>
      </header>
      <!-- 步骤条 -->
      <div class="step-container mt50">
        <el-steps :active="stepActive" process-status="process" align-center>
          <el-step title="验证身份"></el-step>
          <el-step title="修改密码"></el-step>
          <el-step title="修改成功"></el-step>
        </el-steps>
      </div>
      <!-- 表单 -->
      <div class="form-container">
        <div class="form-validate-container mt50">
          <!-- 验证身份表单 -->
          <el-form
            class="validate-form"
            :rules="validateFormRules"
            :model="validateForm"
            ref="validateForm"
            label-width="140px"
          >
            <!-- 密码 -->
            <el-form-item prop="password" label="请输入当前密码：">
              <el-input
                class="fl"
                v-model="validateForm.password"
                style="width: 400px"
                show-password
                clearable
              />
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item prop="verifyCode" label="请输入验证码：">
              <el-input
                class="fl mr20"
                v-model="validateForm.verifyCode"
                style="width: 200px"
              />
              <img
                class="verify-code-img fl"
                :src="verifyCodeImageUrl"
                @click="refresh()"
              />
              <a href="javascript:;" class="ml20" @click="refresh()">
                看不清？换一张
              </a>
            </el-form-item>
            <!-- 验证身份 -->
            <el-form-item>
              <el-button
                type="primary"
                @click="commitValidateForm('validateForm')"
              >
                提交
              </el-button>
              <el-button
                type="primary"
              >
                返回上一步
              </el-button>
              <a class="ml20" href="javascript:;">忘记密码?</a>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-update-container mt50 none">
          <!-- 修改密码表单 -->
          <el-form
            class="update-password-form"
            :model="updatePasswordForm"
            ref="updatePasswordForm"
            :rules="updatePasswordFormRules"
            label-width="140px"
          >
            <el-form-item prop="password" class="mb30" label="请输入新密码">
              <el-input
                class="input-password fl"
                v-model="updatePasswordForm.password"
                style="width: 400px"
                show-password
                clearable
              />
            </el-form-item>
            <el-form-item prop="rePassword" class="mb30" label="重新输入密码">
              <el-input
                class="input-password fl"
                v-model="updatePasswordForm.rePassword"
                style="width: 400px"
                show-password
                clearable
              />
            </el-form-item>
            <!-- 验证身份 -->
            <el-form-item>
              <el-button
                class="btn-submit"
                type="primary"
                @click="commitUpdatePasswordForm('updatePasswordForm')"
              >
                确认修改
              </el-button>
              <el-button
                type="primary"
              >
                返回上一步
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 修改成功 -->
        <div class="success-container mt50 none">
          <svg
            t="1668155349480"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7238"
            width="200"
            height="200"
          >
            <path
              d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z"
              fill="#07C160"
              p-id="7239"
            ></path>
            <path
              d="M466.7 679.8c-8.5 0-16.6-3.4-22.6-9.4l-181-181.1c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l158.4 158.5 249-249c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L489.3 670.4c-6 6-14.1 9.4-22.6 9.4z"
              fill="#FFFFFF"
              p-id="7240"
            ></path>
          </svg>
          <p class="mt20">修改成功</p>
        </div>
      </div>
      <!-- 密码建议 -->
    </div>
  </div>
</template>

<script>
import Header from "@c/Header";
import "../mock/login";
import {
  LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE,
  LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE,
  LOGIN_VERIFY_CODE_EMPTY_ERROR_MESSAGE,
  RE_PASSWORD_NOT_EQUALS_PASSWORD_ERROR_MESSAGE,
} from "@/constant/errorMessageConstant";
import {PASSWORD_REGEX} from "@/constant/regexConstant";

export default {
  name: "UpdatePassword",
  components: {Header},
  data() {
    return {
      stepActive: 1,
      verifyCodeImageUrl: "",
      validateForm: {
        password: "",
        verifyCode: "",
      },
      validateFormRules: {
        password: [
          {
            required: true,
            message: LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE,
            trigger: "blur",
          },
          {
            pattern: PASSWORD_REGEX,
            message: LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE,
            trigger: "blur",
          },
        ],
        verifyCode: [
          {
            required: true,
            message: LOGIN_VERIFY_CODE_EMPTY_ERROR_MESSAGE,
            trigger: "blur",
          },
        ],
      },
      updatePasswordForm: {
        password: "",
        rePassword: "",
      },
      updatePasswordFormRules: {
        password: [
          {
            required: true,
            message: LOGIN_PASSWORD_EMPTY_ERROR_MESSAGE,
            trigger: "blur",
          },
          {
            pattern: PASSWORD_REGEX,
            message: LOGIN_PASSWORD_FORMAT_ERROR_MESSAGE,
            trigger: "blur",
          },
        ],
        rePassword: [
          {
            validator: (rule, value, callback) => {
              if (this.updatePasswordForm.password !== this.updatePasswordForm.rePassword) {
                return callback(new Error(RE_PASSWORD_NOT_EQUALS_PASSWORD_ERROR_MESSAGE));
              } else {
                return callback();
              }
            },
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 刷新验证码图片
    refresh() {
      this.$http.get("/api-backend/refreshVerifyCode").then((res) => {
        let outerData = res.data;
        let innerData = outerData.data;
        this.verifyCodeImageUrl = innerData;
      });
    },
    commitValidateForm(formName) {
    },
    commitUpdatePasswordForm(formName) {
    },
  },
  mounted() {
    this.refresh();
  },
};
</script>

<style lang="scss" scoped>
.update-password-container {
  height: calc(100% - 60px);
  margin: 20px auto;
  width: 1100px;

  .content-container {
    background: #ffffff;
    width: 100%;
    height: 600px;
    transition: 0.3s;
    border-radius: 4px;

    &:hover {
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    }

    header {
      width: 100%;
      text-align: left;
      height: 40px;
      line-height: 40px;
      padding: 5px 20px;

      span {
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
      }
    }

    .step-container {
      height: 60px;

      .el-steps {
        height: 60px;

        ::v-deep .el-step__line {
          background: #349ad9;
        }
      }
    }

    .form-container {
      width: 800px;
      height: 300px;
      margin: 0 auto;

      .validate-form {
        width: 100%;
        height: 100%;

        .el-form-item {
          margin-bottom: 30px;

          ::v-deep .el-form-item__label::before {
            content: "*";
            color: #f56c6c;
          }

          a {
            color: #4a4a4a;

            &:hover {
              text-decoration: underline;
              color: #5c6b77;
            }
          }
        }

        .verify-code-img {
          display: block;
          width: 100px;
          height: 40px;
          line-height: 40px;
          cursor: pointer;
        }
      }

      .update-password-form {
        width: 100%;
        height: 100%;

        .el-form-item {
          margin-bottom: 30px;

          ::v-deep .el-form-item__label::before {
            content: "*";
            color: #f56c6c;
          }

          a {
            color: #4a4a4a;

            &:hover {
              text-decoration: underline;
              color: #5c6b77;
            }
          }
        }
      }

      .success-container {
        width: 100%;
        height: 100%;
        text-align: center;

        p {
          font-size: 24px;
          color: #5cb85c;
        }
      }
    }
  }
}
</style>
