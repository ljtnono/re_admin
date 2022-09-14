<template>
  <div>
    <Row :gutter="20">
      <i-col :xs="12" :md="8" :lg="4" v-for="(infor, i) in inforCardData" :key="`infor-${i}`" style="height: 120px;padding-bottom: 10px;">
        <infor-card shadow :color="infor.color" :icon="infor.icon" :icon-size="36">
          <count-to :end="infor.count" count-class="count-style"/>
          <p>{{ infor.title }}</p>
        </infor-card>
      </i-col>
    </Row>
    <Row :gutter="20" style="margin-top: 10px;">
      <i-col :md="24" :lg="8" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-pie style="height: 300px;" :value="pieData" text="用户访问来源"></chart-pie>
        </Card>
      </i-col>
      <i-col :md="24" :lg="16" style="margin-bottom: 20px;">
        <Card shadow>
          <chart-bar style="height: 300px;" :value="barData" text="每周用户活跃量"/>
        </Card>
      </i-col>
    </Row>
    <Row>
      <Card shadow>
        <example style="height: 310px;"/>
      </Card>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import { ChartPie, ChartBar } from '_c/charts'
import Example from './example.vue'
import {adminIndexData} from "../../../api/app";

export default {
  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      inforCardData: [
        { title: '总浏览量', icon: 'ios-eye-outline', count: 803, color: '#2d8cf0' },
        { title: '总文章数', icon: 'ios-book', count: 232, color: '#19be6b' },
        { title: '总评论数', icon: 'md-chatboxes', count: 142, color: '#ff9900' },
        { title: '友情链接', icon: 'md-link', count: 657, color: '#ed3f14' },
        { title: '文章类型', icon: 'ios-keypad', count: 12, color: '#E46CBB' },
        { title: '用户人数', icon: 'md-person', count: 3, color: '#9A66E4' }
      ],
      pieData: [
        { value: 335, name: '直接访问' },
        { value: 310, name: '邮件营销' },
        { value: 234, name: '联盟广告' },
        { value: 135, name: '视频广告' },
        { value: 1548, name: '搜索引擎' }
      ],
      barData: {
        Mon: 13253,
        Tue: 34235,
        Wed: 26321,
        Thu: 12340,
        Fri: 24643,
        Sat: 1322,
        Sun: 1324
      }
    }
  },
  methods: {
    adminIndexData() {
      adminIndexData().then(res => {
        let data = res.data;
        if (data.request === "success" && data.status === 200) {

        }
      }).catch(error => {
        console.log(error);
      });
    }
  },
  mounted () {
    // 获取用户信息
    this.adminIndexData();
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
