<template>
  <div>
    <Card>
      <Form ref="userForm" :model="userForm" :label-width="100" :rules="userFormRules">
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
  import {addUser} from "../../api/user";

  export default {
    name: "user-add",
    data() {
      return {
        spinShow: false,
        clearable: true,
        userForm: {
          username: "",
          password: "",
          qq: "",
          tel: "",
          email: ""
        },
        userFormRules: {
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
      resetForm() {
        this.$refs['userForm'].resetFields();
      },
      handleSubmit() {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            addUser(this.userForm)
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
