<template>
  <div class="user-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入用户账号、手机号、邮箱"
          clearable @keyup.enter.native="search"/>
        <el-button
          size="mini"
          type="primary"
          @click="search"
          icon="el-icon-search">
          搜索
        </el-button>
      </div>
      <!-- 表格数据 -->
      <div class="user-table-container">
        <el-table :data="userList"
                  header-row-class-name="table-header"
                  @filter-change="handleFilterChange"
                  @selection-change="handleSelectionChange"
                  @sort-change="handleSortChange"
                  max-height="650">
          <el-table-column type="selection" align="center" width="50"/>
          <el-table-column fixed="left" prop="username" label="用户名" width="200" />
          <el-table-column prop="phone" label="手机号码" width="160" />
          <el-table-column prop="email" label="电子邮箱" width="160"/>
          <el-table-column prop="avatar" label="头像" width="200" align="center" >
            <template #default="{ row, column, $index }">
              <img :src="row.avatarUrl" :alt="row.username" style="width: 60px; height: 60px"/>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom" width="160">
            <template #default="{ row, column, $index }">
              <span class="cell-time">
                <i class="el-icon-time"/>
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="最后更新" align="center" sortable="custom" width="160">
            <template #default="{ row, column, $index }">
              <span class="cell-time">
                <i class="el-icon-time"/>
                {{ row.modifyTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row, column, $index }">
              <el-button type="text" size="mini" style="margin-right: 10px; color: #909399">
                编辑
              </el-button>
              <el-dropdown trigger="click" @command="handleOperation">
                <el-button type="text" size="mini" style="color: #909399">
                  更多
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu>
                  <el-dropdown-item :command="{opt: 'recommend', row}">推荐</el-dropdown-item>
                  <el-dropdown-item :command="{opt: 'top', row}">置顶</el-dropdown-item>
                  <el-dropdown-item :command="{opt: row.deleted === ENTITY_DELETE_STATE_NORMAL ? 'hidden' : 'show', row}">{{ row.deleted === ENTITY_DELETE_STATE_NORMAL ? '隐藏' : '显示' }}</el-dropdown-item>
                  <el-dropdown-item :command="{opt: 'delete', row}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="mt50 mb30 fr">
        <!-- 分页按钮 -->
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize"/>
      </div>
    </el-card>
  </div>
</template>

<script>
import {findUserList} from "@/api/user";
import {ENTITY_DELETE_STATE_DELETE, ENTITY_DELETE_STATE_NORMAL} from "@/constant/commonConstant";

export default {
  name: "UserManage",
  data() {
    return {
      ENTITY_DELETE_STATE_DELETE,
      ENTITY_DELETE_STATE_NORMAL,
      // 当前查询条件
      searchCondition: "",
      userList: [],
      // 当前页数
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      total: 0,
    };
  },
  methods: {
    // 分页查询用户列表
    search() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition
      }
      findUserList({...param}).then(res => {
        let data = res.data.data;
        this.userList = data.records;
        this.total = data.total;
        this.pageNum = data.current;
        this.pageSize = data.size;
      });
    },
    // 处理每页条数变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.search();
    },
    // 处理当前页数变化
    handleCurrentChange(val) {
      this.pageNum = val;
      this.search();
    },
  },
  mounted() {
    this.search();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .table-header {
  th {
    background: #fafafa;
    font-size: 14px;
    color: #000000;
  }
}

::v-deep table {
  border-spacing: 0px;
}

::v-deep .el-table {
  tr {
    font-size: 14px;
    border: none;
    height: 80px;
  }

  .cell-time {
    font-size: 12px;
  }
}

.user-manage-container {
  .search-container {
    width: auto;
    height: 40px;

    .el-input {
      width: auto;
      min-width: 280px;
    }
  }
}
</style>
