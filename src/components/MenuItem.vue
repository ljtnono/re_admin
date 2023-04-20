<template>
  <div>
    <!-- 如果存在子菜单 -->
    <el-submenu v-if="item.children" :index="item.title">
      <template #title>
        <i v-if="item.icon" :class="'iconfont ' + item.icon" />
        <span style="margin-left: 10px">
        {{ item.title }}
      </span>
      </template>
      <template v-for="child in item.children">
        <menu-item :item="child" :key="child.title" />
      </template>
    </el-submenu>
    <!-- 如果不存在子菜单 -->
    <el-menu-item v-else :index="item.title" @click="$router.push({ path: item.routePath })">
      <i v-if="item.icon" :class="'iconfont ' + item.icon" />
      <span style="margin-left: 15px">
      {{ item.title }}
    </span>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    item: {
      type: Object
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu--collapse > div > .el-submenu > .el-submenu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
.el-menu--collapse > div > .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
  display: none;
}

</style>
