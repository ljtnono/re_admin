<template>
  <div class="container flex flex-direction-row">
    <Navigation class="flex navigation" :collapseStatus="collapseStatus" :menus="menus"/>
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
      clientWidth: document.body.clientWidth,
      clientHeight: document.body.clientHeight
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
    },
    // 设置用户信息
    setUserInfo() {
      let userInfo = sessionStorage.getItem("userInfo");
      if (userInfo != null) {
        this.avatar = JSON.parse(userInfo).avatar;
      }
    }
  },
  mounted() {
    this.getMenus();
    this.setUserInfo();
    this.windowOnResize();
  }
}
</script>


<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  // 设置最小高度和最小宽度
  min-height: 1100px;
  min-width: 1400px;
  margin: 0;
  padding: 0;
  overflow: hidden;

  .navigation {
    height: 100%;
  }

  .content-container {
    height: 100%;
    flex: 1;
  }
}
</style>
