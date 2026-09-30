<template>
  <div class="role-manage-container p20 flex flex1 flex-direction-row">
    <!-- 角色表格卡片 -->
    <el-card class="role-table-container" style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入角色名称或描述"
          clearable @keyup.enter="search" />
        <el-button
          type="primary"
          :icon="Search"
          @click="search">
          搜索
        </el-button>
        <!-- 新增角色接口 -->
        <el-button
          type="success"
          :icon="Plus"
          @click="addFormVisible = true">
          新增
        </el-button>
        <!-- 更多操作下拉菜单-->
        <el-button
          type="danger"
          :disabled="selectionButtonDisabled"
          @click="deleteBatch">
          删除
        </el-button>
      </div>
      <!-- 表格数据 -->
      <div class="role-table-container">
        <el-table :data="roleList"
                  header-row-class-name="table-header"
                  @sort-change="handleSortChange"
                  @selection-change="handleSelectionChange"
                  height="700">
          <el-table-column type="selection" align="center" />
          <el-table-column fixed="left" prop="name" label="名称" />
          <el-table-column prop="description" label="角色描述" />
          <el-table-column prop="remark" label="备注" show-overflow-tooltip />
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom">
            <template #default="{ row }">
              <span class="cell-time">
                <el-icon><Clock /></el-icon>
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="最后修改时间" align="center" sortable="custom">
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

                <el-button link type="danger" :icon="Delete" @click="handleDeleteRole(row.id)">删除</el-button>

              </div>
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
          v-model:current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          v-model:page-size="pageSize" />
      </div>
      <!-- 新增角色表单模态弹窗 -->
      <div class="add-form-container">
        <el-dialog title="新增角色"
                   top="4vh"
                   width="800px"
                   center
                   v-model="addFormVisible">
          <div style="padding: 10px 10px;">
            <!-- 新增角色表单 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRule" label-width="100px">
              <el-form-item label="角色名：" prop="name" class="is-required">
                <el-input v-model="addForm.name" size="small" clearable placeholder="请输入角色名" />
              </el-form-item>
              <el-form-item label="角色描述：" prop="description">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" maxlength="200" show-word-limit v-model="addForm.description" size="small" clearable placeholder="请输入角色描述" />
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="addForm.remark" size="small" clearable placeholder="请输入备注" />
              </el-form-item>
            </el-form>
          </div>
          <div style="padding: 10px 10px; height: 300px; overflow-y: auto; ">
            <el-tree
              ref="addRoleMenuTreeRef"
              :data="allRoleMenuTreeData"
              show-checkbox
              node-key="id"
              @check="handleAddFormMenuTreeCheck"
              highlight-current />
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button type="primary" @click="commitAddForm">提 交</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <!-- 编辑角色表单模态弹窗 -->
      <div class="edit-form-container">
        <el-dialog title="编辑角色"
                   top="4vh"
                   width="800px"
                   center
                   v-model="editFormVisible">
          <div style="padding: 10px 10px;">
            <!-- 编辑角色表单 -->
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRule" label-width="100px">
              <el-form-item label="角色名：" prop="name" class="is-required">
                <el-input v-model="editForm.name" size="small" clearable placeholder="请输入角色名" />
              </el-form-item>
              <el-form-item label="角色描述：" prop="description">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" maxlength="200" show-word-limit v-model="editForm.description" size="small" clearable placeholder="请输入角色描述" />
              </el-form-item>
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4 }" v-model="editForm.remark" size="small" clearable placeholder="请输入备注" />
              </el-form-item>
            </el-form>
          </div>
          <div style="padding: 10px 10px; height: 300px; overflow-y: auto; ">
            <el-tree
              :data="allRoleMenuTreeData"
              show-checkbox
              node-key="id"
              ref="editRoleMenuTreeRef"
              @check="handleEditFormMenuTreeCheck"
              highlight-current />
          </div>
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
import { ref, onMounted, nextTick } from "vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus, Clock, Edit, Delete } from "@element-plus/icons-vue";
import { findRolePageList } from "@/api/role";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";
import { findMenuTree } from "@/api/menu";
import { addFormRoleNameCheck, deleteRoleBatch, editFormRoleNameCheck, saveRole, updateRole } from "@/api/role";
import { ROLE_ADD_NAME_DUPLICATE_ERROR_MESSAGE, ROLE_ADD_NAME_EMPTY_ERROR_MESSAGE, ROLE_ADD_NAME_FORMAT_ERROR_MESSAGE } from "@/constant/errorMessageConstant";
import { ROLE_ADD_NAME_REGEX } from "@/constant/regexConstant";
import { ORDER_BY_ASC, ORDER_BY_DESC } from "@/constant/commonConstant";

