<template>
  <div>
    <Card>
      <Form ref="linkTypeForm" :model="linkTypeForm" :label-width="100" :rules="linkTypeFormRules">
        <FormItem prop="id" label="链接类型ID">
          <Input v-model="linkTypeForm.id" disabled/>
        </FormItem>
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
  import {getLinkTypeById, updateLinkType} from "../../api/linkType";

  export default {
    name: "linkType-detail",
    data() {
      return {
        linkTypeId: 1001,
        spinShow: false,
        clearable: true,
        linkTypeForm: {
          id: 1001,
          name: ""
        },
        linkTypeFormRules: {
          name: [
            {required: true, message: "链接类型名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ]
        }
      }
    },
    methods: {
      getLinkTypeById(linkTypeId) {
        getLinkTypeById(linkTypeId)
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              let data = res.data.data[0];
              this.linkTypeForm.id = data.id;
              this.linkTypeForm.name = data.name;
            } else {
              this.$Message.error("请求错误，请重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      },
      resetForm() {
        this.$refs["linkTypeForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["linkTypeForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            updateLinkType(this.linkTypeForm)
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
      let linkTypeId = this.$route.params.linkTypeId;
      this.linkTypeId = linkTypeId;
      if (linkTypeId) {
        this.getLinkTypeById(linkTypeId);
      } else {
        // 显示错误信息
        this.$Message.error("linkTypeId不存在");
      }
    }
  };
</script>

<style scoped lang="less">

</style>
