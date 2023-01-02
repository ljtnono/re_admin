<template>
  <div class="form-container">
    <el-form ref="formData" :model="formData" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "PublishArticleForm",
  data() {
    return {
      formData: {
        title: null
      }
    }
  },
  props: {
    value: Object
  },
  methods: {

  },
  mounted() {
    this.formData = this.value;
  }
}
</script>

<style scoped lang="scss">
.form-container {

}
</style>
