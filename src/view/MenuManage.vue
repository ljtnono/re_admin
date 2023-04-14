<template>
  <div class="menu-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入菜单名称、标题"
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
      <div class="menu-table-container">
        <el-table :data="menuList"
                  header-row-class-name="table-header"
                  @sort-change="handleSortChange"
                  @selection-change="handleSelectionChange"
                  row-key="id"
                  max-height="650">
          <el-table-column fixed="left" prop="title" label="菜单标题"  />
          <el-table-column prop="projectName" label="所属项目" />
          <el-table-column prop="icon" label="icon" />
          <el-table-column prop="path" label="path" />
          <el-table-column prop="componentName" label="菜单组件名称" />
          <el-table-column prop="componentPath" label="菜单组件路径" />
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row, column, $index }">
              <el-button type="text" size="mini" style="color: #909399" @click="openEditForm(row)">
                编辑
              </el-button>
              <el-button type="text" size="mini" style="color: #909399" @click="handleDeleteUser(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import {ENTITY_DELETE_STATE_DELETE, ENTITY_DELETE_STATE_NORMAL} from "@/constant/commonConstant";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import {findMenuList} from "@/api/menu";

export default {
  name: "MenuManage",
  data() {
    return {
      ENTITY_DELETE_STATE_DELETE,
      ENTITY_DELETE_STATE_NORMAL,
      // 当前查询条件
      searchCondition: "",
      // 菜单列表
      menuList: []
    }
  },
  methods: {
    // 搜索菜单列表
    search() {
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      findMenuList(this.searchCondition).then(res => {
        let data = res.data.data;
        this.menuList = data;
        this.$loading().close();
      }).catch(e => {
        this.$loading().close();
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
  }
}
</script>

<style scoped lang="scss">

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

.menu-manage-container {
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
