<template>
  <div>
    <Card>
      <Form ref="searchForm" :model="searchForm" inline>
        <FormItem prop="originName">
          <Input type="text" v-model="searchForm.originName" placeholder="请输入图片名"/>
        </FormItem>
        <FormItem prop="type">
          <Input type="text" v-model="searchForm.type" placeholder="请输入图片类型"/>
        </FormItem>
        <FormItem prop="name">
          <Input type="text" v-model="searchForm.owner" placeholder="请输入所有者"/>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-search" @click="search(1, pageSize)">搜索</Button>
        </FormItem>
      </Form>
      <Table :columns="columns"
             :data="tableData"
             :loading="loading"
             :size="size"
             ref="table">
        <template slot-scope="{ row, index }" slot="action">
          <Button type="error" size="small" style="margin-right: 5px" @click="del(row)">删除</Button>
        </template>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="totalCount" :current="current" :page-size="pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import moment from "moment";
  import {listImagePage, search, deleteImage} from "../../api/image";

  export default {
    name: "image-list",
    data() {
      return {
        columns: [
          {type: "selection", width: 50, align: "left"},
          {title: "id", key: "id", width: 80, align: "left", tooltip: true},
          {title: "图片名", key: "originName", align: "left", tooltip: true},
          {title: "图片大小", key: "size", align: "left"},
          {title: "图片类型", key: "type", align: "left"},
          {title: "图片url", key: "url", align: "left", tooltip: true},
          {title: "上传者", key: "owner", align: "left"},
          {
            title: "缩略图",
            align: "left",
            key: "url",
            render: function (h, params) {
              return h('img', {
                attrs: {
                  width: "50",
                  height: "50",
                  src: this.row.url
                }
              });
            }
          },
          {
            title: "创建时间",
            key: "createTime",
            align: "left",
            render: function (h, params) {
              return h('div', moment(this.row.createTime).format("YYYY-MM-DD"));
            }
          },
          {
            title: "修改时间",
            key: "modifyTime",
            align: "left",
            render (h, params) {
              return h('div', moment(this.row.modifyTime).format("YYYY-MM-DD"));
            }
          },
          {
            title: "状态",
            key: "status",
            align: "left",
            render (h, params) {
              return h('div', this.row.status === 1 ? "正常" : "已删除");
            }
          },
          {title: "操作", slot: "action", align: "left"}
        ],
        tableData: [],
        loading: false,
        size: "default",
        totalCount: 10,
        totalPages: 1,
        pageSize: 10,
        current: 1,
        searchFlag: false,
        searchForm: {
          originName: "",
          type: "",
          owner: ""
        }
      }
    },
    methods: {
      changePage(current) {
        this.current = current;
        if (this.searchFlag) {
          this.search(current, this.pageSize);
        } else {
          this.listImagePage(current, this.pageSize);
        }
      },
      del(row) {
        if (row.status === 1) {
          this.$Modal.confirm({
            title: "是否删除",
            onOk: () => {
              deleteImage(row.id).then(res => {
                if (res.data.request === "success" && res.data.status === 200) {
                  this.$Message.success("删除成功");
                } else {
                  this.$Message.error("删除失败");
                }
              }).catch(e => {
                this.$Message.error(e);
              });
            }
          });
        } else {
          this.$Message.info("该项已删除");
        }
      },
      search(page, count) {
        let pageParam = {
          page: page,
          count: count
        };
        this.loading = true;
        search(this.searchForm, pageParam)
          .then(res => {
            this.tableData = res.data.data;
            this.loading = false;
            this.current = pageParam.page;
            this.totalCount = parseInt(res.data.fields.totalCount);
            this.totalPages = parseInt(res.data.fields.totalPages);
            this.searchFlag = true;
          }).catch(e => {
          this.loading = false;
          this.$Message.error(e);
        });
      },
      listImagePage(page, count) {
        this.loading = true;
        listImagePage(page, count).then(res => {
          this.tableData = res.data.data;
          this.loading = false;
          this.current = page;
          this.totalCount = parseInt(res.data.fields.totalCount);
          this.totalPages = parseInt(res.data.fields.totalPages);
        });
      }
    },
    mounted() {
      this.listImagePage(1, 10);
    }
  };
</script>

<style scoped lang="less">

</style>
