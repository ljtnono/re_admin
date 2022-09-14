<template>
  <div>
    <Card>
      <Form ref="skillForm" :model="skillForm" :label-width="100" :rules="skillFormRules">
        <FormItem prop="id" label="技能ID">
          <Input v-model="skillForm.id" disabled/>
        </FormItem>
        <FormItem prop="name" label="技能名">
          <Input v-model="skillForm.name" />
        </FormItem>
        <FormItem prop="owner" label="所有者">
          <Input v-model="skillForm.owner" />
        </FormItem>
        <FormItem prop="percent" label="得分">
          <InputNumber v-model="skillForm.percent" min="0" max="100" style="width: 100%;"/>
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
  import {getSkillById, updateSkill} from "../../api/skill";

  export default {
    name: "skill-detail",
    data() {
      return {
        skillId: 1001,
        spinShow: false,
        clearable: true,
        skillForm: {
          id: 1001,
          name: "",
          owner: "",
          percent: 0
        },
        skillFormRules: {
          name: [
            {required: true, message: "技能名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          owner: [
            {required: true, message: "所有者名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          percent: [
            {type: "integer", required: true, message: "得分为0-100", trigger: "blur", min: 0, max: 100}
          ]
        }
      }
    },
    methods: {
      getSkillById(skillId) {
        getSkillById(skillId)
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              let data = res.data.data[0];
              this.skillForm.id = data.id;
              this.skillForm.name = data.name;
              this.skillForm.owner = data.owner;
              this.skillForm.percent = data.percent;
            } else {
              this.$Message.error("请求错误，请重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      },
      resetForm() {
        this.$refs["skillForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["skillForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            updateSkill(this.skillForm)
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
      let skillId = this.$route.params.skillId;
      this.skillId = skillId;
      if (skillId) {
        this.getSkillById(skillId);
      } else {
        // 显示错误信息
        this.$Message.error("skillId不存在");
      }
    }
  };
</script>

<style scoped lang="less">

</style>
