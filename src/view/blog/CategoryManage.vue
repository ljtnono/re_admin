<template>
  <div class="category-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter.native="search" />
        <el-button
          size="mini"
          type="primary"
          @click="search"
          icon="el-icon-search">
          搜索
        </el-button>
        <el-button
          size="mini"
          type="success"
          @click="openAddForm"
          icon="el-icon-plus">
          新增
        </el-button>
        <el-button
          size="mini"
          type="danger"
          :disabled="selectionButtonDisabled"
          @click="deleteBatch">
          删除
        </el-button>
      </div>
      <!-- 表格数据 -->
      <div class="category-table-container">
        <el-table :data="categoryList"
                  header-row-class-name="table-header"
                  @selection-change="handleSelectionChange"
                  max-height="650">
          <el-table-column type="selection" align="center" />
          <el-table-column fixed="left" prop="name" label="分类名称" />
          <el-table-column prop="articleCount" label="文章数量" align="center" />
          <el-table-column prop="view" label="浏览量" align="center" />
          <el-table-column prop="favorite" label="喜欢数" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template #default="{ row }">
              <span class="cell-time">
                <i class="el-icon-time" />
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="最后修改时间" align="center">
            <template #default="{ row }">
              <span class="cell-time">
                <i class="el-icon-time" />
                {{ row.modifyTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row }">
              <el-button type="text" size="mini" style="color: #909399" @click="openEditForm(row)">
                编辑
              </el-button>
              <el-button type="text" size="mini" style="color: #909399" @click="handleDeleteCategory(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增分类表单模态弹窗 -->
      <div class="add-form-container">
        <el-dialog title="新增分类"
                   top="20vh"
                   width="500px"
                   center
                   :visible.sync="addFormVisible">
          <el-form ref="addForm" :model="addForm" :rules="formRule" label-width="90px">
            <el-form-item label="分类名：" prop="name" class="is-required">
              <el-input v-model="addForm.name" size="small" clearable placeholder="请输入分类名" maxlength="50" show-word-limit />
            </el-form-item>
          </el-form>
          <template slot="footer">
            <span class="dialog-footer">
              <el-button type="primary" @click="commitAddForm('addForm')">提 交</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <!-- 编辑分类表单模态弹窗 -->
      <div class="edit-form-container">
        <el-dialog title="编辑分类"
                   top="20vh"
                   width="500px"
                   center
                   :visible.sync="editFormVisible">
          <el-form ref="editForm" :model="editForm" :rules="formRule" label-width="90px">
            <el-form-item label="分类名：" prop="name" class="is-required">
              <el-input v-model="editForm.name" size="small" clearable placeholder="请输入分类名" maxlength="50" show-word-limit />
            </el-form-item>
          </el-form>
          <template slot="footer">
            <span class="dialog-footer">
              <el-button type="primary" @click="commitEditForm('editForm')">提 交</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { findCategoryList, saveCategory, updateCategory, deleteCategoryBatch } from "@/api/category";
import { HTTP_RESULT_SUCCESS_CODE } from "@/constant/commonConstant";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";

export default {
  name: "CategoryManage",
  data() {
    return {
      // 多选操作按钮点击状态
      selectionButtonDisabled: true,
      // 被选中的分类id列表
      selectedCategoryIdList: [],
      // 分类完整列表
      allCategoryList: [],
      // 显示的分类列表
      categoryList: [],
      // 查询条件
      searchCondition: "",
      // 新增分类表单是否显示
      addFormVisible: false,
      // 编辑分类表单是否显示
      editFormVisible: false,
      // 新增分类表单
      addForm: {
        name: null
      },
      // 编辑分类表单
      editForm: {
        id: null,
        name: null
      },
      formRule: {
        name: [
          { required: true, message: "分类名不能为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    // 打开新增分类弹窗
    openAddForm() {
      this.addForm.name = null;
      this.addFormVisible = true;
    },
    // 打开编辑分类弹窗
    openEditForm(row) {
      this.editForm.id = row.id;
      this.editForm.name = row.name;
      this.editFormVisible = true;
    },
    // 提交新增分类表单
    commitAddForm(formName) {
      this.$refs[formName].validate(async (valid, error) => {
        if (valid) {
          this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
          await saveCategory({name: this.addForm.name}).then(() => {
            this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
            this.$loading().close();
            this.addFormVisible = false;
          }).catch(() => {
            this.$loading().close();
          });
          await this.search();
        } else {
          this.$message({
            type: "error",
            message: Object.values(error)[0][0]["message"],
            duration: 2000
          });
        }
      });
    },
    // 提交编辑分类表单
    commitEditForm(formName) {
      this.$refs[formName].validate(async (valid, error) => {
        if (valid) {
          this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
          await updateCategory({id: this.editForm.id, name: this.editForm.name}).then(() => {
            this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
            this.$loading().close();
            this.editFormVisible = false;
          }).catch(() => {
            this.$loading().close();
          });
          await this.search();
        } else {
          this.$message({
            type: "error",
            message: Object.values(error)[0][0]["message"],
            duration: 2000
          });
        }
      });
    },
    // 删除单个分类
    handleDeleteCategory(categoryId) {
      this.$confirm("是否删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCategoryBatch([categoryId]).then(res => {
          if (HTTP_RESULT_SUCCESS_CODE === res.data.code) {
            this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
          }
          this.search();
        }).catch(() => {});
      });
    },
    // 批量删除分类
    deleteBatch() {
      this.$confirm("是否删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCategoryBatch(this.selectedCategoryIdList).then(() => {
          this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
          this.search();
        }).catch(() => {});
      });
    },
    // 当多选栏改变时
    handleSelectionChange(selection) {
      this.selectionButtonDisabled = selection.length === 0;
      this.selectedCategoryIdList = selection.map(s => s.id);
    },
    // 搜索分类列表
    search() {
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      findCategoryList().then(res => {
        this.allCategoryList = res.data.data;
        let searchCondition = this.searchCondition;
        if (searchCondition) {
          this.categoryList = this.allCategoryList.filter(category => category.name.indexOf(searchCondition) !== -1);
        } else {
          this.categoryList = this.allCategoryList;
        }
        this.$loading().close();
      }).catch(() => {
        this.$loading().close();
      });
    }
  },
  mounted() {
    this.search();
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

.category-manage-container {
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
