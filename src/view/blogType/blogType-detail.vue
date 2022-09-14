<template>
  <div>
    <Card>
      <Form ref="blogTypeForm" :model="blogTypeForm" :label-width="100" :rules="blogTypeFormRules">
        <FormItem prop="id" label="博客类型ID">
          <Input v-model="blogTypeForm.id" disabled/>
        </FormItem>
        <FormItem prop="name" label="博客类型名字">
          <Input v-model="blogTypeForm.name"/>
        </FormItem>
        <FormItem prop="description" label="博客类型描述">
          <Input v-model="blogTypeForm.description" :autosize="{minRows: 3,maxRows: 5}" type="textarea"/>
        </FormItem>
        <FormItem>
          <Button type="error" icon="md-refresh" @click="resetForm" style="margin-right: 10px;">重置</Button>
          <Button type="primary" @click="handleSubmit">提交</Button>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
  import {getBlogTypeById, updateBlogType} from "../../api/blogType";

  export default {
    name: "blogType-detail",
    data() {
      return {
        blogTypeId: 10001,
        spinShow: false,
        blogTypeForm: {
          id: 10001,
          name: "",
          description: ""
        },
        blogTypeFormRules: {
          name: [
            {required: true, message: "name属性为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          description: [
            {message: "description为0-255个字符", trigger: "blur", min: 0, max: 255}
          ]
        }
      };
    },
    methods: {
      getBlogTypeById(blogTypeId) {
        getBlogTypeById(blogTypeId)
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              let data = res.data.data[0];
              this.blogTypeForm.id = data.id;
              this.blogTypeForm.name = data.name;
              this.blogTypeForm.description = data.description;
            } else {
              this.$Message.error("请求错误，请重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      },
      resetForm() {
        this.$refs["blogTypeForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["blogTypeForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            updateBlogType(this.blogTypeForm)
              .then(res => {
                if (res.data.request === "success" && res.data.status === 200) {
                  this.$Message.success(res.data.message);
                } else {
                  this.$Message.error("操作失败，请重试");
                }
                this.spinShow = false;
              }).catch(e => {
              this.spinShow = false;
              this.$Message.error(e);
            });
          } else {
            this.$Message.error("请检查是否填写正确");
          }
        });
      }
    },
    mounted() {
      let blogTypeId = this.$route.params.blogTypeId;
      this.blogTypeId = blogTypeId;
      if (blogTypeId) {
        this.getBlogTypeById(blogTypeId);
      } else {
        // 显示错误信息
        this.$Message.error("blogId不存在");
      }
    }
  };
</script>

<style scoped lang="less">

</style>
