<template>
  <div>
    <Upload
      multiple
      :type="type"
      :name="name"
      :on-success="onSuccess"
      :on-error="onError"
      action="/api/image/upload">
      <div style="padding: 20px 0">
        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
        <p>点击上传图片</p>
      </div>
    </Upload>
  </div>
</template>

<script>
  export default {
    name: "image-upload",
    data() {
      return {
        type: "drag",
        name: "file"
      }
    },
    methods: {
      onSuccess(response, file, fileList) {
        if (response.request === "success" && response.status === 200) {
          this.$Message.success("上传成功");
        } else {
          this.$Message.error(response.message);
        }
      },
      onError(error, file, fileList) {
        this.$Message.error(error)
      }
    }
  };
</script>

<style scoped lang="less">

</style>
