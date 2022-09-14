<template>
  <div>
    <mavon-editor
      :toolbars="markdownOption"
      v-model="blogForm.contentMarkdown"
      @change="change"
      style="height: 680px"/>
    <Button type="success" long style="margin-top: 10px;" @click="showModal = true">发布</Button>
    <Modal
      z-index=100
      v-model="showModal"
      :draggable="draggable"
      width="800"
      title="发布博客"
      ok-text="发布"
      @on-ok="ok">
      <Form ref="blogForm" :model="blogForm" :label-width="80" :rules="blogFormRules">
          <FormItem prop="title" label="博客标题">
            <Input v-model="blogForm.title" placeholder="请输入博客标题" />
          </FormItem>
          <FormItem prop="author" label="博客作者">
            <Input v-model="blogForm.author" placeholder="请输入博客作者" />
          </FormItem>
          <FormItem prop="type" label="博客类型">
            <Select v-model="blogForm.type" :clearable="clearable">
              <Option v-for="item in blogTypeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        <FormItem prop="coverImage" label="博客封面">
          <Upload
            name="file"
            :on-success="onSuccess"
            :on-error="onError"
            action="/api/image/upload">
            <img :src="blogForm.coverImage" :alt="blogForm.title" width="100" height="100"/>
            <Button icon="ios-cloud-upload-outline">点击上传</Button>
          </Upload>
        </FormItem>
          <FormItem prop="summary" label="博客简介">
            <Input v-model="blogForm.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                   placeholder="请输入博客简介" />
          </FormItem>
        </Form>
    </Modal>
  </div>
</template>

<script>
  import {listBlogTypeAll} from "../../api/blogType";
  import {getBlogById, updateBlog} from "../../api/blog";

  export default {
    name: "blog-detail",
    data() {
      return {
        showModal: false,
        clearable: true,
        draggable: true,
        zIndex: 100,
        blogTypeList: [],
        blogForm: {
          id: "",
          title: "",
          author: "",
          type: "",
          summary: "",
          coverImage: "",
          contentMarkdown: "",
          contentHtml: "",
          status: 1,
          view: 1,
          comment: 1
        },
        blogFormRules: {
          title: [
            {required: true, message: "博客标题为2-64个字符", trigger: "blur", min: 2, max: 64}
          ],
          author: [
            {required: true, message: "作者为2-20个字符", trigger: "blur", min: 2, max: 20}
          ],
          type: [
            {required: true, message: "必须选择一个类型", trigger: "blur"}
          ]
        },
        markdownOption: this.$config.markdownOption
      };
    },
    methods: {
      ok() {
        updateBlog(this.blogForm).then(res => {
          if (res.data.request === "success" && res.data.status === 200) {
            this.$Message.success("更新成功");
          } else {
            this.$Message.error("更新失败");
          }
        }).catch(e => {
          this.$Message.error(e);
        });
      },
      onSuccess(response, file, fileList) {
        if (response.request === "success" && response.status === 200) {
          this.$Message.success("上传成功");
          this.blogForm.coverImage = response.data[0].url;
        } else {
          this.$Message.error("上传失败");
        }
      },
      onError(error, file, fileList) {
        this.$Message.error(error);
      },
      change(value, render) {
        this.blogForm.contentHtml = render;
        this.blogForm.contentMarkdown = value;
      },
      listBlogTypeAll() {
        listBlogTypeAll().then(res => {
          this.blogTypeList = res.data.data;
        });
      },
      getBlogById(blogId) {
        getBlogById(blogId).then(res => {
          if (res.data.request === "success" && res.data.status === 200) {
            this.blogForm = res.data.data[0];
          } else {
            this.$Message.error("获取博客信息失败，请重试");
          }
        }).catch(e => {
          this.$Message.error(e);
        });
      }
    },
    mounted() {
      let blogId = this.$route.params.blogId;
      this.listBlogTypeAll();
      this.getBlogById(blogId);
    }
  };
</script>

<style scoped lang="less">

</style>
