<template>
  <div class="nav-container">
    <el-menu
    class="nav-menu"
    background-color="#001529"
    text-color="#ffffff"
    active-text-color="rgba(255, 255, 255, 0.7);"
    collapse-transition
    >
      <!-- 导航栏上面的logo -->
      <div class="nav-logo-container p10">
        <img class="nav-logo-max" src="@a/images/logo.png" />
        <img class="nav-logo-min" src="@a/images/logo-min.png" style="display: none;" />
      </div>
      <el-submenu index="1" >
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">导航一</span>
        </template>
        <el-menu-item-group>
          <span slot="title">分组一</span>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <span slot="title">选项4</span>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'Navigation',
  data() {
    return {

    }
  },
  components: {

  },
  methods: {

  }
}
</script>


<style lang="scss" scoped>
.nav-container{
  height: 100%;
  
  .nav-menu {
    height: 100%;
    width: 256px;
    min-width: 256px;
    max-width: 256px;
    flex: 0 0 256px;
    overflow: hidden;
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