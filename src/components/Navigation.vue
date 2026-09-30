<template>
  <div>
    <el-menu
      background-color="#001529"
      text-color="#ffffff"
      active-text-color="#409EFF"
      :collapse-transition="collapseTransition"
      unique-opened
      :collapse="collapseStatus">
      <!-- 导航栏上面的logo -->
      <div class="nav-logo-container mb10">
        <img class="nav-logo-max" v-show="!collapseStatus" src="@a/images/logo.png" alt="logo"/>
        <img class="nav-logo-min" v-show="collapseStatus" src="@a/images/logo-min.png" alt="logo-mini"/>
      </div>
      <!-- 工作台 -->
      <el-menu-item index="/workspace" style="text-align: center; cursor: pointer" @click="$router.push({ name: 'Workspace' })">
        <a href="javascript:" v-show="!collapseStatus" style="width: 100%; height: 100%; display: inline-block">
          工作台
        </a>
        <div v-show="collapseStatus">
          <a href="javascript:" style="width: 100%; height: 100%; display: inline-block">
            <el-icon><Location /></el-icon>
          </a>
        </div>
      </el-menu-item>
      <!-- 递归嵌套设置子菜单 -->
      <template v-for="item in menus" :key="item.name">
        <menu-item :item="item" />
      </template>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Location } from "@element-plus/icons-vue";
import MenuItem from "@c/MenuItem.vue";

defineOptions({ name: "Navigation" });

defineProps({
  collapseStatus: Boolean,
  menus: {
    type: Array
  }
});

const collapseTransition = ref(true);
</script>

<style lang="scss" scoped>
.el-menu {
  width: 256px;
  overflow-x: hidden;
  height: 100%;
  position: relative;

  :deep(.el-sub-menu) {
    .el-menu-item {
      min-width: 180px;
    }
  }
}

// 折叠菜单后隐藏小箭头
.el-menu--collapse {
  width: 64px;

  :deep(.el-sub-menu__title) {
    text-align: center;
  }

  :deep(.el-sub-menu__icon-arrow) {
    display: none !important;
  }

  .nav-logo-container {
    width: 64px;
    height: 64px;
    padding: 0;
    position: relative;
    transition: width .2s;

    img {
      display: block;
      width: 44px;
      height: 44px;
      position: absolute;
      left: calc(50% - 22px);
      top: 10px;
    }
  }
}

.nav-logo-container {
  height: 64px;
  padding: 0;
  position: relative;

  img {
    height: 44px;
    width: auto;
    display: block;
    margin: 0 auto;
    position: absolute;
    left: calc(50% - 80px);
    top: 10px;
  }
}
</style>
