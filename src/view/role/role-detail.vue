<template>
  <div>
    <Card>
      <Form ref="roleForm" :model="roleForm" :label-width="100" :rules="roleFormRules">
        <FormItem prop="id" label="角色ID">
          <Input v-model="roleForm.id" disabled/>
        </FormItem>
        <FormItem prop="name" label="角色名">
          <Input v-model="roleForm.name" />
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
  import {getRoleById, updateRole} from "../../api/role";

  export default {
    name: "role-detail",
    data() {
      return {
        roleId: 1001,
        spinShow: false,
        clearable: true,
        roleForm: {
          id: 1001,
          name: "",
          description: ""
        },
        roleFormRules: {
          name: [
            {required: true, message: "角色名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          description: [
            {required: false, message: "角色描述为0-255个字符", trigger: "blur", min: 2, max: 255}
          ]
        }
      }
    },
    methods: {
      getRoleById(linkTypeId) {
        getRoleById(linkTypeId)
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              let data = res.data.data[0];
              this.roleForm.id = data.id;
              this.roleForm.name = data.name;
              this.roleForm.description = data.description;
            } else {
              this.$Message.error("请求错误，请重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      },
      resetForm() {
        this.$refs["roleForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["roleForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            updateRole(this.roleForm)
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
      let roleId = this.$route.params.roleId;
      this.roleId = roleId;
      if (roleId) {
        this.getRoleById(roleId);
      } else {
        // 显示错误信息
        this.$Message.error("roleId不存在");
      }
    }
  };
</script>

<style scoped lang="less">

</style>
