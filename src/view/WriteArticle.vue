<template>
  <div class="write-article-container p20 flex flex1 flex-direction-row">
    <!-- 编辑区 -->
    <div class="editor-container flex flex1">
      <mavon-editor v-model="markdownContent" style="width: 100%"/>
    </div>
    <!-- 提交表单 -->

<!--    <el-radio-group v-model="direction">-->
<!--      <el-radio label="ltr">从左往右开</el-radio>-->
<!--      <el-radio label="rtl">从右往左开</el-radio>-->
<!--      <el-radio label="ttb">从上往下开</el-radio>-->
<!--      <el-radio label="btt">从下往上开</el-radio>-->
<!--    </el-radio-group>-->

<!--    <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">-->
<!--      点我打开-->
<!--    </el-button>-->

    <el-drawer
      title="草稿箱"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose">
      <span>我来啦!</span>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "WriteArticle",
  data() {
    return {
      markdownContent: null,
      drawer: true,
      direction: "rtl",
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？").then(res => {
        done();
      }).catch(e => {

      });
    }
  }
}
</script>

<style lang="scss" scoped>
.write-article-container {

}
</style>
