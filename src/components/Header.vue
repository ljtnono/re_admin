<template>
  <div id="header">
    <div class="header-bar flex flex-direction-row">
      <a type="text" href="javascript:;" class="nav-trigger-a flex  flex-align-items-center" @click="collapseMenu()">
        <i class="el-icon-s-fold" />
      </a>
      <div class="custom-bread-crumb"></div>
      <div class="custom-content-con"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {

    }
  },
  components: {

  },
  methods: {
    collapseMenu() {
      this.$emit("")
    }
  }
}
</script>


<style lang="scss" scoped>
#header {
  width: 100%;
  height: 80px;
  padding: 0 20px;
  background: #fff;

  .header-bar {
    position: relative;
    line-height: 80px;
    height: 100%;
    padding: 10px 0;

    .nav-trigger-a {
      width: 80px;
      height: 60px;
      font-size: 30px;
      i {
        vertical-align: center;
        color: #5c6b77;
      }
    }
  }

}
</style>
