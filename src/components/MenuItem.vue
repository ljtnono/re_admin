<template>
  <div>
    <!-- 如果存在子菜单 -->
    <el-sub-menu v-if="item.children" :index="item.title">
      <template #title>
        <i v-if="item.icon" :class="'iconfont ' + item.icon" />
        <span style="margin-left: 10px">
          {{ item.title }}
        </span>
      </template>
      <template v-for="child in item.children" :key="child.title">
        <menu-item :item="child" />
      </template>
    </el-sub-menu>
    <!-- 如果不存在子菜单 -->
    <el-menu-item v-else :index="item.title" @click="$router.push({ path: item.routePath })">
      <i v-if="item.icon" :class="'iconfont ' + item.icon" />
      <span style="margin-left: 15px">
        {{ item.title }}
      </span>
    </el-menu-item>
  </div>
</template>

<script setup>
defineOptions({ name: "MenuItem" });

defineProps({
  item: {
    type: Object
  }
});
</script>

<style scoped lang="scss">
.el-menu--collapse > div > .el-sub-menu > .el-sub-menu__title span {
  height: 0;
  width: 0;
  overflow: hidden;
  visibility: hidden;
  display: inline-block;
}
.el-menu--collapse > div > .el-sub-menu > .el-sub-menu__title .el-sub-menu__icon-arrow {
  display: none;
}
</style>
