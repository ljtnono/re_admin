<template>
  <div>
    <Card>
      <Form ref="skillForm" :model="skillForm" :label-width="100" :rules="skillFormRules">
        <FormItem prop="name" label="技能名">
          <Input v-model="skillForm.name" />
        </FormItem>
        <FormItem prop="owner" label="所有者">
          <Input v-model="skillForm.owner" />
        </FormItem>
        <FormItem prop="percent" label="得分">
          <InputNumber v-model="skillForm.percent" min="0" max="100" step="1" style="width: 100%;"/>
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
  import {addSkill} from "../../api/skill";

  export default {
    name: "skill-add",
    data() {
      return {
        spinShow: false,
        clearable: true,
        skillForm: {
          name: "",
          owner: "",
          percent: 0
        },
        skillFormRules: {
          name: [
            {required: true, message: "技能名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          owner: [
            {required: true, message: "所有者为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          percent: [
            {type: "integer", required: true, message: "分数为0-100", trigger: "blur", min: 0, max: 100}
          ]
        }
      }
    },
    methods: {
      resetForm() {
        this.$refs['skillForm'].resetFields();
      },
      handleSubmit() {
        this.$refs['skillForm'].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            addSkill(this.skillForm)
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

<style scoped lang="less">

</style>
