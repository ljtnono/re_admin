<template>
  <div>
    <Card>
      <Form ref="linkForm" :model="linkForm" :label-width="100" :rules="linkFormRules">
        <FormItem prop="id" label="链接ID">
          <Input v-model="linkForm.id" disabled/>
        </FormItem>
        <FormItem prop="url" label="链接地址">
          <Input v-model="linkForm.url"/>
        </FormItem>
        <FormItem prop="name" label="链接名">
          <Input v-model="linkForm.name" />
        </FormItem>
        <FormItem prop="type" label="链接分类">
          <Select v-model="linkForm.type" :clearable="clearable">
            <Option v-for="item in linkTypeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
          </Select>
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
  import {updateLink, getLinkById} from "../../api/link";
  import {listLinkTypeAll} from "../../api/linkType";

  export default {
    name: "link-detail",
    data() {
      return {
        linkId: 1001,
        spinShow: false,
        clearable: true,
        linkTypeList: [],
        linkForm: {
          id: 1001,
          url: "",
          name: "",
          type: ""
        },
        linkFormRules: {
          url: [
            {required: true, message: "链接地址必须符合url规范", trigger: "blur", type: "url"}
          ],
          name: [
            {required: true, message: "链接名为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          type: [
            {required: true, message: "必须选择一种链接类型", trigger: "blur"}
          ]
        }
      }
    },
    methods: {
      getLinkById(linkId) {
        getLinkById(linkId)
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              let data = res.data.data[0];
              this.linkForm.id = data.id;
              this.linkForm.name = data.name;
              this.linkForm.url = data.url;
              this.linkForm.type = data.type;
            } else {
              this.$Message.error("请求错误，请重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      },
      resetForm() {
        this.$refs["linkForm"].resetFields();
      },
      handleSubmit() {
        this.$refs["linkForm"].validate((valid) => {
          if (valid) {
            this.spinShow = true;
            updateLink(this.linkForm)
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
      },
      listLinkTypeAll() {
        listLinkTypeAll()
          .then(res => {
            if (res.data.request === "success" && res.data.status === 200) {
              this.linkTypeList = res.data.data;
            } else {
              this.$Message.error("获取链接类型失败，请刷新重试");
            }
          }).catch(e => {
          this.$Message.error(e);
        });
      }
    },
    mounted() {
      let linkId = this.$route.params.linkId;
      this.linkId = linkId;
      if (linkId) {
        this.getLinkById(linkId);
      } else {
        // 显示错误信息
        this.$Message.error("linkId不存在");
      }
      this.listLinkTypeAll();
    }
  };
</script>

<style scoped>

</style>
