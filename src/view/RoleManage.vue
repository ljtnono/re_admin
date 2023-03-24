<template>
  <div class="role-manage-container p20 flex flex1 flex-direction-row">
    <!-- 角色菜单树卡片 -->
    <el-card class="menu-tree-container mr20" style="flex: 1 1">
      <template slot="header">
        菜单树
      </template>
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current>
      </el-tree>
      <!-- 操作按钮容器 -->
      <el-row class="mt50" style="text-align: center">
        <el-button type="primary" size="medium">保存配置</el-button>
      </el-row>
    </el-card>
    <!-- 角色表格卡片 -->
    <el-card class="role-table-container" style="flex: 4 4">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入角色名称或描述"
          clearable @keyup.enter.native="search" />
        <el-button
          size="mini"
          type="primary"
          @click="search"
          icon="el-icon-search">
          搜索
        </el-button>
      </div>
      <!-- 表格数据 -->
      <div class="role-table-container">
        <el-table :data="roleList"
                  header-row-class-name="table-header"
                  @sort-change="handleSortChange"
                  @selection-change="handleSelectionChange"
                  max-height="650">
          <el-table-column type="selection" align="center"/>
          <el-table-column fixed="left" prop="username" label="名称">
            <template #default="{ row, column, $index }">
              <el-tooltip
                effect="dark"
                :content="row.username"
                placement="top">
                <span class="ellipsis">
                  <i :class="'iconfont mr5 cursor-pointer ' + (row.deleted === ENTITY_DELETE_STATE_DELETE ? 'icon-hidden' : 'icon-show')"  @click="handleDeleteIconChange(row)"/>
                  {{ row.username }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="角色描述" />
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
            <template #default="{ row, column, $index }">
              <span class="cell-time">
                <i class="el-icon-time"/>
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="最后修改时间" align="center" sortable="custom">
            <template #default="{ row, column, $index }">
              <span class="cell-time">
                <i class="el-icon-time"/>
                {{ row.modifyTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row, column, $index }">
              <el-button type="text" size="mini" style="color: #909399" @click="openEditForm(row)">
                编辑
              </el-button>
              <el-button type="text" size="mini" style="color: #909399" @click="handleDeleteRole(row.id)">
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
    </el-card>
  </div>
</template>

<script>
import {ENTITY_DELETE_STATE_DELETE, ENTITY_DELETE_STATE_NORMAL} from "@/constant/commonConstant";

export default {
  name: "RoleManage",
  data() {
    return {
      ENTITY_DELETE_STATE_DELETE,
      ENTITY_DELETE_STATE_NORMAL,
      // 当前页数
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 当前查询条件
      searchCondition: "",
      data: [{
        id: 1,
        label: "一级 1",
        children: [{
          id: 4,
          label: "二级 1-1",
          children: [{
            id: 9,
            label: "三级 1-1-1"
          }, {
            id: 10,
            label: "三级 1-1-2"
          }]
        }]
      }, {
        id: 2,
        label: "一级 2",
        children: [{
          id: 5,
          label: "二级 2-1"
        }, {
          id: 6,
          label: "二级 2-2"
        }]
      }, {
        id: 3,
        label: "一级 3",
        children: [{
          id: 7,
          label: "二级 3-1"
        }, {
          id: 8,
          label: "二级 3-2"
        }]
      }],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  }
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
  border-spacing: 0;
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

.role-manage-container {

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
