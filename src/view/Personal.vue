<template>
  <div class="personal">
    <!-- 资料卡 -->
    <section class="profile-card">
      <div class="profile-card__left">
        <el-upload
          class="avatar-upload"
          :show-file-list="false"
          accept="image/jpeg,image/png,image/gif"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadAvatar">
          <div class="avatar-upload__wrap" v-loading="avatarUploading">
            <UserAvatar class="profile-card__avatar" :src="avatarUrl" :name="username" :size="100"/>
            <span class="avatar-upload__mask"><el-icon><Camera /></el-icon></span>
          </div>
        </el-upload>
        <div class="profile-card__meta">
          <h2 class="profile-card__name">{{ username }}</h2>
          <p class="profile-card__sub">ID：{{ userId }}</p>
          <div class="profile-card__tags">
            <span class="profile-card__tag"><el-icon><Key /></el-icon>已开通权限 {{ permissionCount }} 项</span>
          </div>
        </div>
      </div>
    </section>

    <div class="personal-grid">
      <!-- 账号信息 -->
      <section class="panel">
        <div class="panel__header">
          <span class="panel__title"><el-icon><Postcard /></el-icon> 账号信息</span>
        </div>
        <div class="info-list">
          <div class="info-item">
            <div class="info-item__left">
              <el-icon class="info-item__icon info-item__icon--blue"><User /></el-icon>
              <span class="info-item__label">用户名</span>
            </div>
            <div class="info-item__right">
              <span class="info-item__value">{{ username }}</span>
              <span class="info-item__fixed">不可修改</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-item__left">
              <el-icon class="info-item__icon info-item__icon--purple"><Postcard /></el-icon>
              <span class="info-item__label">用户 ID</span>
            </div>
            <div class="info-item__right">
              <span class="info-item__value">{{ userId }}</span>
              <button class="info-item__copy" type="button" @click="copy(userId)">
                <el-icon><CopyDocument /></el-icon>复制
              </button>
            </div>
          </div>
          <div class="info-item">
            <div class="info-item__left">
              <el-icon class="info-item__icon info-item__icon--green"><Message /></el-icon>
              <span class="info-item__label">邮箱</span>
            </div>
            <div class="info-item__right">
              <span v-if="email" class="info-item__value">{{ email }}</span>
              <span v-else class="info-item__value info-item__value--empty">未绑定</span>
              <button v-if="email" class="info-item__copy" type="button" @click="copy(email)">
                <el-icon><CopyDocument /></el-icon>复制
              </button>
              <button class="info-item__bind" type="button" @click="openBindDialog">
                <el-icon><Message /></el-icon>{{ email ? "换绑" : "绑定" }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 安全设置 -->
      <section class="panel">
        <div class="panel__header">
          <span class="panel__title"><el-icon><Lock /></el-icon> 安全设置</span>
        </div>
        <div class="security-list">
          <div class="security-item">
            <div class="security-item__left">
              <el-icon class="security-item__icon security-item__icon--blue"><Key /></el-icon>
              <div class="security-item__meta">
                <p class="security-item__title">登录密码</p>
                <p class="security-item__desc">定期修改密码可以有效保护账号安全</p>
              </div>
            </div>
            <el-button size="small" round @click="$router.push({name: 'UpdatePassword'})">去修改</el-button>
          </div>
          <div class="security-item">
            <div class="security-item__left">
              <el-icon class="security-item__icon security-item__icon--green"><User /></el-icon>
              <div class="security-item__meta">
                <p class="security-item__title">账号权限</p>
                <p class="security-item__desc">当前账号共开通 {{ permissionCount }} 项操作权限</p>
              </div>
            </div>
            <span class="security-item__badge">{{ permissionCount }} 项</span>
          </div>
        </div>
      </section>
    </div>

    <!-- 绑定邮箱弹窗 -->
    <el-dialog
      :title="email ? '换绑邮箱' : '绑定邮箱'"
      v-model="bindDialogVisible"
      width="440px"
      :close-on-click-modal="false"
      class="bind-email-dialog"
      @closed="resetBindDialog">
      <el-form ref="bindFormRef" :model="bindForm" :rules="bindFormRules" label-width="80px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="bindForm.email" placeholder="请输入要绑定的邮箱" clearable/>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <div class="bind-form__code-row">
            <el-input v-model="bindForm.code" placeholder="6位数字验证码" maxlength="6"/>
            <el-button
              class="bind-form__send-btn"
              :disabled="sendCountdown > 0"
              @click="sendCode">
              {{ sendCountdown > 0 ? sendCountdown + "s后重发" : "发送验证码" }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
        <el-button @click="bindDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="bindSubmitting" @click="confirmBind">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import UserAvatar from "@/components/UserAvatar.vue";
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { ElMessage } from "element-plus";
import { Camera, Key, Postcard, User, CopyDocument, Message, Lock } from "@element-plus/icons-vue";
import { sendBindEmailCode, bindEmail } from "@/api/user";
import { getCurrentUser } from "@/api/auth";
import { updateAvatar } from "@/api/user";
import { uploadFile } from "@/api/common";
import { ARTICLE_COVER_SIZE_LIMIT } from "@/constant/commonConstant";
import { USER_ADD_EMAIL_REGEX } from "@/constant/regexConstant";
import { useUserStore } from "@/store/user";

defineOptions({ name: "Personal" });

const userStore = useUserStore();

const bindFormRef = ref(null);

// 绑定邮箱弹窗可见性
const bindDialogVisible = ref(false);
// 绑定邮箱表单
const bindForm = reactive({
  email: "",
  code: ""
});
// 绑定表单校验规则
const bindFormRules = {
  email: [
    {required: true, message: "请输入邮箱", trigger: "blur"},
    {pattern: USER_ADD_EMAIL_REGEX, message: "邮箱格式不正确", trigger: "blur"}
  ],
  code: [
    {required: true, message: "请输入验证码", trigger: "blur"},
    {pattern: /^\d{6}$/, message: "验证码为6位数字", trigger: "blur"}
  ]
};
// 发送验证码倒计时（秒）
const sendCountdown = ref(0);
// 倒计时定时器
let countdownTimer = null;
// 绑定提交中
const bindSubmitting = ref(false);
// 头像上传中
const avatarUploading = ref(false);

// 用户名
const username = computed(() => (userStore.userInfo && userStore.userInfo.username) || "-");
// 用户id
const userId = computed(() => (userStore.userInfo && userStore.userInfo.id) || "-");
// 邮箱
const email = computed(() => (userStore.userInfo && userStore.userInfo.email) || null);
// 头像地址
const avatarUrl = computed(() => (userStore.userInfo && userStore.userInfo.avatarUrl) || null);
// 权限数量
const permissionCount = computed(() => {
  const list = userStore.userInfo && userStore.userInfo.permissionIdList;
  return list ? list.length : 0;
});

onMounted(() => {
  // 进入个人中心时拉取最新用户信息，同步到store
  getCurrentUser().then((res) => {
    const userInfo = res.data.data;
    if (userInfo) {
      userStore.changeUserInfo({...userStore.userInfo, ...userInfo});
    }
  }).catch(() => {
    // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
  });
});

// 头像上传前校验：仅支持jpeg/png/gif，大小不超过2M
const beforeAvatarUpload = (file) => {
  const typeOk = ["image/jpeg", "image/png", "image/gif"].includes(file.type);
  if (!typeOk) {
    ElMessage.error("头像格式仅支持jpeg/png/gif");
    return false;
  }
  if (file.size > ARTICLE_COVER_SIZE_LIMIT) {
    ElMessage.error("头像大小不能超过2M");
    return false;
  }
  return true;
};

// 上传头像：先上传到文件服务，再把地址保存到用户资料
const uploadAvatar = ({file}) => {
  avatarUploading.value = true;
  const data = new FormData();
  data.append("file", file);
  uploadFile(data).then((res) => {
    const avatarUrl = res.data.data;
    return updateAvatar({avatarUrl});
  }).then(() => {
    // 保存成功后重新拉取用户信息，同步最新头像到store
    return getCurrentUser();
  }).then((res) => {
    const userInfo = res.data.data;
    if (userInfo) {
      userStore.changeUserInfo({...userStore.userInfo, ...userInfo});
    }
    ElMessage.success("头像更新成功");
  }).catch(() => {
    // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
  }).finally(() => {
    avatarUploading.value = false;
  });
};

// 复制内容到剪贴板
const copy = (content) => {
  if (!content) {
    return;
  }
  const fallbackCopy = () => {
    const input = document.createElement("textarea");
    input.value = String(content);
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand("copy");
      ElMessage.success("已复制到剪贴板");
    } catch (e) {
      ElMessage.error("复制失败，请手动复制");
    }
    document.body.removeChild(input);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(String(content)).then(() => {
      ElMessage.success("已复制到剪贴板");
    }).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
};

// 打开绑定邮箱弹窗
const openBindDialog = () => {
  bindDialogVisible.value = true;
};

// 发送绑定邮箱验证码
const sendCode = () => {
  bindFormRef.value.validateField("email", (errorMessage) => {
    if (errorMessage) {
      return;
    }
    sendBindEmailCode(bindForm.email.trim()).then(() => {
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
    });
  });
};

// 确认绑定邮箱
const confirmBind = () => {
  bindFormRef.value.validate((valid) => {
    if (!valid) {
      return;
    }
    bindSubmitting.value = true;
    bindEmail({email: bindForm.email.trim(), code: bindForm.code.trim()}).then(() => {
      ElMessage.success("邮箱绑定成功");
      // 同步更新store中的用户信息
      userStore.changeUserInfo({...userStore.userInfo, email: bindForm.email.trim()});
      bindDialogVisible.value = false;
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出，这里仅需吞掉异常，防止出现未处理的Promise拒绝
    }).finally(() => {
      bindSubmitting.value = false;
    });
  });
};

// 重置绑定弹窗
const resetBindDialog = () => {
  bindFormRef.value.resetFields();
  bindForm.code = "";
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
  sendCountdown.value = 0;
};

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
});
</script>
<style lang="scss" scoped>
// ========== 设计变量 ==========
$primary: #409eff;
$primary-light: #ecf5ff;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$text-placeholder: #c0c4cc;
$border-color: #ebeef5;
$border-light: #f2f6fc;
$panel-bg: #ffffff;
$page-bg: #f1f1f1;

