<template>
  <div>
    <Card>
      <Form ref="userForm" :model="userForm" :label-width="100" :rules="userFormRules">
        <FormItem prop="id" label="用户ID">
          <Input v-model="userForm.id" disabled/>
        </FormItem>
        <FormItem prop="username" label="用户名">
          <Input v-model="userForm.username" />
        </FormItem>
        <FormItem prop="password" label="密码">
          <Input v-model="userForm.password" />
        </FormItem>
        <FormItem prop="qq" label="QQ">
          <Input v-model="userForm.qq" />
        </FormItem>
        <FormItem prop="tel" label="手机号码">
          <Input v-model="userForm.tel" />
        </FormItem>
        <FormItem prop="email" label="邮箱">
          <Input v-model="userForm.email" />
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
  import {getUserById, updateUser} from "../../api/user";

  export default {
    name: "user-detail",
    data() {
      return {
        userId: 1001,
        spinShow: false,
        clearable: true,
        userForm: {
          id: 1001,
          username: "",
          password: "",
          qq: "",
          tel: "",
          email: ""
        },
        roleFormRules: {
          username: [
            {required: true, message: "用户名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          password: [
            {required: true, message: "密码为6-32个字符", trigger: "blur", min: 6, max: 32}
          ],
          email: [
            {type: "email", required: false, message: "必须符合email格式", trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      getUserById(userId) {
        getUserById(userId)
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              let data = res.data.data[0];
              this.userForm.id = data.id;
              this.userForm.username = data.username;
              this.userForm.password = data.password;
              this.userForm.qq = data.qq;
              this.userForm.tel = data.tel;
              this.userForm.email = data.email;
            } else {
              this.$Message.error("请求错误，请重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      },
      resetForm() {
        this.$refs["userForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["userForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            updateUser(this.userForm)
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
      let userId = this.$route.params.userId;
      this.userId = userId;
      if (userId) {
        this.getUserById(userId);
      } else {
        // 显示错误信息
        this.$Message.error("userId不存在");
      }
    }
  };
</script>

<style scoped lang="less">

</style>
