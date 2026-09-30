<template>
  <div class="container flex flex-direction-row">
    <Navigation
      class="flex navigation"
      :collapseStatus="collapseStatus"
      :menus="menus"/>
    <div class="content-container flex flex1 flex-direction-column">
      <Header class="flex" @toggleNav="toggleNav" :toggle-icon-class="toggleIconClass"/>
      <router-view/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Header from "@c/Header.vue";
import Navigation from "@c/Navigation.vue";
import { findCategoryList } from "@/api/category";
import { findTagList } from "@/api/tag";
import { findRoleList } from "@/api/role";
import { useUserStore } from "@/store/user";
import { useCommonStore } from "@/store/common";

defineOptions({ name: "Home" });

const collapseStatus = ref(false);
const toggleIconClass = ref("nav-toggle-a");

const menus = computed(() => useUserStore().menus);

const navToggleClass = () => {
  toggleIconClass.value = collapseStatus.value ? "nav-toggle-a-collapse" : "nav-toggle-a";
};

// 切换导航菜单的折叠状态
const toggleNav = () => {
  collapseStatus.value = !collapseStatus.value;
  navToggleClass();
};

onMounted(() => {
  const commonStore = useCommonStore();
  // 获取文章分类列表
  findCategoryList().then((res) => {
    commonStore.changeCategoryList(res.data.data);
  }).catch(() => {});
  // 获取文章标签列表
  findTagList().then((res) => {
    commonStore.changeTagList(res.data.data);
  }).catch(() => {});
  // 获取角色列表
  findRoleList().then((res) => {
    commonStore.changeRoleList(res.data.data);
  }).catch(() => {});
});
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;

  .navigation {
    height: 100%;
  }

  .content-container {
    height: 100%;
    overflow-y: scroll;
    -ms-overflow-y: scroll;
  }
}
</style>
