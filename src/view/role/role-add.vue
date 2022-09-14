<template>
  <div>
    <Card>
      <Form ref="roleForm" :model="roleForm" :label-width="100" :rules="roleFormRules">
        <FormItem prop="name" label="角色名">
          <Input v-model="roleForm.name"/>
        </FormItem>
        <FormItem prop="description" label="角色描述">
          <Input v-model="roleForm.description" />
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
  import {addRole} from "../../api/role";

  export default {
    name: "role-add",
    data() {
      return {
        spinShow: false,
        clearable: true,
        roleForm: {
          name: "",
          description: ""
        },
        roleFormRules: {
          name: [
            {required: true, message: "角色名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          description: [
            {required: false, message: "角色描述为0-255个字符", trigger: "blur", min: 0, max: 255}
          ]
        }
      }
    },
    methods: {
      resetForm() {
        this.$refs['roleForm'].resetFields();
      },
      handleSubmit() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            addRole(this.roleForm)
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
    },
    mounted() {
    }
  };
</script>

<style scoped lang="less">

</style>
