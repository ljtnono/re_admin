<template>
  <div class="update-password-container">
    <div class="content-container">
      <header>
        <span>修改用户密码</span>
      </header>
      <!-- 步骤条 -->
      <div class="step-container mt50">
        <el-steps  :active="stepActive" process-status="process" align-center >
          <el-step title="验证身份">
          </el-step>
          <el-step title="修改密码">
          </el-step>
          <el-step title="修改成功">
          </el-step>
        </el-steps>
      </div>
      <!-- 表单 -->
      <div class="form-container">
        <div class="form-validate-container">
          <!-- 验证身份表单 -->
          <el-form class="validate-form" :model="validateForm"  ref="validateForm">
            <!-- 密码 -->
            <el-form-item prop="password" class="mb30">
              <el-input class="input-password fr" prefix-icon="el-icon-lock" v-model="validateForm.password"
                        placeholder="请输入密码" show-password clearable/>
            </el-form-item>
          </el-form>
        </div>
        <div class="form-update-container none">
          <!-- 修改密码表单 -->
          <el-form class="update-password-form" :model="updatePasswordForm"  ref="updatePasswordForm">
            <el-form-item prop="username" class="mb30">
              <el-input class="input-text fr" v-model="updatePasswordForm.username" prefix-icon="el-icon-user-solid"
                        placeholder="请输入用户名" clearable maxlength="50"/>
            </el-form-item>
          </el-form>
        </div>
        <!-- 修改成功 -->
        <div class="success-container none">
          <svg t="1668155349480" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7238" width="200" height="200"><path d="M512 512m-448 0a448 448 0 1 0 896 0 448 448 0 1 0-896 0Z" fill="#07C160" p-id="7239"></path><path d="M466.7 679.8c-8.5 0-16.6-3.4-22.6-9.4l-181-181.1c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l158.4 158.5 249-249c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L489.3 670.4c-6 6-14.1 9.4-22.6 9.4z" fill="#FFFFFF" p-id="7240"></path></svg>
          <p>修改成功</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@c/Header";
export default {
  name: "UpdatePassword",
  components: {Header},
  data() {
    return {
      stepActive: 1,
      validateForm: {
        password: ""
      },
      updatePasswordForm: {

      }
    }
  },
  methods: {

  },
  mounted() {

  }
}
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
    transition: .3s;
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
          background: #349AD9;
        }
      }
    }
  }
}
</style>