defineOptions({ name: "RoleManage" });

// 多选操作按钮点击状态
const selectionButtonDisabled = ref(true);
// 被选中的角色id列表
const selectedRoleIdList = ref([]);
// 当前页数
const pageNum = ref(1);
// 每页条数
const pageSize = ref(20);
// 总条数
const total = ref(0);
// 当前查询条件
const searchCondition = ref("");
// 排序字段条件
const orderFieldList = ref([]);
// 排序标记条件
const orderFlagList = ref([]);
// 角色列表
const roleList = ref([]);
// 全部菜单树
const allRoleMenuTreeData = ref([]);
// 新增角色表单是否显示
const addFormVisible = ref(false);
// 编辑角色表单是否显示
const editFormVisible = ref(false);
// 表单引用
const addFormRef = ref(null);
const editFormRef = ref(null);
const addRoleMenuTreeRef = ref(null);
const editRoleMenuTreeRef = ref(null);
// 新增角色表单
const addForm = ref({
  name: null,
  description: null,
  remark: null,
  menuIdSet: []
});
// 编辑角色表单
const editForm = ref({
  id: null,
  name: null,
  description: null,
  remark: null,
  menuIdSet: []
});

// 深度优先遍历角色菜单树
const dfsRoleMenuTree = (menuTree, cb) => {
  for (const menu of menuTree) {
    cb(menu);
    if (menu.children != null && menu.children.length !== 0) {
      dfsRoleMenuTree(menu.children, cb);
    }
  }
};

// 编辑角色表单校验角色名称
const editRoleNameCheck = async (rule, value, callback) => {
  const roleName = editForm.value.name;
  const roleId = editForm.value.id;
  // 角色名判空校验
  if (roleName === null || roleName === "") {
    return callback(new Error(ROLE_ADD_NAME_EMPTY_ERROR_MESSAGE));
  }
  // 角色名称正则校验
  if (!ROLE_ADD_NAME_REGEX.test(roleName)) {
    return callback(new Error(ROLE_ADD_NAME_FORMAT_ERROR_MESSAGE));
  }
  // 可用性校验
  let availability = false;
  await editFormRoleNameCheck(roleId, roleName).then(res => {
    availability = res.data.data;
  });
  if (!availability) {
    return callback(new Error(ROLE_ADD_NAME_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

// 新增角色表单校验角色名称
const addRoleNameCheck = async (rule, value, callback) => {
  const name = addForm.value.name;
  // 角色名判空校验
  if (name === null || name === "") {
    return callback(new Error(ROLE_ADD_NAME_EMPTY_ERROR_MESSAGE));
  }
  // 角色名称正则校验
  if (!ROLE_ADD_NAME_REGEX.test(name)) {
    return callback(new Error(ROLE_ADD_NAME_FORMAT_ERROR_MESSAGE));
  }
  // 可用性校验
  let availability = false;
  await addFormRoleNameCheck(name).then(res => {
    availability = res.data.data;
  });
  if (!availability) {
    return callback(new Error(ROLE_ADD_NAME_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

const addFormRule = {
  name: [
    {
      required: true,
      validator: addRoleNameCheck,
      trigger: "blur"
    }
  ]
};

const editFormRule = {
  name: [
    {
      required: true,
      validator: editRoleNameCheck,
      trigger: "blur"
    }
  ]
};

// 表单校验失败时弹出第一条错误信息
const showValidateError = (error) => {
  ElMessage({
    type: "error",
    message: Object.values(error)[0][0]["message"],
    duration: 2000
  });
};

// 打开编辑角色弹窗
const openEditForm = (row) => {
  const name = row.name;
  const description = row.description;
  const remark = row.remark;
  const id = row.id;
  const checkedKeys = [];
  dfsRoleMenuTree(row.roleMenuTree.menuTree, menu => {
    if (menu.children === null || menu.children.length === 0) {
      // 这里只加入子节点的id,加入父节点id会导致全勾选
      checkedKeys.push(menu.menuId);
    }
  });
  editFormVisible.value = true;
  editForm.value.name = name;
  editForm.value.description = description;
  editForm.value.remark = remark;
  editForm.value.menuIdSet = [];
  editForm.value.id = id;
  // 将编辑角色表单中的菜单树进行打勾操作
  nextTick(() => {
    editRoleMenuTreeRef.value.setCheckedKeys(checkedKeys);
  });
};

// 批量删除角色
const deleteBatch = () => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRoleBatch(selectedRoleIdList.value).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {});
  }).catch(() => {});
};

// 处理角色菜单树选中状态改变事件
const handleAddFormMenuTreeCheck = (checkedNode, checkedData) => {
  addForm.value.menuIdSet = checkedData.checkedKeys;
};

const handleEditFormMenuTreeCheck = (checkedNode, checkedData) => {
  editForm.value.menuIdSet = checkedData.checkedKeys;
};

// 提交新增角色表单
const commitAddForm = () => {
  // 先校验表单数据
  addFormRef.value.validate(async (valid, error) => {
    // 校验成功，请求保存角色接口
    const name = addForm.value.name;
    const description = addForm.value.description;
    const remark = addForm.value.remark;
    const menuIdSet = addForm.value.menuIdSet;
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await saveRole({ name, description, remark, menuIdSet }).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        addFormVisible.value = false;
      }).catch(() => {
        // 错误消息已由axios响应拦截器统一弹出
        addFormVisible.value = false;
      }).finally(() => {
        loading.close();
      });
      await search();
    } else {
      // 校验失败
      showValidateError(error);
    }
  });
};

// 提交编辑角色表单
const commitEditForm = () => {
  editFormRef.value.validate(async (valid, error) => {
    const id = editForm.value.id;
    const name = editForm.value.name;
    const description = editForm.value.description;
    const remark = editForm.value.remark;
    const menuIdSet = editForm.value.menuIdSet;
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await updateRole({ id, name, description, remark, menuIdSet }).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        editFormVisible.value = false;
      }).catch(() => {
        // 错误消息已由axios响应拦截器统一弹出
        editFormVisible.value = false;
      }).finally(() => {
        loading.close();
      });
      await search();
    } else {
      // 校验失败
      showValidateError(error);
    }
  });
};

