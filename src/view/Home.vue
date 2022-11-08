<template>
  <div class="container flex flex-direction-row">
    <Navigation class="flex" :collapseStatus="collapseStatus" :menus="menus"/>
    <div class="content-container flex flex-direction-column">
      <Header @toggleNav="toggleNav" :avatar="avatar"/>
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from '@c/Header.vue';
import Navigation from '@c/Navigation.vue';

export default {
  name: 'Home',
  data() {
    return {
      collapseStatus: false,
      menus: null,
      avatar: "",
      clientWidth: document.body.clientWidth
    }
  },
  components: {
    Header,
    Navigation
  },
  watch: {
    clientWidth(newVal) {
      this.collapseStatus = newVal < 2000;
    }
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
    }
  },
  mounted() {
    this.getMenus();
    let userInfo = sessionStorage.getItem("userInfo");
    if (userInfo != null) {
      this.avatar = JSON.parse(userInfo).avatar;
    }
    let that = this;
    window.onresize = () => {
      return (() => {
        window.clientWidth = document.body.clientWidth;
        that.clientWidth = window.clientWidth;
      })();
    };
  }
}
</script>


<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  min-width: 1600px;

  .content-container {
    height: 100%;
    width: 100%;
    min-width: 1344px;
  }
}
</style>
