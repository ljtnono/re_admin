<template>
  <div class="menu-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input class="mr20" v-model="searchCondition" placeholder="请输入菜单名称、标题" clearable
          @keyup.enter="search" />
        <el-button type="primary" :icon="Search" @click="search">
          搜索
        </el-button>
        <!-- 新增用户接口 -->
        <el-button type="success" :icon="Plus" @click="addFormVisible = true">
          新增
        </el-button>
      </div>
      <!-- 表格数据 -->
      <div class="menu-table-container">
        <el-table :data="menuList" header-row-class-name="table-header" row-key="hash" height="700">
          <el-table-column fixed="left" prop="title" label="菜单标题" />
          <el-table-column prop="icon" label="图标">
            <template #default="{ row }">
              <i :class="'iconfont ' + row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="routePath" label="路由路径" />
          <el-table-column prop="routeName" label="路由名称" />
          <el-table-column prop="componentPath" label="菜单组件路径" />
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row }">
              <div class="table-actions">

                <el-button link type="primary" :icon="Edit" @click="openEditForm(row)">编辑</el-button>

                <el-button link type="danger" :icon="Delete" @click="handleDeleteMenu(row.id)">删除</el-button>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增菜单模态弹窗 -->
      <div class="add-form-container">
        <el-dialog title="新增菜单" top="4vh" width="800px" center v-model="addFormVisible">
          <!-- 新增菜单表单 -->
          <el-form ref="addFormRef" :model="addForm" :rules="addFormRule" label-width="100px" inline>
            <el-tabs v-model="addActiveTab">
              <!-- 菜单配置 -->
              <el-tab-pane label="菜单配置" name="menuConfig">
                <el-form-item label="菜单标题：" prop="title" class="is-required">
                  <el-input v-model="addForm.title" size="small" clearable placeholder="请输入菜单标题" />
                </el-form-item>
                <el-form-item label="路由路径：" prop="routePath" class="is-required">
                  <el-input v-model="addForm.routePath" size="small" clearable placeholder="请输入路由路径" />
                </el-form-item>
                <el-form-item label="父级菜单：" prop="parentId" class="is-required">
                  <el-tree-select
                    v-model="addForm.parentId"
                    :data="menuTreeData"
                    check-strictly
                    :render-after-expand="false"
                    style="width: 182px" />
                </el-form-item>
                <el-form-item label="路由名称：" prop="routeName" class="is-required">
                  <el-input v-model="addForm.routeName" size="small" clearable placeholder="请输入路由名称" />
                </el-form-item>
                <el-form-item label="组件路径：" prop="componentPath" class="is-required">
                  <el-input v-model="addForm.componentPath" size="small" clearable placeholder="请输入组件路径" />
                </el-form-item>
                <el-form-item label="菜单图标：" prop="icon">
                  <el-input v-model="addForm.icon" size="small" clearable placeholder="请输入菜单图标" />
                </el-form-item>
              </el-tab-pane>
              <!-- 菜单权限配置 -->
              <el-tab-pane label="权限配置" name="permissionConfig">
                <el-button :icon="Plus" @click="addMenuPermission('addForm')" class="mb20" size="small"
                  type="success">新增菜单权限</el-button>
                <ul class="menu-permission-list-container">
                  <li v-for="(item, index) in addForm.permissionList" :key="index">
                    <el-form-item label="权限名称" class="is-required">
                      <el-input size="small" v-model="item.name" clearable placeholder="请输入权限名称" />
                    </el-form-item>
                    <el-form-item label="权限表达式" class="is-required">
                      <el-input size="small" v-model="item.expression" clearable placeholder="请输入权限表达式" />
                    </el-form-item>
                    <el-button :icon="Minus" @click="removeMenuPermission('addForm', index)" class="mb20"
                      size="small" type="danger">删除</el-button>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitAddForm">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <!-- 编辑菜单模态弹窗 -->
      <div class="edit-form-container">
        <el-dialog title="编辑菜单" top="4vh" width="800px" center v-model="editFormVisible">
          <!-- 编辑菜单表单 -->
          <el-form ref="editFormRef" :model="editForm" :rules="editFormRule" label-width="100px" inline>
            <el-tabs v-model="editActiveTab">
              <!-- 菜单配置 -->
              <el-tab-pane label="菜单配置" name="menuConfig">
                <el-form-item label="菜单标题：" prop="title" class="is-required">
                  <el-input v-model="editForm.title" size="small" clearable placeholder="请输入菜单标题" />
                </el-form-item>
                <el-form-item label="路由路径：" prop="routePath" class="is-required">
                  <el-input v-model="editForm.routePath" size="small" clearable placeholder="请输入路由路径" />
                </el-form-item>
                <el-form-item label="父级菜单：" prop="parentId" class="is-required">
                  <el-tree-select
                    v-model="editForm.parentId"
                    :data="menuTreeData"
                    check-strictly
                    :render-after-expand="false"
                    style="width: 182px" />
                </el-form-item>
                <el-form-item label="路由名称：" prop="routeName" class="is-required">
                  <el-input v-model="editForm.routeName" size="small" clearable placeholder="请输入路由名称" />
                </el-form-item>
                <el-form-item label="组件路径：" prop="componentPath" class="is-required">
                  <el-input v-model="editForm.componentPath" size="small" clearable placeholder="请输入组件路径" />
                </el-form-item>
                <el-form-item label="菜单图标：" prop="icon">
                  <el-input v-model="editForm.icon" size="small" clearable placeholder="请输入菜单图标" />
                </el-form-item>
              </el-tab-pane>
              <!-- 菜单权限配置 -->
              <el-tab-pane label="权限配置" name="permissionConfig">
                <el-button :icon="Plus" @click="addMenuPermission('editForm')" class="mb20" size="small"
                  type="success">新增菜单权限</el-button>
                <ul class="menu-permission-list-container">
                  <li v-for="(item, index) in editForm.permissionList" :key="index">
                    <el-form-item label="权限名称" class="is-required">
                      <el-input size="small" v-model="item.name" clearable placeholder="请输入权限名称" />
                    </el-form-item>
                    <el-form-item label="权限表达式" class="is-required">
                      <el-input size="small" v-model="item.expression" clearable placeholder="请输入权限表达式" />
                    </el-form-item>
                    <el-button :icon="Minus" @click="removeMenuPermission('editForm', index)" class="mb20"
                      size="small" type="danger">删除</el-button>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitEditForm">确 定</el-button>
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
import { Search, Plus, Minus, Edit, Delete } from "@element-plus/icons-vue";
import { ENTITY_DELETE_STATE_DELETE, ENTITY_DELETE_STATE_NORMAL } from "@/constant/commonConstant";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";
import { findMenuList, findMenuTree } from "@/api/menu";
import { deleteMenu } from "@/api/menu";
import {
  MENU_ADD_TITLE_EMPTY_ERROR_MESSAGE,
  MENU_ADD_TITLE_FORMAT_ERROR_MESSAGE,
  MENU_EDIT_TITLE_EMPTY_ERROR_MESSAGE,
  MENU_EDIT_TITLE_FORMAT_ERROR_MESSAGE,
  MENU_ADD_ROUTE_NAME_EMPTY_ERROR_MESSAGE,
  MENU_ADD_ROUTE_NAME_FORMAT_ERROR_MESSAGE,
  MENU_ADD_ROUTE_NAME_DUPLICATE_ERROR_MESSAGE,
  MENU_EDIT_ROUTE_NAME_EMPTY_ERROR_MESSAGE,
  MENU_EDIT_ROUTE_NAME_FORMAT_ERROR_MESSAGE,
  MENU_EDIT_ROUTE_NAME_DUPLICATE_ERROR_MESSAGE,
  MENU_ADD_ROUTE_PATH_EMPTY_ERROR_MESSAGE,
  MENU_ADD_ROUTE_PATH_FORMAT_ERROR_MESSAGE,
  MENU_ADD_ROUTE_PATH_DUPLICATE_ERROR_MESSAGE,
  MENU_EDIT_ROUTE_PATH_EMPTY_ERROR_MESSAGE,
  MENU_EDIT_ROUTE_PATH_FORMAT_ERROR_MESSAGE,
  MENU_EDIT_ROUTE_PATH_DUPLICATE_ERROR_MESSAGE,
  MENU_ADD_COMPONENT_PATH_EMPTY_ERROR_MESSAGE,
  MENU_ADD_COMPONENT_PATH_FORMAT_ERROR_MESSAGE,
  MENU_ADD_PARENT_ID_EMPTY_ERROR_MESSAGE,
  MENU_EDIT_COMPONENT_PATH_EMPTY_ERROR_MESSAGE,
  MENU_EDIT_COMPONENT_PATH_FORMAT_ERROR_MESSAGE,
  MENU_EDIT_PARENT_ID_EMPTY_ERROR_MESSAGE
} from "@/constant/errorMessageConstant";
import {
  MENU_ADD_TITLE_REGEX,
  MENU_EDIT_TITLE_REGEX,
  MENU_ADD_ROUTE_NAME_REGEX,
  MENU_EDIT_ROUTE_NAME_REGEX,
  MENU_ADD_ROUTE_PATH_REGEX,
  MENU_EDIT_ROUTE_PATH_REGEX,
  MENU_ADD_COMPONENT_PATH_REGEX,
  MENU_EDIT_COMPONENT_PATH_REGEX
} from "@/constant/regexConstant";
import {
  checkMenuRouteNameDuplicate,
  checkMenuRoutePathDuplicate,
  checkMenuRouteNameAvailableEdit,
  checkMenuRoutePathAvailableEdit,
  saveMenu,
  editMenu
} from "@/api/menu";