.personal {
  padding: 20px;
  background: $page-bg;
  box-sizing: border-box;
}

// ========== 资料卡 ==========
.profile-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  background: $panel-bg;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  &__left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .avatar-upload {
    &__wrap {
      position: relative;
      cursor: pointer;
      border-radius: 50%;
      overflow: hidden;

      &:hover .avatar-upload__mask {
        opacity: 1;
      }
    }

    &__mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #ffffff;
      background: rgba(0, 0, 0, 0.4);
      opacity: 0;
      transition: opacity 0.2s;
    }
  }

  &__avatar {
    width: 84px;
    height: 84px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 0 4px $primary-light;

    &--fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 34px;
      font-weight: 600;
      color: #ffffff;
      background: $primary;
    }
  }

  &__name {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    color: $text-primary;
  }

  &__sub {
    margin: 6px 0 0;
    font-size: 13px;
    color: $text-secondary;
  }

  &__tags {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    font-size: 12px;
    color: $primary;
    background: $primary-light;
    border-radius: 10px;

    i {
      font-size: 12px;
    }
  }
}

// ========== 面板通用 ==========
.panel {
  padding: 18px 20px;
  background: $panel-bg;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  &__title {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    font-weight: 600;
    color: $text-primary;

    i {
      color: $primary;
      font-size: 16px;
    }
  }
}

