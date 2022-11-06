<template>
  <div class="workspace-container p20 flex flex-direction-column flex-justify-content-space-between">
    <!-- 头部信息概览 -->
    <div class="flex workspace-header">
      helloworld
    </div>
    <!-- 服务器监控曲线图 -->
    <div class="flex">

    </div>
    <!-- 底部访问量曲线图 -->
    <div class="flex">

    </div>
  </div>
</template>

<script>
export default {
  name: "Workspace",
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.workspace-container {
  width: 100%;
  height: 100%;

  .workspace-header {
    width: 100%;
    height: 200px;
  }
}
</style>
