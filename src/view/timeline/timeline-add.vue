<template>
  <div>
    <Card>
      <Form ref="timelineForm" :model="timelineForm" :label-width="100" :rules="timelineFormRules">
        <FormItem prop="content" label="内容">
          <Input v-model="timelineForm.content" />
        </FormItem>
        <FormItem prop="pushDate" label="发布时间">
          <DatePicker v-model="timelineForm.pushDate" type="date" format="yyyy-MM-dd" :editable="editable" placeholder="发布日期" />
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
  import {addTimeline} from "../../api/timeline";

  export default {
    name: "timeline-add",
    data() {
      return {
        spinShow: false,
        clearable: true,
        editable: false,
        timelineForm: {
          content: "",
          pushDate: ""
        },
        timelineFormRules: {
          content: [
            {required: true, message: "内容长度为2-255个字符", trigger: "blur", min: 2, max: 255}
          ],
          pushDate: [
            {type: "date", required: true, message: "必须为日期格式", trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      resetForm() {
        this.$refs['timelineForm'].resetFields();
      },
      handleSubmit() {
        this.$refs['timelineForm'].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            addTimeline(this.timelineForm)
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