// ========== 下方两栏 ==========
.personal-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 4px;
}

// ========== 账号信息 ==========
.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 8px;

  & + & {
    border-top: 1px solid $border-light;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 17px;
    border-radius: 8px;

    &--blue {
      color: #409eff;
      background: #ecf5ff;
    }

    &--purple {
      color: #b37feb;
      background: #f9f0ff;
    }

    &--green {
      color: #67c23a;
      background: #f0f9eb;
    }

    &--orange {
      color: #e6a23c;
      background: #fdf6ec;
    }
  }

  &__label {
    font-size: 14px;
    color: $text-regular;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__value {
    font-size: 14px;
    color: $text-primary;

    &--empty {
      color: $text-placeholder;
    }
  }

  &__fixed {
    font-size: 12px;
    color: $text-placeholder;
  }

  &__copy {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 4px 10px;
    font-size: 12px;
    color: $primary;
    background: $primary-light;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: darken($primary-light, 4%);
    }

    i {
      font-size: 13px;
    }
  }
}

// ========== 安全设置 ==========
.info-item__bind {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  font-size: 12px;
  color: $primary;
  background: $primary-light;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: darken($primary-light, 4%);
  }

  i {
    font-size: 13px;
  }
}

.bind-form__code-row {
  display: flex;
  gap: 10px;

  .el-input {
    flex: 1;
  }
}

.bind-form__send-btn {
  flex-shrink: 0;
}

:deep(.bind-email-dialog) {
  border-radius: 10px;
}

.security-list {
  display: flex;
  flex-direction: column;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px;

  & + & {
    border-top: 1px solid $border-light;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    font-size: 17px;
    border-radius: 8px;

    &--blue {
      color: #409eff;
      background: #ecf5ff;
    }

    &--green {
      color: #67c23a;
      background: #f0f9eb;
    }
  }

  &__title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }

  &__desc {
    margin: 4px 0 0;
    font-size: 12px;
    color: $text-secondary;
  }

  &__badge {
    padding: 3px 12px;
    font-size: 13px;
    color: #67c23a;
    background: #f0f9eb;
    border-radius: 10px;
  }
}

// ========== 响应式 ==========
@media (max-width: 1200px) {
  .personal-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .profile-card {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}
</style>
