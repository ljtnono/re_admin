<template>
  <div>
    <Card>
      <Form ref="blogTypeForm" :model="blogTypeForm" :label-width="100" :rules="blogTypeFormRules">
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
  import {addBlogType} from "../../api/blogType";

  export default {
    name: "blogType-add",
    data() {
      return {
        spinShow: false,
        blogTypeForm: {
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
      }
    },
    methods: {
      resetForm() {
        this.$refs['blogTypeForm'].resetFields();
      },
      handleSubmit() {
        this.$refs['blogTypeForm'].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            addBlogType(this.blogTypeForm)
              .then(res => {
                if (res.data.request === "success" && res.data.status === 200) {
                  this.$Message.success(res.data.message);
                } else {
                  this.$Message.error("请求失败，请重试");
                }
                this.spinShow = false;
              }).catch(e => {
              this.$Message.error(e);
              this.spinShow = false;
            });
          } else {
            this.$Message.error('请检查参数');
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
