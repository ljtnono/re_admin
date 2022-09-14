<template>
  <div>
    <Card>
      <Form ref="searchForm" :model="searchForm" inline>
        <FormItem prop="name">
          <Input type="text" v-model="searchForm.username" placeholder="请输入用户名"/>
        </FormItem>
        <FormItem prop="tel">
          <Input type="text" v-model="searchForm.tel" placeholder="请输入手机号码"/>
        </FormItem>
        <FormItem prop="email">
          <Input type="text" v-model="searchForm.email" placeholder="请输入邮箱"/>
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
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(row)">编辑</Button>
          <Button type="error" size="small" style="margin-right: 5px" @click="del(row)">删除</Button>
          <Button type="warning" size="small" style="margin-right: 5px" @click="restore(row)">恢复</Button>
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
  import {deleteUser, listUserPage, restoreUser, search} from "../../api/user";

  export default {
    name: "user-list",
    data() {
      return {
        columns: [
          {type: "selection", width: 50, align: "left"},
          {title: "id", key: "id", width: 80, align: "left"},
          {title: "用户名", key: "username", align: "left"},
          {title: "密码", key: "password", align: "left", tooltip: true},
          {title: "QQ", key: "qq", align: "left"},
          {title: "电话", key: "tel", align: "left"},
          {title: "邮箱", key: "email", align: "left"},
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
          {title: "操作", slot: "action", width: 180, align: "left"}
        ],
        tableData: [],
        editable: false,
        loading: false,
        size: "default",
        totalCount: 10,
        totalPages: 1,
        pageSize: 10,
        current: 1,
        searchFlag: false,
        searchForm: {
          username: "",
          tel: "",
          email: ""
        }
      }
    },
    methods: {
      changePage(current) {
        this.current = current;
        if (this.searchFlag) {
          this.search(current, this.pageSize);
        } else {
          this.listUserPage(current, this.pageSize);
        }
      },
      edit(row) {
        this.$router.push({
          name: "user-detail",
          params: {
            userId: row.id
          }
        });
      },
      del(row) {
        if (row.status === 1) {
          this.$Modal.confirm({
            title: "是否删除",
            onOk: () => {
              deleteUser(row.id).then(res => {
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
      restore(row) {
        if (row.status === 1) {
          this.$Message.info("正常项无需恢复");
        } else {
          this.$Modal.confirm({
            title: "是否恢复",
            onOk() {
              restoreUser(row.id).then(res => {
                if (res.data.request === "success" && res.data.status === 200) {
                  this.$Message.success("恢复成功");
                } else {
                  this.$Message.error("恢复失败");
                }
              }).catch(e => {
                this.$Message.error(e);
              });
            }
          })
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
      listUserPage(page, count) {
        this.loading = true;
        listUserPage(page, count).then(res => {
          this.tableData = res.data.data;
          this.loading = false;
          this.current = page;
          this.totalCount = parseInt(res.data.fields.totalCount);
          this.totalPages = parseInt(res.data.fields.totalPages);
        });
      }
    },
    mounted() {
      this.listUserPage(1, 10);
    }
  };
</script>

<style scoped lang="less">

</style>
