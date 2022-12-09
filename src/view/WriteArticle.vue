<template>
  <div class="write-article-container p20 flex flex1 flex-direction-row">
    <!-- 草稿列表 -->
    <div class="draft-list-container">

    </div>
    <!-- 编辑区 -->
    <div class="editor-container">
      <mavon-editor v-model="markdownContent"/>
    </div>
  </div>
</template>

<script>
export default {
  name: "WriteArticle",
  data() {
    return {
      markdownContent: null
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
