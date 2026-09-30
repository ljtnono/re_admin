<template>
  <div class="user-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入用户账号、手机号、邮箱"
          clearable @keyup.enter="search" />
        <el-button
          type="primary"
          :icon="Search"
          @click="search">
          搜索
        </el-button>
        <!-- 新增用户接口 -->
        <el-button
          type="success"
          :icon="Plus"
          @click="addFormVisible = true">
          新增
        </el-button>
        <!-- 更多操作下拉菜单-->
        <el-dropdown class="ml10" trigger="click" @command="handleSelectionOperation">
          <el-button type="info" :disabled="selectionButtonDisabled" :icon="ArrowDown">
            更多操作
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="hidden">隐藏</el-dropdown-item>
              <el-dropdown-item command="show">显示</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <!-- 表格数据 -->
      <div class="user-table-container">
        <el-table :data="userList"
                  header-row-class-name="table-header"
                  @sort-change="handleSortChange"
                  @selection-change="handleSelectionChange"
                  height="700">
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column fixed="left" prop="username" label="用户名" width="160">
            <template #default="{ row }">
              <el-tooltip
                effect="dark"
                :content="row.username"
                placement="top">
                <span class="ellipsis">
                  <i :class="'iconfont mr5 cursor-pointer ' + (row.deleted === ENTITY_DELETE_STATE_DELETE ? 'icon-hidden' : 'icon-show')" @click="handleDeleteIconChange(row)" />
                  {{ row.username }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" width="140" />
          <el-table-column prop="email" label="电子邮箱" width="160" />
          <el-table-column prop="role" label="角色" width="140" />
          <el-table-column prop="avatar" label="头像" width="140" align="center">
            <template #default="{ row }">
              <UserAvatar :src="row.avatarUrl" :name="row.username" :size="60" />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" sortable="custom" width="180">
            <template #default="{ row }">
              <span class="cell-time">
                <el-icon><Clock /></el-icon>
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="lastLoginTime" label="最近登录" align="center" width="160">
            <template #default="{ row }">
              <span class="cell-time">
                <el-icon v-if="row.lastLoginTime !== null"><Clock /></el-icon>
                {{ row.lastLoginTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="ip" align="center" width="160" />
          <el-table-column prop="browserUA" label="浏览器标识" align="center">
            <template #default="{ row }">
              <el-tooltip
                effect="dark"
                :content="row.browserUA"
                placement="top">
                <span class="ellipsis">
                  {{ row.browserUA }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row }">
              <div class="table-actions">

                <el-button link type="primary" :icon="Edit" @click="openEditForm(row)">编辑</el-button>

                <el-button link type="danger" :icon="Delete" @click="handleDeleteUser(row.id)">删除</el-button>

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
      <!-- 新增用户表单模态弹窗 -->
      <div class="add-form-container">
        <el-dialog title="新增用户"
                   top="4vh"
                   width="800px"
                   center
                   v-model="addFormVisible">
          <div style="padding: 10px 10px">
            <!-- 新增用户表单 -->
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRule" label-width="100px" inline>
              <el-form-item label="用户名：" prop="username" class="is-required">
                <el-input v-model="addForm.username" size="small" clearable placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item label="邮箱：" prop="email" class="is-required">
                <el-input v-model="addForm.email" size="small" clearable placeholder="请输入电子邮箱" />
              </el-form-item>
              <el-form-item label="密码：" prop="password" class="is-required">
                <el-input v-model="addForm.password" type="password" size="small" clearable placeholder="请输入密码" />
              </el-form-item>
              <el-form-item label="确认密码：" prop="rePassword" class="is-required">
                <el-input v-model="addForm.rePassword" size="small" type="password" clearable placeholder="请重新输入密码" />
              </el-form-item>
              <!-- 选择角色列表 -->
              <el-form-item label="选择角色：" prop="roleId" class="is-required mt20">
                <el-select style="width: 100%" v-model="addForm.roleId" clearable filterable placeholder="请选择角色">
                  <el-option
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.name"
                    :value="role.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitAddForm">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
      <!-- 管理员编辑用户信息模态弹窗 -->
      <div class="edit-form-container">
        <el-dialog title="编辑用户"
                   top="4vh"
                   width="800px"
                   center
                   v-model="editFormVisible">
          <div style="padding: 10px 10px">
            <!-- 编辑用户表单 -->
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRule" label-width="100px" inline>
              <el-form-item label="邮箱：" prop="email" class="is-required">
                <el-input v-model="editForm.email" size="small" clearable placeholder="请输入电子邮箱" />
              </el-form-item>
              <el-form-item label="密码：" prop="password">
                <el-input v-model="editForm.password" type="password" size="small" clearable placeholder="请输入新密码" />
              </el-form-item>
              <!-- 选择角色列表 -->
              <el-form-item label="选择角色：" prop="roleId" class="is-required mt20">
                <el-select style="width: 100%" v-model="editForm.roleId" clearable filterable placeholder="请选择角色">
                  <el-option
                    v-for="role in roleList"
                    :key="role.id"
                    :label="role.name"
                    :value="role.id" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
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
import UserAvatar from "@/components/UserAvatar.vue";
import { ref, computed, onMounted } from "vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { Search, Plus, ArrowDown, Clock, Edit, Delete } from "@element-plus/icons-vue";
import {
  adminEditUser,
  adminEditUserTestEmailAvailability,
  deleteUserBatch,
  findUserList,
  saveUser,
  testEmailDuplicate,
  testUsernameDuplicate,
  updateUserDeleteStatusBatch
} from "@/api/user";
import {
  ENTITY_DELETE_STATE_DELETE,
  ENTITY_DELETE_STATE_NORMAL,
  getEntityStateContrary,
  ORDER_BY_ASC,
  ORDER_BY_DESC
} from "@/constant/commonConstant";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";
import { useCommonStore } from "@/store/common";
import {
  ADMIN_USER_EDIT_EMAIL_AVAILABILITY_ERROR_MESSAGE,
  ADMIN_USER_EDIT_EMAIL_EMPTY_ERROR_MESSAGE,
  ADMIN_USER_EDIT_EMAIL_FORMAT_ERROR_MESSAGE,
  ADMIN_USER_EDIT_PASSWORD_FORMAT_ERROR_MESSAGE,
  ADMIN_USER_EDIT_ROLE_EMPTY_ERROR_MESSAGE,
  USER_ADD_EMAIL_DUPLICATE_ERROR_MESSAGE,
  USER_ADD_EMAIL_EMPTY_ERROR_MESSAGE,
  USER_ADD_EMAIL_FORMAT_ERROR_MESSAGE,
  USER_ADD_PASSWORD_EMPTY_ERROR_MESSAGE,
  USER_ADD_PASSWORD_FORMAT_ERROR_MESSAGE,
  USER_ADD_RE_PASSWORD_EMPTY_ERROR_MESSAGE,
  USER_ADD_RE_PASSWORD_ERROR_MESSAGE,
  USER_ADD_ROLE_EMPTY_ERROR_MESSAGE,
  USER_ADD_USERNAME_DUPLICATE_ERROR_MESSAGE,
  USER_ADD_USERNAME_EMPTY_ERROR_MESSAGE,
  USER_ADD_USERNAME_FORMAT_ERROR_MESSAGE
} from "@/constant/errorMessageConstant";
import {
  ADMIN_USER_EDIT_EMAIL_REGEX,
  LOGIN_PASSWORD_REGEX,
  USER_ADD_EMAIL_REGEX,
  USER_ADD_USERNAME_REGEX
} from "@/constant/regexConstant";

defineOptions({ name: "UserManage" });

const commonStore = useCommonStore();

// 多选操作按钮点击状态
const selectionButtonDisabled = ref(true);
// 被选中的用户id列表
const selectedUserIdList = ref([]);
// 当前查询条件
const searchCondition = ref("");
// 用户列表
const userList = ref([]);
// 排序字段条件
const orderFieldList = ref([]);
// 排序标记条件
const orderFlagList = ref([]);
// 当前页数
const pageNum = ref(1);
// 每页条数
const pageSize = ref(20);
// 总条数
const total = ref(0);
// 新增用户表单是否显示
const addFormVisible = ref(false);
// 编辑用户表单是否显示
const editFormVisible = ref(false);
// 表单引用
const addFormRef = ref(null);
const editFormRef = ref(null);
// 表单中显示的用户具体信息
const addForm = ref({
  username: null,
  password: null,
  rePassword: null,
  email: null,
  roleId: null
});
const editForm = ref({
  id: null,
  username: null,
  password: null,
  email: null,
  roleId: null
});

// 角色列表
const roleList = computed(() => commonStore.roleList);

// 校验重复输入密码是否和密码一致
const rePasswordCheck = (rule, value, callback) => {
  const password = addForm.value.password;
  const rePassword = addForm.value.rePassword;
  if (rePassword === null || rePassword === "") {
    return callback(new Error(USER_ADD_RE_PASSWORD_EMPTY_ERROR_MESSAGE));
  }
  if (rePassword !== password) {
    return callback(new Error(USER_ADD_RE_PASSWORD_ERROR_MESSAGE));
  }
  return callback();
};

// 用户名校验
const usernameCheck = async (rule, value, callback) => {
  const username = addForm.value.username;
  if (username === null || username === "") {
    return callback(new Error(USER_ADD_USERNAME_EMPTY_ERROR_MESSAGE));
  }
  if (!USER_ADD_USERNAME_REGEX.test(username)) {
    return callback(new Error(USER_ADD_USERNAME_FORMAT_ERROR_MESSAGE));
  }
  // 重复性校验
  let duplicate = false;
  await testUsernameDuplicate(username).then(res => {
    duplicate = res.data.data;
  });
  if (duplicate) {
    return callback(new Error(USER_ADD_USERNAME_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

// 新增用户表单邮箱校验
const addFormEmailCheck = async (rule, value, callback) => {
  const email = addForm.value.email;
  if (email === null || email === "") {
    return callback(new Error(USER_ADD_EMAIL_EMPTY_ERROR_MESSAGE));
  }
  if (!USER_ADD_EMAIL_REGEX.test(email)) {
    return callback(new Error(USER_ADD_EMAIL_FORMAT_ERROR_MESSAGE));
  }
  // 重复性校验
  let duplicate = false;
  await testEmailDuplicate(email).then(res => {
    duplicate = res.data.data;
  });
  if (duplicate) {
    return callback(new Error(USER_ADD_EMAIL_DUPLICATE_ERROR_MESSAGE));
  }
  return callback();
};

// 管理员编辑用户表单邮箱校验
const editFormEmailCheck = async (rule, value, callback) => {
  const email = editForm.value.email;
  const id = editForm.value.id;
  if (email === null || email === "") {
    return callback(new Error(ADMIN_USER_EDIT_EMAIL_EMPTY_ERROR_MESSAGE));
  }
  if (!ADMIN_USER_EDIT_EMAIL_REGEX.test(email)) {
    return callback(new Error(ADMIN_USER_EDIT_EMAIL_FORMAT_ERROR_MESSAGE));
  }
  // 可用性校验
  let availability = false;
  await adminEditUserTestEmailAvailability(email, id).then(res => {
    availability = res.data.data;
  });
  if (!availability) {
    return callback(new Error(ADMIN_USER_EDIT_EMAIL_AVAILABILITY_ERROR_MESSAGE));
  }
  return callback();
};

const addFormRule = {
  username: [
    {
      required: true,
      validator: usernameCheck,
      trigger: "blur"
    }
  ],
  password: [
    {
      required: true,
      message: USER_ADD_PASSWORD_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    },
    {
      pattern: LOGIN_PASSWORD_REGEX,
      message: USER_ADD_PASSWORD_FORMAT_ERROR_MESSAGE,
      trigger: "blur"
    }
  ],
  rePassword: [
    {
      required: true,
      validator: rePasswordCheck,
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      validator: addFormEmailCheck,
      trigger: "blur"
    }
  ],
  roleId: [
    {
      required: true,
      message: USER_ADD_ROLE_EMPTY_ERROR_MESSAGE,
      trigger: "blur"
    }
  ]
};

const editFormRule = {
  password: [
    {
      pattern: LOGIN_PASSWORD_REGEX,
      message: ADMIN_USER_EDIT_PASSWORD_FORMAT_ERROR_MESSAGE,
      trigger: "blur"
    }
  ],
  email: [
    {
      required: true,
      validator: editFormEmailCheck,
      trigger: "blur"
    }
  ],
  roleId: [
    {
      required: true,
      message: ADMIN_USER_EDIT_ROLE_EMPTY_ERROR_MESSAGE,
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

const openEditForm = (row) => {
  editForm.value = {
    id: row.id,
    username: row.username,
    password: row.password,
    email: row.email,
    roleId: row.roleId
  };
  editFormVisible.value = true;
};

const handleSelectionOperation = (command) => {
  const userIdList = selectedUserIdList.value;
  if (command === "hidden") {
    ElMessageBox.confirm("是否确认隐藏?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      updateUserDeleteStatusBatch(userIdList, ENTITY_DELETE_STATE_DELETE).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        search();
      }).catch(() => {});
    }).catch(() => {});
  } else if (command === "show") {
    ElMessageBox.confirm("是否确认显示?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      updateUserDeleteStatusBatch(userIdList, ENTITY_DELETE_STATE_NORMAL).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        search();
      }).catch(() => {});
    }).catch(() => {});
  } else if (command === "delete") {
    // 提示警告消息
    ElMessageBox.confirm("是否确认删除?", "警告", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      deleteUserBatch(userIdList).then(() => {
        ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        search();
      }).catch(() => {});
    }).catch(() => {});
  }
};

// 当多选栏改变时
const handleSelectionChange = (selection) => {
  selectionButtonDisabled.value = selection.length === 0;
  selectedUserIdList.value = selection.map(s => s.id);
};

// 提交新增用户表单
const commitAddForm = () => {
  addFormRef.value.validate(async (valid, error) => {
    // 校验成功，请求保存用户接口
    const username = addForm.value.username;
    const password = addForm.value.password;
    const email = addForm.value.email;
    const roleId = addForm.value.roleId;
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await saveUser({ username, password, email, roleId }).then(() => {
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

// 提交管理员编辑用户表单
const commitEditForm = () => {
  editFormRef.value.validate(async (valid, error) => {
    // 校验成功，请求编辑接口
    const userId = editForm.value.id;
    const password = editForm.value.password;
    const email = editForm.value.email;
    const roleId = editForm.value.roleId;
    if (valid) {
      const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
      await adminEditUser(userId, password, email, roleId).then(() => {
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

// 处理隐藏图标变化
const handleDeleteIconChange = (row) => {
  const deleteStatus = getEntityStateContrary(row.deleted);
  row.deleted = deleteStatus;
  ElMessageBox.confirm("是否更改对象显示状态?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    updateUserDeleteStatusBatch([row.id], deleteStatus).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {
      row.deleted = getEntityStateContrary(deleteStatus);
    });
  }).catch(() => {
    row.deleted = getEntityStateContrary(deleteStatus);
  });
};

// 删除用户
const handleDeleteUser = (userId) => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUserBatch([userId]).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {});
  }).catch(() => {});
};

// 分页查询用户列表
const search = () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    searchCondition: searchCondition.value,
    orderFieldList: orderFieldList.value,
    orderFlagList: orderFlagList.value
  };
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  findUserList({ ...param }).then(res => {
    const data = res.data.data;
    userList.value = data.records;
    total.value = data.total;
    pageNum.value = data.current;
    pageSize.value = data.size;
  }).catch(() => {
    // 错误消息已由axios响应拦截器统一弹出
  }).finally(() => {
    loading.close();
  });
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

onMounted(() => {
  search();
});
</script>

<style lang="scss" scoped>
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
