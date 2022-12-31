<template>
  <div class="user-manage-container">
    <div class="table-container">
      <el-card class="card">
        <!-- 用户名、手机号、邮箱搜索栏 -->
        <div class="table-search-container flex flex-direction-row flex-justify-content-start mb20">
          <el-input
            class="mr20"
            v-model="searchCondition"
            placeholder="输入用户名、邮箱、手机号搜索"
            clearable/>
          <el-button class="btn-submit" type="primary" @click="search">搜索</el-button>
          <el-button class="btn-submit" type="primary">更多</el-button>
        </div>
        <!-- 表格显示栏 -->
        <div class="flex table-content-container">
          <el-table :data="userList" stripe border max-height="600">
            <el-table-column type="selection" width="40" />
            <el-table-column prop="avatarUrl" label="头像" min-width="80">
              <template slot-scope="scope">
                <div class="img-avatar-container">
                  <img :src="scope.row.avatarUrl" :alt="scope.row.username" />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" min-width="160" />
            <el-table-column prop="phone" label="手机号码" min-width="120" />
            <el-table-column prop="email" label="邮箱" min-width="200" />
            <el-table-column
              prop="createTime"
              sortable
              label="创建时间"
              min-width="160"
            />
            <el-table-column
              prop="modifyTime"
              sortable
              label="最后修改时间"
              min-width="160"
            />
            <el-table-column prop="roleIdList" label="角色" min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.deleted === 1 ? "已删除" : "正常" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="deleted" label="是否删除" min-width="160">
              <template slot-scope="scope">
                <span>{{ scope.row.deleted === 1 ? "已删除" : "正常" }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" min-width="160">
              <template slot-scope="scope">
                <el-button size="mini">编辑</el-button>
                <el-button size="mini" type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="flex mt30">
          <!-- 分页按钮 -->
          <el-pagination background layout="prev, pager, next" :total="1000" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import "../mock/system";
import axios from "axios";

export default {
  name: "UserManage",
  data() {
    return {
      // 当前查询条件
      searchCondition: "",
      userList: [],
      // 当前页数
      page: 1,
      // 每页条数
      size: 10,
    };
  },
  methods: {
    search(page, size, searchCondition) {
      axios.get("/api-backend/system/user/list").then((res) => {
        let outerData = res.data;
        let innerData = outerData.data;
        this.userList = innerData;
      });
    },
  },
  mounted() {
    this.search(this.page, this.size, this.searchCondition);
  },
};
</script>

<style lang="scss" scoped>
.user-manage-container {
  height: calc(100% - 60px);
  margin: 20px auto;
  width: 1100px;

  .table-container {
    width: 100%;
    height: 100%;

    .img-avatar-container {
      width: 40px;
      height: 40px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 50%;

      img {
        margin: 0 auto;
        display: block;
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }

    .el-table .el-table__cell {
      padding: 0;
    }

    .card {
      min-height: 760px;
    }

    .table-search-container {
      width: auto;
      height: 40px;

      .el-input {
        width: auto;
        min-width: 280px;
      }
    }
  }
}
</style>
