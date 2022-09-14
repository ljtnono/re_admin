<template>
  <div>
    <Card>
      <Timeline>
        <TimelineItem v-for="timeline in timelineList" :key="timeline.id" v-if="timeline.status === 1">
          <p class="time">{{timeline.pushDate | timeFormat}}</p>
          <p class="content" v-html="timeline.content"></p>
        </TimelineItem>
      </Timeline>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
  import {listTimelineAll} from "../../api/timeline";

  export default {
    name: "timeline-log",
    data() {
      return {
        timelineList: [],
        spinShow: false
      }
    },
    methods: {
      listTimelineAll() {
        this.spinShow = true;
        listTimelineAll()
        .then(res => {
          this.timelineList = res.data.data;
          this.spinShow = false;
        }).catch(e => {
          this.$Message.error(e);
          this.spinShow = false;
        });
      }
    },
    mounted() {
      this.listTimelineAll();
    }
  };
</script>

<style scoped lang="less">
  .time{
    font-size: 14px;
    font-weight: bold;
  }
  .content{
    padding-left: 5px;
  }
</style>
