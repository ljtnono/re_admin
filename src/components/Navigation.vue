<template>
  <div class="nav-container flex flex-align-items-start">
    <el-menu
      class="nav-menu"
      background-color="#001529"
      text-color="#ffffff"
      active-text-color="rgba(255, 255, 255, 0.7);"
      collapse-transition
      :collapse="collapseStatus"
    >
      <!-- 导航栏上面的logo -->
      <div class="nav-logo-container p10">
        <img class="nav-logo-max" src="@a/images/logo.png"/>
        <img class="nav-logo-min" src="@a/images/logo-min.png" style="display: none;"/>
      </div>
      <!-- 工作台 -->
      <el-menu-item style="text-align: center; cursor: pointer">
        <a href="/admin/home" >工作台</a>
      </el-menu-item>
      <!-- 循环渲染菜单 -->
      <div v-for="(m1, i1) in menuList" :key="m1">
        <!-- 包含子菜单 -->
        <div v-if="m1.subMenu !== null && m1.subMenu !== undefined">
          <el-submenu :index="i1">
            <template slot="title">
              <i class="el-icon-location "/>
              <span style="margin-left: 15px" v-show="!collapseStatus">{{ m1.menuName }}</span>
            </template>
            <div v-for="(m2, i2) in m1.subMenu" :index="i1-i2" :key="m2">
              <el-menu-item>
                <a class="ml30" :href="m2.url"> {{ m2.menuName }} </a>
              </el-menu-item>
            </div>
          </el-submenu>
        </div>
        <!-- 不包含子菜单 -->
        <el-menu-item v-if="m1.subMenu === null || m1.subMenu === undefined" :index="i1">
          <a :href="m1.url"> {{ m1.menuName }} </a>
        </el-menu-item>
      </div>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {}
  },
  props: {
    collapseStatus: Boolean,
    menuList: {
      type: Array
    }
  },
  components: {},
  methods: {}
}
</script>


<style lang="scss" scoped>

.nav-container {
  height: 100%;

  .nav-menu {
    height: 100%;
    overflow: hidden;
    min-width: 256px;

    .el-submenu {
      .el-submenu__title {
        float: left;
      }

      .el-menu-item {
        min-width: 180px;
      }
    }
  }

  .el-menu--collapse {
    min-width: 0;
  }

  .nav-logo-container {
    width: 100%;
    height: 64px;

    img {
      height: 44px;
      width: auto;
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
