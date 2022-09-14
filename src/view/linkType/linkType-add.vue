<template>
  <div>
    <Card>
      <Form ref="linkTypeForm" :model="linkTypeForm" :label-width="100" :rules="linkTypeFormRules">
        <FormItem prop="name" label="链接类型名">
          <Input v-model="linkTypeForm.name" />
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
  import {addLinkType} from "../../api/linkType";

  export default {
    name: "linkType-add",
    data() {
      return {
        spinShow: false,
        clearable: true,
        linkTypeForm: {
          name: ""
        },
        linkTypeFormRules: {
          name: [
            {required: true, message: "链接类型名只能为2-20个字符", min: 2, max: 20}
          ]
        }
      }
    },
    methods: {
      resetForm() {
        this.$refs["linkTypeForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["linkTypeForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            addLinkType(this.linkTypeForm)
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
