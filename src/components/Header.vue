<template>
  <div class="header-bar flex flex-direction-row">
    <!-- 折叠菜单图标 -->
    <div class="toggle-icon-container mr30 flex flex-direction-column flex-justify-content-center">
      <a type="text"
         href="javascript:;"
         :class="toggleIconClass"
         @click="$emit('toggleNav')">
        <i class="iconfont icon-zhedie" />
      </a>
    </div>
    <!-- 面包屑导航 -->
    <div class="bread-crumb-container flex">
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="breadcrumb in currentBreadcrumbList" :key="breadcrumb">{{ breadcrumb }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 用户头像和信息 -->
    <div class="user-info-content flex flex1 flex-justify-content-end">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="flex flex-direction-row flex-justify-content-center flex-align-items-center">
          <div class="write-article mr40" @click.stop="$router.push({name: 'WriteArticle'})">
            写文章
          </div>
          <div class="mr5 avatar-container flex flex-direction-column flex-justify-content-center">
            <UserAvatar class="flex" :src="userInfo.avatarUrl" :name="userInfo.username" :size="40"/>
          </div>
          <span class="flex">{{ userInfo.username }}</span>
          <el-icon class="flex el-icon--right"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="personal">个人中心</el-dropdown-item>
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import UserAvatar from "@/components/UserAvatar.vue";
import { computed } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import { ArrowRight, ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { logout } from "@/api/auth";
import { ELEMENT_PAGE_LOADING_CONFIG } from "@/config/commonConfig";
import globalLogout from "@/util/storeUtil";
import { useUserStore } from "@/store/user";
import { useSystemSettingStore } from "@/store/systemSetting";

defineOptions({ name: "Header" });

defineProps({
  toggleIconClass: String
});

defineEmits(["toggleNav"]);

const router = useRouter();
const userStore = useUserStore();
const systemSettingStore = useSystemSettingStore();

const currentBreadcrumbList = computed(() => systemSettingStore.currentBreadcrumbList);
const userInfo = computed(() => userStore.userInfo);

// 注销
const handleCommand = (command) => {
  if (command === "logout") {
    const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
    logout().then(() => {
      globalLogout();
      ElMessage.success({
        message: "注销成功",
        duration: 2000,
        center: false
      });
      router.push({
        name: "Login"
      });
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出
    }).finally(() => {
      loading.close();
    });
  } else if (command === "updatePassword") {
    router.push({
      name: "UpdatePassword"
    });
  } else if (command === "personal") {
    router.push({
      name: "Personal"
    });
  }
};
</script>

<style lang="scss" scoped>
.header-bar {
  position: relative;
  height: 60px;
  padding: 0 20px;
  background: #ffffff;
  box-shadow: 0 0 4px 0 rgb(0 0 0 / 10%);

  .toggle-icon-container {
    height: 100%;
    cursor: pointer;
    a {
      line-height: 40px;
      font-size: 30px;
      color: #5c6b77;

      i {
        font-size: 26px;
      }
    }

    .nav-toggle-a-collapse {
      transform: rotate(90deg);
      transition: transform .3s;
    }

    .nav-toggle-a {
      transform: rotate(0);
      transition: transform .3s;
    }
  }

  .bread-crumb-container {
    height: 100%;

    :deep(.el-breadcrumb) {
      line-height: 60px;
    }
  }

  .user-info-content {
    overflow: hidden;
    cursor: pointer;
    height: 100%;

    :deep(.el-dropdown) {
      height: 100%;
      line-height: 60px;

      .write-article {
        cursor: pointer;
        height: 80%;
        display: flex;
        align-items: center;
        padding: 0 10px;
        
        border-radius: 4px;
        transition: color 0.2s, background-color 0.2s;

        &:hover {
          color: var(--el-color-primary);
          background-color: var(--el-color-primary-light-9);
        }
      }

      .avatar-container {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
