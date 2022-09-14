<template>
  <div>
    <Card>
      <Form ref="timelineForm" :model="timelineForm" :label-width="100" :rules="timelineFormRules">
        <FormItem prop="id" label="时间轴ID">
          <Input v-model="timelineForm.id" disabled/>
        </FormItem>
        <FormItem prop="content" label="时间轴内容">
          <Input v-model="timelineForm.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}"/>
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
  import {getTimelineById, updateTimeline} from "../../api/timeline";

  export default {
    name: "timeline-detail",
    data() {
      return {
        timelineId: 1001,
        spinShow: false,
        clearable: true,
        editable: false,
        timelineForm: {
          id: 1001,
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
      getTimelineById(timelineId) {
        getTimelineById(timelineId)
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              let data = res.data.data[0];
              this.timelineForm.id = data.id;
              this.timelineForm.content = data.content;
              this.timelineForm.pushDate = data.pushDate;
            } else {
              this.$Message.error("请求错误，请重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      },
      resetForm() {
        this.$refs["timelineForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["timelineForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            updateTimeline(this.timelineForm)
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
      let timelineId = this.$route.params.timelineId;
      this.timelineId = timelineId;
      if (timelineId) {
        this.getTimelineById(timelineId);
      } else {
        // 显示错误信息
        this.$Message.error("timelineId不存在");
      }
    }
  };
</script>

<style scoped lang="less">

</style>
