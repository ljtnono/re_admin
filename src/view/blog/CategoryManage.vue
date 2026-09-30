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
          @keyup.enter="search" />
        <el-button
          type="primary"
          :icon="Search"
          @click="search">
          搜索
        </el-button>
        <el-button
          type="success"
          :icon="Plus"
          @click="openAddForm">
          新增
        </el-button>
        <el-button
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
                  height="700">
          <el-table-column type="selection" align="center" />
          <el-table-column fixed="left" prop="name" label="分类名称" />
          <el-table-column prop="articleCount" label="文章数量" align="center" />
          <el-table-column prop="view" label="浏览量" align="center" />
          <el-table-column prop="favorite" label="喜欢数" align="center" />
          <el-table-column prop="createTime" label="创建时间" align="center">
            <template #default="{ row }">
              <span class="cell-time">
                <el-icon><Clock /></el-icon>
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="最后修改时间" align="center">
            <template #default="{ row }">
              <span class="cell-time">
                <el-icon><Clock /></el-icon>
                {{ row.modifyTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row }">
              <div class="table-actions">

                <el-button link type="primary" :icon="Edit" @click="openEditForm(row)">编辑</el-button>

                <el-button link type="danger" :icon="Delete" @click="handleDeleteCategory(row.id)">删除</el-button>

              </div>
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
                   v-model="addFormVisible">
          <el-form ref="addFormRef" :model="addForm" :rules="formRule" label-width="90px">
            <el-form-item label="分类名：" prop="name" class="is-required">
              <el-input v-model="addForm.name" size="small" clearable placeholder="请输入分类名" maxlength="50" show-word-limit />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="commitAddForm">提 交</el-button>
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
                   v-model="editFormVisible">
          <el-form ref="editFormRef" :model="editForm" :rules="formRule" label-width="90px">
            <el-form-item label="分类名：" prop="name" class="is-required">
              <el-input v-model="editForm.name" size="small" clearable placeholder="请输入分类名" maxlength="50" show-word-limit />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="commitEditForm">提 交</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus, Clock, Edit, Delete } from "@element-plus/icons-vue";
import { findCategoryList, saveCategory, updateCategory, deleteCategoryBatch } from "@/api/category";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";

defineOptions({ name: "CategoryManage" });

// 多选操作按钮点击状态
const selectionButtonDisabled = ref(true);
// 被选中的分类id列表
const selectedCategoryIdList = ref([]);
// 分类完整列表
const allCategoryList = ref([]);
// 显示的分类列表
const categoryList = ref([]);
// 查询条件
const searchCondition = ref("");
// 新增分类表单是否显示
const addFormVisible = ref(false);
// 编辑分类表单是否显示
const editFormVisible = ref(false);
// 表单引用
const addFormRef = ref(null);
const editFormRef = ref(null);
// 新增分类表单
const addForm = ref({
  name: null
});
// 编辑分类表单
const editForm = ref({
  id: null,
  name: null
});
const formRule = {
  name: [
    { required: true, message: "分类名不能为空", trigger: "blur" }
  ]
};

// 打开新增分类弹窗
const openAddForm = () => {
  addForm.value.name = null;
  addFormVisible.value = true;
};

// 打开编辑分类弹窗
const openEditForm = (row) => {
  editForm.value.id = row.id;
  editForm.value.name = row.name;
  editFormVisible.value = true;
};

// 表单校验失败时弹出第一条错误信息
const showValidateError = (error) => {
  ElMessage({
    type: "error",
    message: Object.values(error)[0][0]["message"],
    duration: 2000
  });
};

// 提交新增分类表单
const commitAddForm = () => {
  addFormRef.value.validate(async (valid, error) => {
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await saveCategory({ name: addForm.value.name }).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        addFormVisible.value = false;
      }).catch(() => {
        // 错误消息已由axios响应拦截器统一弹出
      }).finally(() => {
        loading.close();
      });
      await search();
    } else {
      showValidateError(error);
    }
  });
};

// 提交编辑分类表单
const commitEditForm = () => {
  editFormRef.value.validate(async (valid, error) => {
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await updateCategory({ id: editForm.value.id, name: editForm.value.name }).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        editFormVisible.value = false;
      }).catch(() => {
        // 错误消息已由axios响应拦截器统一弹出
      }).finally(() => {
        loading.close();
      });
      await search();
    } else {
      showValidateError(error);
    }
  });
};

// 删除单个分类
const handleDeleteCategory = (categoryId) => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCategoryBatch([categoryId]).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出
    });
  }).catch(() => {});
};

// 批量删除分类
const deleteBatch = () => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCategoryBatch(selectedCategoryIdList.value).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出
    });
  }).catch(() => {});
};

// 当多选栏改变时
const handleSelectionChange = (selection) => {
  selectionButtonDisabled.value = selection.length === 0;
  selectedCategoryIdList.value = selection.map(s => s.id);
};

// 搜索分类列表
const search = () => {
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  findCategoryList().then(res => {
    allCategoryList.value = res.data.data;
    if (searchCondition.value) {
      categoryList.value = allCategoryList.value.filter(category => category.name.indexOf(searchCondition.value) !== -1);
    } else {
      categoryList.value = allCategoryList.value;
    }
  }).catch(() => {
    // 错误消息已由axios响应拦截器统一弹出
  }).finally(() => {
    loading.close();
  });
};

onMounted(() => {
  search();
});
</script>

<style lang="scss" scoped>
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
