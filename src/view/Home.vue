<template>
  <div class="container flex flex-direction-row">
    <Navigation :collapseStatus="collapseStatus" :menus="menus"/>
    <Header @toggleNav="toggleNav" :avatar="avatar"/>
    <Main/>
  </div>
</template>

<script>
import Header from '@c/Header.vue';
import Navigation from '@c/Navigation.vue';
import Main from '@c/Main.vue'

export default {
  name: 'Home',
  data() {
    return {
      collapseStatus: false,
      menus: null,
      avatar: ""
    }
  },
  components: {
    Header,
    Navigation,
    Main
  },
  methods: {
    // 获取menus
    getMenus() {
      let menusObj = sessionStorage.getItem("menus");
      if (menusObj == null) {
        // 如果sessionStorage中的数据不对，那么应该清除信息，并返回登录界面
      } else {
        this.menus = JSON.parse(menusObj);
      }
    },
    // 切换导航菜单的折叠状态
    toggleNav() {
      this.collapseStatus = !this.collapseStatus;
    },
  },
  mounted() {
    this.getMenus();
    let userInfo = sessionStorage.getItem("userInfo");
    if (userInfo != null) {
      this.avatar = JSON.parse(userInfo).avatar;
    }
  }
}
</script>


<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
}
</style>
