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
        <!-- 新增用户接口 -->
        <el-button
          size="mini"
          type="success"
          @click="addFormVisible = true"
          icon="el-icon-plus">
          新增
        </el-button>
        <!-- 更多操作下拉菜单 -->
        <el-dropdown class="ml10" trigger="click" @command="handleSelectionOperation">
          <el-button type="info" :disabled="selectionButtonDisabled" icon="el-icon-arrow-down">
            更多操作
            <el-dropdown-menu>
              <el-dropdown-item command="recommend">推荐</el-dropdown-item>
              <el-dropdown-item command="top">置顶</el-dropdown-item>
              <el-dropdown-item command="hidden">隐藏</el-dropdown-item>
              <el-dropdown-item command="show">显示</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-button>
        </el-dropdown>
      </div>
      <!-- 表格数据 -->
      <div class="user-table-container">
        <el-table :data="userList"
                  header-row-class-name="table-header"
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
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom" width="200">
            <template #default="{ row, column, $index }">
              <span class="cell-time">
                <i class="el-icon-time"/>
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="最后更新" align="center" sortable="custom" width="200">
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
              <el-button type="text" size="mini" style="margin-right: 10px; color: #909399">
                删除
              </el-button>
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
      <!-- 新增用户表单模态弹窗 -->
      <div class="publish-form-container">
        <el-dialog
          title="新增用户"
          @open="addFormOpen"
          top="4vh"
          center
          :visible.sync="addFormVisible">
          <template slot="footer">
            <span class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitAddForm('addForm')">确 定</el-button>
            </span>
          </template>
          <!-- 新增用户表单 -->
          <el-form ref="addForm" :model="addForm" label-width="100px" >
            <el-form-item label="用户名：" prop="title" class="is-required">
              <el-input v-model="addForm.username" clearable placeholder="请输入用户名"/>
            </el-form-item>
            <el-form-item label="密码：" prop="title" class="is-required">
              <el-input v-model="addForm.password" clearable placeholder="请输入密码"/>
            </el-form-item>
            <el-form-item label="确认密码：" prop="title" class="is-required">
              <el-input v-model="addForm.repassword" clearable placeholder="请重新输入密码"/>
            </el-form-item>
            <el-form-item label="电子邮箱：" prop="title" class="is-required">
              <el-input v-model="addForm.email" clearable placeholder="请输入电子邮箱"/>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import {findUserList} from "@/api/user";
import {
  ENTITY_DELETE_STATE_DELETE,
  ENTITY_DELETE_STATE_NORMAL
} from "@/constant/commonConstant";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import {mapState} from "vuex";

export default {
  name: "UserManage",
  data() {
    return {
      ENTITY_DELETE_STATE_DELETE,
      ENTITY_DELETE_STATE_NORMAL,
      // 当前查询条件
      searchCondition: "",
      // 用户列表
      userList: [],
      // 当前页数
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 新增用户表单是否显示
      addFormVisible: false,
      // 表单中显示的用户具体信息
      addForm: {
        id: null,
        username: null,
        email: null,
        phone: null,
        avatarUrl: null,
        createTime: null,
        modifyTime: null,
        roleIdList: []
      }
    };
  },
  computed: {
    ...mapState({
      roleList: state => state.common.roleList
    })
  },
  methods: {
    // 打开新增用户弹窗
    addFormOpen() {
      let that = this;
    },
    // 提交新增用户表单
    commitAddForm(addForm) {

    },
    // 分页查询用户列表
    search() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition
      }
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      findUserList({...param}).then(res => {
        let data = res.data.data;
        this.userList = data.records;
        this.total = data.total;
        this.pageNum = data.current;
        this.pageSize = data.size;
        this.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
      }).catch(e => {
        this.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
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
