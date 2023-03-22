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

<script>

import Header from "@c/Header.vue";
import Navigation from "@c/Navigation.vue";
import {findCategoryList} from "@/api/category";
import {findTagList} from "@/api/tag";
import {mapState} from "vuex";
import {findRoleList} from "@/api/role";

export default {
  name: "Home",
  data() {
    return {
      collapseStatus: false,
      clientWidth: document.body.clientWidth,
      clientHeight: document.body.clientHeight,
      toggleIconClass: "nav-toggle-a"
    };
  },
  computed: {
    ...mapState({
      menus: state => state.user.menus
    })
  },
  components: {
    Header,
    Navigation
  },
  watch: {
    clientWidth(newVal) {
      this.collapseStatus = newVal < 2000;
    },
  },
  methods: {
    navToggleClass() {
      let collapseStatus = this.collapseStatus;
      if (collapseStatus) {
        this.toggleIconClass = "nav-toggle-a-collapse";
      } else {
        this.toggleIconClass = "nav-toggle-a";
      }
    },
    // 切换导航菜单的折叠状态
    toggleNav() {
      this.collapseStatus = !this.collapseStatus;
      this.navToggleClass();
    },
    // 监听窗口大小改变
    windowOnResize() {
      let that = this;
      window.onresize = () => {
        window.clientWidth = document.body.clientWidth;
        window.clientHeight = document.body.clientHeight;
        that.clientWidth = window.clientWidth;
        that.clientHeight = window.clientHeight;
      };
    }
  },
  mounted() {
    this.windowOnResize();
    // 获取文章分类列表
    findCategoryList().then(res => {
      this.$store.commit("common/changeCategoryList", res.data.data);
    });
    // 获取文章标签列表
    findTagList().then(res => {
      this.$store.commit("common/changeTagList", res.data.data);
    });
    // 获取角色列表
    findRoleList().then(res => {
      this.$store.commit("common/changeRoleList", res.data.data);
    });
  },
};

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
