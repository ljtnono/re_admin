<template>
  <div id="header">
    <div class="header-bar">
      <!-- 折叠菜单图标 -->
      <div class="toggle-icon-container fl mr30 flex flex-direction-column flex-justify-content-center">
        <a type="text" href="javascript:" :class="navTriggerClass" @click="toggleNav">
          <i class="iconfont icon-zhedie"/>
        </a>
      </div>
      <!-- 面包屑导航 -->
      <div class="bread-crumb-container fl">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 用户头像和信息 -->
      <div class="user-info-content fr">
        <el-dropdown class="fr mr50" trigger="click" @command="handleCommand">
          <div class="flex flex-direction-row">
            <img class="mr5 flex" :src="avatar" alt="用户头像"/>
            <span>杂技程序员老凌</span>
            <i class="el-icon-arrow-down el-icon--right flex"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="personCenter">个人中心</el-dropdown-item>
            <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>

import router from "@/router";

export default {
  name: 'Header',
  data() {
    return {}
  },
  computed: {
    navTriggerClass() {
      // TODO 计算当前切换导航栏icon的class属性值
      return "nav-trigger-a";
    }
  },
  props: {
    avatar: String
  },
  components: {},
  methods: {
    // 折叠左边的菜单栏
    toggleNav() {
      // TODO 设置当前标签为.nav-trigger-a-collapse
      this.$emit("toggleNav");
    },
    // 注销
    handleCommand(command) {
      if (command === "logout") {
        // 删除当前token信息,并返回到登录界面
        sessionStorage.removeItem("tokenInfo");
        sessionStorage.removeItem("userInfo");
        sessionStorage.removeItem("menus");
        router.push({
          name: "Login"
        });
      }
    }
  },
  mounted() {
    //
  }
}
</script>


<style lang="scss" scoped>
#header {
  width: 100%;
  min-height: 60px;
  padding: 0 20px;
  background: #ffffff;
  min-width: 1344px;

  .header-bar {
    position: relative;
    line-height: 60px;
    height: 100%;
    padding: 10px 0;


    .toggle-icon-container {
      height: 100%;
      width: auto;

      // 收起状态
      .nav-trigger-a-collapse {
        transform: rotateY(-90deg);
      }

      .nav-trigger-a {
        line-height: 40px;
        font-size: 30px;
        color: #5c6b77;

        i {
          font-size: 26px;
        }
      }
    }


    .bread-crumb-container {
      height: 100%;

      .el-breadcrumb {
        line-height: 40px;
      }
    }

    .el-dropdown {
      line-height: 40px;
      height: 100%;
    }

    .user-info-content {
      overflow: hidden;
      cursor: pointer;
      line-height: 40px;

      .el-icon-arrow-down:before {
        line-height: 40px;
      }


      img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }
    }
  }

}
</style>