defineOptions({ name: "MenuManage" });

// 当前查询条件
const searchCondition = ref("");
// 菜单列表
const menuList = ref([]);
// 新增表单框是否显示
const addFormVisible = ref(false);
// 编辑表单框是否显示
const editFormVisible = ref(false);
// 菜单树数据
const menuTreeData = ref([]);
// 表单引用
const addFormRef = ref(null);
const editFormRef = ref(null);
// 当前激活的tab
const addActiveTab = ref("menuConfig");
const editActiveTab = ref("menuConfig");
// 新增菜单表单数据
const addForm = ref({
  title: null,
  icon: null,
  parentId: null,
  routePath: null,
  routeName: null,
  componentPath: null,
  permissionList: []
});
// 编辑菜单表单
const editForm = ref({
  id: null,
  title: null,
  icon: null,
  parentId: null,
  routePath: null,
  routeName: null,
  componentPath: null,
  permissionList: []
});

// 处理新增菜单路由名称校验
const addRouteNameCheck = async (rule, value, callback) => {
  const routeName = addForm.value.routeName;
  // 菜单路由名称判空校验
  if (routeName === null || routeName === "") {
    return callback(new Error(MENU_ADD_ROUTE_NAME_EMPTY_ERROR_MESSAGE));
  }
  // 菜单路由名称正则校验
  if (!MENU_ADD_ROUTE_NAME_REGEX.test(routeName)) {
    return callback(new Error(MENU_ADD_ROUTE_NAME_FORMAT_ERROR_MESSAGE));
  }
  // 校验菜单路由名称是否重复
  let duplicate = false;
  await checkMenuRouteNameDuplicate(routeName).then(res => {
    duplicate = res.data.data;
  });
  if (duplicate) {
    return callback(new Error(MENU_ADD_ROUTE_NAME_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

// 处理新增菜单路由路径校验
const addRoutePathCheck = async (rule, value, callback) => {
  const routePath = addForm.value.routePath;
  // 是否为空校验
  if (routePath === null || routePath === "") {
    return callback(new Error(MENU_ADD_ROUTE_PATH_EMPTY_ERROR_MESSAGE));
  }
  // 菜单路由路径正则校验
  if (!MENU_ADD_ROUTE_PATH_REGEX.test(routePath)) {
    return callback(new Error(MENU_ADD_ROUTE_PATH_FORMAT_ERROR_MESSAGE));
  }
  let duplicate = false;
  await checkMenuRoutePathDuplicate(routePath).then(res => {
    duplicate = res.data.data;
  });
  if (duplicate) {
    return callback(new Error(MENU_ADD_ROUTE_PATH_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

// 处理编辑菜单路由名称校验
const editRouteNameCheck = async (rule, value, callback) => {
  const routeName = editForm.value.routeName;
  const menuId = editForm.value.id;
  // 菜单路由名称判空校验
  if (routeName === null || routeName === "") {
    return callback(new Error(MENU_EDIT_ROUTE_NAME_EMPTY_ERROR_MESSAGE));
  }
  // 菜单路由名称正则校验
  if (!MENU_EDIT_ROUTE_NAME_REGEX.test(routeName)) {
    return callback(new Error(MENU_EDIT_ROUTE_NAME_FORMAT_ERROR_MESSAGE));
  }
  // 校验路由菜单名称是否在编辑时可用
  let available = false;
  await checkMenuRouteNameAvailableEdit(menuId, routeName).then(res => {
    available = res.data.data;
  });
  if (!available) {
    return callback(new Error(MENU_EDIT_ROUTE_NAME_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

// 处理编辑菜单路由路径校验
const editRoutePathCheck = async (rule, value, callback) => {
  const menuId = editForm.value.id;
  const routePath = editForm.value.routePath;
  // 是否为空校验
  if (routePath === null || routePath === "") {
    return callback(new Error(MENU_EDIT_ROUTE_PATH_EMPTY_ERROR_MESSAGE));
  }
  // 菜单路由路径正则校验
  if (!MENU_EDIT_ROUTE_PATH_REGEX.test(routePath)) {
    return callback(new Error(MENU_EDIT_ROUTE_PATH_FORMAT_ERROR_MESSAGE));
  }
  let available = false;
  await checkMenuRoutePathAvailableEdit(menuId, routePath).then(res => {
    available = res.data.data;
  });
  if (!available) {
    return callback(new Error(MENU_EDIT_ROUTE_PATH_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

const addFormRule = {
  title: [
    {
      required: true,
      message: MENU_ADD_TITLE_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    },
    {
      message: MENU_ADD_TITLE_FORMAT_ERROR_MESSAGE,
      pattern: MENU_ADD_TITLE_REGEX,
      trigger: "blur"
    }
  ],
  routeName: [
    {
      required: true,
      validator: addRouteNameCheck,
      trigger: "blur"
    }
  ],
  routePath: [
    {
      required: true,
      validator: addRoutePathCheck,
      trigger: "blur"
    }
  ],
  componentPath: [
    {
      required: true,
      message: MENU_ADD_COMPONENT_PATH_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    },
    {
      message: MENU_ADD_COMPONENT_PATH_FORMAT_ERROR_MESSAGE,
      pattern: MENU_ADD_COMPONENT_PATH_REGEX,
      trigger: "blur"
    }
  ],
  parentId: [
    {
      required: true,
      message: MENU_ADD_PARENT_ID_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    }
  ]
};

const editFormRule = {
  title: [
    {
      required: true,
      message: MENU_EDIT_TITLE_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    },
    {
      message: MENU_EDIT_TITLE_FORMAT_ERROR_MESSAGE,
      pattern: MENU_EDIT_TITLE_REGEX,
      trigger: "blur"
    }
  ],
  routeName: [
    {
      required: true,
      validator: editRouteNameCheck,
      trigger: "blur"
    }
  ],
  routePath: [
    {
      required: true,
      validator: editRoutePathCheck,
      trigger: "blur"
    }
  ],
  componentPath: [
    {
      required: true,
      message: MENU_EDIT_COMPONENT_PATH_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    },
    {
      message: MENU_EDIT_COMPONENT_PATH_FORMAT_ERROR_MESSAGE,
      pattern: MENU_EDIT_COMPONENT_PATH_REGEX,
      trigger: "blur"
    }
  ],
  parentId: [
    {
      required: true,
      message: MENU_EDIT_PARENT_ID_EMPTY_ERROR_MESSAGE,
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

const addMenuPermission = (formName) => {
  if (formName === "addForm") {
    addForm.value.permissionList.push({
      name: null,
      expression: null
    });
  } else {
    editForm.value.permissionList.push({
      name: null,
      expression: null
    });
  }
};

const removeMenuPermission = (formName, index) => {
  // 移除最后一个表单项
  if (formName === "addForm") {
    addForm.value.permissionList.splice(index, 1);
  } else {
    editForm.value.permissionList.splice(index, 1);
  }
};

// 搜索菜单列表
const search = () => {
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  findMenuList(searchCondition.value).then(res => {
    menuList.value = res.data.data;
  }).catch(() => {
    // 错误消息已由axios响应拦截器统一弹出
  }).finally(() => {
    loading.close();
  });
};

// 提交新增菜单表单
const commitAddForm = () => {
  // 先校验表单数据
  addFormRef.value.validate(async (valid, error) => {
    // 校验成功，请求保存菜单接口
    const data = {
      title: addForm.value.title,
      routeName: addForm.value.routeName,
      parentId: addForm.value.parentId,
      routePath: addForm.value.routePath,
      componentPath: addForm.value.componentPath,
      icon: addForm.value.icon,
      permissionList: addForm.value.permissionList
    };
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await saveMenu({ ...data }).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        addFormVisible.value = false;
      }).catch(() => {
        // 错误消息已由axios响应拦截器统一弹出
        addFormVisible.value = false;
      }).finally(() => {
        loading.close();
      });
      await search();
      await refreshMenuTree();
    } else {
      // 校验失败
      showValidateError(error);
    }
  });
};

const mapMenuData = (data) => {
  return data.map(item => ({
    value: item.menuId,
    label: item.menuTitle,
    children: item.children.length > 0 ? mapMenuData(item.children) : undefined
  }));
};

// 处理删除菜单
const handleDeleteMenu = (menuId) => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteMenu(menuId).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {});
  }).catch(() => {});
};

// 打开编辑菜单弹窗
const openEditForm = (row) => {
  const id = row.id;
  const title = row.title;
  const routeName = row.routeName;
  const routePath = row.routePath;
  const componentPath = row.componentPath;
  const parentId = row.parentId;
  const icon = row.icon;
  const permissionList = row.permissionList;
  editFormVisible.value = true;
  // 设置表单数据
  editForm.value.id = id;
  editForm.value.title = title;
  editForm.value.routeName = routeName;
  editForm.value.routePath = routePath;
  editForm.value.componentPath = componentPath;
  editForm.value.parentId = parentId;
  editForm.value.icon = icon;
  if (permissionList !== null && permissionList !== []) {
    editForm.value.permissionList = permissionList;
  }
};

// 提交编辑菜单表单
const commitEditForm = () => {
  // 先校验表单数据
  editFormRef.value.validate(async (valid, error) => {
    // 校验成功，请求保存菜单接口
    const data = {
      id: editForm.value.id,
      title: editForm.value.title,
      routeName: editForm.value.routeName,
      parentId: editForm.value.parentId,
      routePath: editForm.value.routePath,
      componentPath: editForm.value.componentPath,
      icon: editForm.value.icon,
      permissionList: editForm.value.permissionList
    };
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await editMenu({ ...data }).then(() => {
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

// 刷新新增和编辑表单中的选择父级菜单的数据
const refreshMenuTree = () => {
  findMenuTree().then(res => {
    const data = res.data.data;
    const treeData = [{
      value: -1,
      label: "顶层菜单"
    }];
    const mapData = mapMenuData(data);
    mapData.forEach(d => treeData.push(d));
    menuTreeData.value = treeData;
  });
};

onMounted(() => {
  search();
  refreshMenuTree();
});
</script>

<style scoped lang="scss">
:deep(.el-tabs__content) {
  overflow: visible;
}

:deep(.el-form-item__content) {
  line-height: normal;
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