// 删除角色
const handleDeleteRole = (roleId) => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRoleBatch([roleId]).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {});
  }).catch(() => {});
};

// 搜索角色列表
const search = () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    searchCondition: searchCondition.value,
    orderFieldList: orderFieldList.value,
    orderFlagList: orderFlagList.value
  };
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  findRolePageList({ ...param }).then(res => {
    const data = res.data.data;
    roleList.value = data.records;
    total.value = data.total;
    pageNum.value = data.current;
    pageSize.value = data.size;
  }).catch(() => {
    // 错误消息已由axios响应拦截器统一弹出
  }).finally(() => {
    loading.close();
  });
};

// 当多选栏改变时
const handleSelectionChange = (selection) => {
  selectionButtonDisabled.value = selection.length === 0;
  selectedRoleIdList.value = selection.map(s => s.id);
};

// 驼峰转下划线
const underscore = (str) => str.replace(/([A-Z])/g, (m) => "_" + m.toLowerCase());

// 处理排序变化
const handleSortChange = (sortObj) => {
  // 目前只支持单字段排序，这里由于逻辑是按照多字段排序写的，所以可能会有些迷
  const fieldList = [];
  const flagList = [];
  // 转为下划线形式
  const prop = underscore(sortObj.prop);
  let order = sortObj.order;
  // 取消某个排序
  if (order === null) {
    const index = fieldList.indexOf(prop);
    // 已存在该排序字段则删除
    if (index !== -1) {
      fieldList.splice(index, 1);
      flagList.splice(index, 1);
    }
  } else {
    order = order === "ascending" ? ORDER_BY_ASC : ORDER_BY_DESC;
    // 新增某个排序
    const index = fieldList.indexOf(prop);
    if (index !== -1) {
      // 已存在该排序字段则修改其排序flag
      flagList[index] = order;
    } else {
      fieldList.push(prop);
      flagList.push(order);
    }
  }
  orderFieldList.value = fieldList;
  orderFlagList.value = flagList;
  search();
};

// 处理每页条数变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  search();
};

// 处理当前页数变化
const handleCurrentChange = (val) => {
  pageNum.value = val;
  search();
};

// 处理角色菜单树
const parseMenuData = (menuData) => {
  menuData = menuData || [];
  const treeData = [];
  for (let i = 0; i < menuData.length; i++) {
    const node = {
      id: menuData[i].menuId,
      label: menuData[i].menuTitle
    };
    if (menuData[i].children && menuData[i].children.length > 0) {
      node.children = parseMenuData(menuData[i].children);
    }
    treeData.push(node);
  }
  return treeData;
};

onMounted(() => {
  search();
  // 获取所有可配置的角色菜单树
  findMenuTree().then(res => {
    const data = res.data.data;
    allRoleMenuTreeData.value = parseMenuData(data);
  });
});
</script>

<style lang="scss" scoped>
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
