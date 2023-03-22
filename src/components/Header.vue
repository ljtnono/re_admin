<template>
  <div class="header-bar flex flex-direction-row">
    <!-- 折叠菜单图标 -->
    <div class="toggle-icon-container mr30 flex flex-direction-column flex-justify-content-center">
      <a type="text"
         href="javascript:;"
         :class="toggleIconClass"
         @click="toggleNav">
        <i class="iconfont icon-zhedie" />
      </a>
    </div>
    <!-- 面包屑导航 -->
    <div class="bread-crumb-container flex">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="breadcrumb in breadcrumbList" :key="breadcrumb">{{ breadcrumb }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 用户头像和信息 -->
    <div class="user-info-content flex flex1 flex-justify-content-end">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="flex flex-direction-row flex-justify-content-center">
          <div class="write-article mr40" @click.stop="$router.push({name: 'WriteArticle'})">
            写文章
          </div>
          <div class="mr5 avatar-container flex flex-direction-column flex-justify-content-center">
            <img class="flex" :src="userInfo.avatarUrl" alt="用户头像"/>
          </div>
          <span class="flex">{{userInfo.username}}</span>
          <i class="el-icon-arrow-down el-icon--right flex"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="personal">个人中心</el-dropdown-item>
          <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout">注销</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import router from "@/router";
import {logout} from "@/api/auth";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import {mapState} from "vuex";

export default {
  name: "Header",
  data() {
    return {

    };
  },
  computed: {
    ...mapState({
      breadcrumbList: state => state.systemSetting.breadcrumbList,
      userInfo: state => state.user.userInfo
    })
  },
  props: {
    toggleIconClass: String
  },
  components: {},
  methods: {
    // 折叠左边的菜单栏
    toggleNav() {
      this.$emit("toggleNav");
    },
    // 注销
    handleCommand(command) {
      let that = this;
      if (command === "logout") {
        that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
        logout().then(res => {
          this.$store.commit("logout");
          that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
          this.$message({
            type: "success",
            message: "注销成功",
            duration: 2000,
            center: false,
          });
          router.push({
            name: "Login",
          });
        }).catch(e => {
          that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
        });
      } else if (command === "updatePassword") {
        router.push({
          name: "UpdatePassword",
        });
      } else if (command === "personal") {
        router.push({
          name: "Personal"
        });
      }
    }
  },
  mounted() {

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

    .el-breadcrumb {
      line-height: 60px;
    }
  }

  .user-info-content {
    overflow: hidden;
    cursor: pointer;
    height: 100%;

    .el-dropdown {
      height: 100%;
      line-height: 60px;

      .write-article {
        cursor: pointer;
        height: 80%;
      }

      .el-icon-arrow-down:before {
        line-height: 60px;
      }

      .avatar-container {
        img {
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: block;
        }
      }
    }
  }
}
</style>
