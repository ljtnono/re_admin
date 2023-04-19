<template>
  <!-- 如果存在子菜单 -->
  <el-submenu v-if="item.children" :index="item.name">
    <template #title>
      <i :class="'iconfont ' + item.icon" />
      <span style="margin-left: 10px">
        {{ item.title }}
      </span>
    </template>
    <template v-for="child in item.children">
      <menu-item :item="child" :key="child.name" />
    </template>
  </el-submenu>
  <!-- 如果不存在子菜单 -->
  <el-menu-item v-else :index="item.name" @click="$router.push({ path: item.path })">
    <i :class="'iconfont ' + item.icon" />
    <span style="margin-left: 15px">
      {{ item.title }}
    </span>
  </el-menu-item>
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

</style>
