<template>
  <div>
    <el-menu
      background-color="#001529"
      text-color="#ffffff"
      active-text-color="rgba(255, 255, 255, 0.7);"
      :collapse-transition="collapseTransition"
      :collapse="collapseStatus">
      <!-- 导航栏上面的logo -->
      <div class="nav-logo-container mb10">
        <img class="nav-logo-max" v-show="!collapseStatus" src="@a/images/logo.png"/>
        <img class="nav-logo-min" v-show="collapseStatus" src="@a/images/logo-min.png"/>
      </div>
      <!-- 工作台 -->
      <el-menu-item style="text-align: center; cursor: pointer" @click="$router.push({ name: 'Workspace' })">
        <a href="javascript:;" v-show="!collapseStatus" style="width: 100%; height: 100%; display: inline-block">
          工作台
        </a>
        <div v-show="collapseStatus">
          <a href="javascript:;" style="width: 100%; height: 100%; display: inline-block">
            <i class="el-icon-location" style="display: inline-block !important"/>
          </a>
        </div>
      </el-menu-item>
      <!-- 循环渲染菜单 -->
      <div v-for="(m1, i1) in menus" :key="m1.name">
        <!-- 包含子菜单 -->
        <div v-if="m1.children !== null && m1.children !== undefined">
          <el-submenu :index="i1 + ''">
            <div slot="title">
              <i :class="'iconfont' + ' ' + m1.icon"/>
              <span style="margin-left: 15px" v-show="!collapseStatus">
                {{ m1.title }}
              </span>
            </div>
            <div v-for="m2 in m1.children" :key="m2.name">
              <el-menu-item @click="$router.push({ path: m2.path })">
                <a class="ml30" href="javascript:;" style="width: 100%; height: 100%; display: inline-block">
                  {{ m2.title }}
                </a>
              </el-menu-item>
            </div>
          </el-submenu>
        </div>
        <!-- 不包含子菜单 -->
        <el-menu-item v-if="m1.children === null || m1.children === undefined" :index="i1"
                      @click="$router.push({ path: m1.path })">
          <a href="javascript:;"> {{ m1.name }} </a>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
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
  components: {},
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
