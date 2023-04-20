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
      <el-menu-item style="text-align: center; cursor: pointer" @click="$router.push({ name: 'Workspace' })">
        <a href="javascript:" v-show="!collapseStatus" style="width: 100%; height: 100%; display: inline-block">
          工作台
        </a>
        <div v-show="collapseStatus">
          <a href="javascript:" style="width: 100%; height: 100%; display: inline-block">
            <i class="el-icon-location" style="display: inline-block !important"/>
          </a>
        </div>
      </el-menu-item>
      <!-- 递归嵌套设置子菜单 -->
      <template v-for="item in menus">
        <menu-item :item="item" :key="item.name" />
      </template>
    </el-menu>
  </div>
</template>

<script>
import MenuItem from "@c/MenuItem.vue";

export default {
  name: "Navigation",
  data() {
    return {
      collapseTransition: true
    };
  },
  props: {
    collapseStatus: Boolean,
    menus: {
      type: Array,
    },
  },
  components: {
    MenuItem
  },
  methods: {},
  mounted() {

  },
};
</script>

<style lang="scss" scoped>
.el-menu {
  width: 256px;
  overflow-x: hidden;
  height: 100%;
  position: relative;

  .el-submenu {
    .el-submenu__title {
      float: left;
    }

    .el-submenu__icon-arrow {
      display: inline-block !important;
    }

    .el-menu-item {
      min-width: 180px;
    }
  }
}

// 折叠菜单后隐藏小箭头
.el-menu--collapse {
  width: 64px;

  ::v-deep .el-submenu__title {
    text-align: center;
  }

  ::v-deep .el-submenu__icon-arrow {
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
