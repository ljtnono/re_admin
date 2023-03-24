<template>
  <div class="user-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入用户账号、手机号、邮箱"
          clearable @keyup.enter.native="search" />
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
        <!-- 更多操作下拉菜单-->
        <el-dropdown class="ml10" trigger="click" @command="handleSelectionOperation">
          <el-button type="info" :disabled="selectionButtonDisabled" icon="el-icon-arrow-down">
            更多操作
            <el-dropdown-menu>
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
                  @sort-change="handleSortChange"
                  @selection-change="handleSelectionChange"
                  max-height="650">
          <el-table-column type="selection" align="center" width="50"/>
          <el-table-column fixed="left" prop="username" label="用户名" width="160" >
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
          <el-table-column prop="phone" label="手机号码" width="140" />
          <el-table-column prop="email" label="电子邮箱" width="160"/>
          <el-table-column prop="role" label="角色" width="140" />
          <el-table-column prop="avatar" label="头像" width="140" align="center" >
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
          <el-table-column prop="lastLoginTime" label="最近登录" align="center" width="160">
            <template #default="{ row, column, $index }">
              <span class="cell-time">
                <i v-if="row.lastLoginTime !== null" class="el-icon-time"/>
                {{ row.lastLoginTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="ip" align="center" width="160" />
          <el-table-column prop="browserUA" label="浏览器标识" align="center"  >
            <template #default="{ row, column, $index }">
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
      <div class="add-form-container">
        <el-dialog title="新增用户"
                   top="4vh"
                   width="800px"
                   center
                   :visible.sync="addFormVisible">
          <template slot="default">
            <div style="padding: 10px 10px">
              <!-- 新增用户表单 -->
              <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="100px" inline>
                <el-form-item label="用户名：" prop="username" class="is-required" >
                  <el-input v-model="addForm.username" size="small" clearable placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="邮箱：" prop="email" class="is-required" >
                  <el-input v-model="addForm.email" size="small" clearable placeholder="请输入电子邮箱" />
                </el-form-item>
                <el-form-item label="密码：" prop="password" class="is-required" >
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
                      :value="role.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template slot="footer">
            <span class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitAddForm('addForm')">确 定</el-button>
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
                   :visible.sync="editFormVisible">
          <template slot="default">
            <div style="padding: 10px 10px">
              <!-- 编辑用户表单 -->
              <el-form ref="editForm" :model="editForm" :rules="editFormRule" label-width="100px" inline>
                <el-form-item label="邮箱：" prop="email" class="is-required" >
                  <el-input v-model="editForm.email" size="small" clearable placeholder="请输入电子邮箱" />
                </el-form-item>
                <el-form-item label="密码：" prop="password" >
                  <el-input v-model="editForm.password" type="password" size="small" clearable placeholder="请输入新密码" />
                </el-form-item>
                <!-- 选择角色列表 -->
                <el-form-item label="选择角色：" prop="roleId" class="is-required mt20">
                  <el-select style="width: 100%" v-model="editForm.roleId" clearable filterable placeholder="请选择角色">
                    <el-option
                      v-for="role in roleList"
                      :key="role.id"
                      :label="role.name"
                      :value="role.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template slot="footer">
            <span class="dialog-footer">
              <el-button @click="editFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitEditForm('editForm')">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
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
  HTTP_RESULT_SUCCESS_CODE,
  ORDER_BY_ASC,
  ORDER_BY_DESC
} from "@/constant/commonConstant";
import {ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG} from "@/config/commonConfig";
import {mapState} from "vuex";
import S from "string";
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

export default {
  name: "UserManage",
  data() {
    return {
      ENTITY_DELETE_STATE_DELETE,
      ENTITY_DELETE_STATE_NORMAL,
      // 多选操作按钮点击状态
      selectionButtonDisabled: true,
      // 被选中的行列表
      selection: [],
      selectedUserIdList: [],
      // 当前查询条件
      searchCondition: "",
      // 用户列表
      userList: [],
      // 排序字段条件
      orderFieldList: [],
      // 排序标记条件
      orderFlagList: [],
      // 当前页数
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 新增用户表单是否显示
      addFormVisible: false,
      // 编辑用户表单是否显示
      editFormVisible: false,
      // 表单中显示的用户具体信息
      addForm: {
        username: null,
        password: null,
        rePassword: null,
        email: null,
        roleId: null
      },
      addFormRule: {
        username: [
          {
            required: true,
            validator: this.usernameCheck,
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
          },
        ],
        rePassword: [
          {
            required: true,
            validator: this.rePasswordCheck,
            trigger: "blur"
          },
        ],
        email: [
          {
            required: true,
            validator: this.addFormEmailCheck,
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
      },
      editForm: {
        id: null,
        username: null,
        password: null,
        email: null,
        roleId: null
      },
      editFormRule: {
        password: [
          {
            pattern: LOGIN_PASSWORD_REGEX,
            message: ADMIN_USER_EDIT_PASSWORD_FORMAT_ERROR_MESSAGE,
            trigger: "blur"
          },
        ],
        email: [
          {
            required: true,
            validator: this.editFormEmailCheck,
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
      }
    };
  },
  computed: {
    ...mapState({
      roleList: state => state.common.roleList
    })
  },
  methods: {
    openEditForm(row) {
      this.editForm = {
        id: row.id,
        username: row.username,
        password: row.password,
        email: row.email,
        roleId: row.roleId
      };
      this.editFormVisible = true;
    },
    async handleSelectionOperation(command) {
      let userIdList = this.selectedUserIdList;
      if (command === "hidden") {
        await updateUserDeleteStatusBatch(userIdList, ENTITY_DELETE_STATE_DELETE).then(res => {
          this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        });
      } else if (command === "show") {
        await updateUserDeleteStatusBatch(userIdList, ENTITY_DELETE_STATE_NORMAL).then(res => {
          this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        });
      } else if (command === "delete") {
        await deleteUserBatch(userIdList).then(res => {
          this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        });
      }
      this.search();
    },
    // 当多选栏改变时
    handleSelectionChange(selection) {
      // 需要判断被选中的行是否大于0
      if (selection.length > 0) {
        this.selectionButtonDisabled = false;
      } else {
        this.selectionButtonDisabled = true;
      }
      this.selectedUserIdList = selection.map(s => s.id);
    },
    // 校验重复输入密码是否和密码一致
    rePasswordCheck(rule, value, callback) {
      let password = this.addForm.password;
      let rePassword = this.addForm.rePassword;
      if (rePassword === null || rePassword === "") {
        return callback(new Error(USER_ADD_RE_PASSWORD_EMPTY_ERROR_MESSAGE));
      }
      if (rePassword !== password) {
        return callback(new Error(USER_ADD_RE_PASSWORD_ERROR_MESSAGE));
      }
      return callback();
    },
    // 用户名校验
    async usernameCheck(rule, value, callback) {
      let username = this.addForm.username;
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
    },
    // 新增用户表单邮箱校验
    async addFormEmailCheck(rule, value, callback) {
      let email = this.addForm.email;
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
    },
    // 管理员编辑用户表单邮箱校验
    async editFormEmailCheck(rule, value, callback) {
      let email = this.editForm.email;
      let id = this.editForm.id;
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
    },
    // 提交新增用户表单
    commitAddForm(formName) {
      let that = this;
      this.$refs[formName].validate(async (valid, error) => {
        // 校验成功，请求保存用户接口
        let username = this.addForm.username;
        let password = this.addForm.password;
        let email = this.addForm.email;
        let roleId = this.addForm.roleId;
        if (valid) {
          this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
          await saveUser({username, password, email, roleId}).then(res => {
            this.$message({
              type: "success",
              message: "操作成功",
              duration: 2000
            });
            this.$loading().close();
            that.addFormVisible = false;
          }).catch(e => {
            this.$loading().close();
            that.addFormVisible = false;
          });
          await that.search();
        } else {
          // 校验失败
          this.$message({
            type: "error",
            message: Object.values(error)[0][0]["message"],
            duration: 2000
          });
        }
      });
    },
    // 提交管理员编辑用户表单
    commitEditForm(formName) {
      let that = this;
      this.$refs[formName].validate(async (valid, error) => {
        // 校验成功，请求编辑接口
        let userId = this.editForm.id;
        let password = this.editForm.password;
        let email = this.editForm.email;
        let roleId = this.editForm.roleId;
        if (valid) {
          this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
          await adminEditUser(userId, password, email, roleId).then(res => {
            this.$message({
              type: "success",
              message: "操作成功",
              duration: 2000
            });
            this.$loading().close();
            that.editFormVisible = false;
          }).catch(e => {
            this.$loading().close();
            that.editFormVisible = false;
          });
          await that.search();
        } else {
          // 校验失败
          this.$message({
            type: "error",
            message: Object.values(error)[0][0]["message"],
            duration: 2000
          });
        }
      });
    },
    // 处理排序变化
    handleSortChange(sortObj) {
      // 目前只支持单字段排序，这里由于逻辑是按照多字段排序写的，所以可能会有些迷
      let orderFieldList = [];
      let orderFlagList = [];
      // 转为下划线形式
      let prop = S(sortObj.prop).underscore().s;
      let order = sortObj.order;
      // 取消某个排序
      if (order === null) {
        let index = orderFieldList.indexOf(prop);
        // 已存在该排序字段则删除
        if (index !== -1) {
          orderFieldList.splice(index, 1);
          orderFlagList.splice(index, 1);
        }
      } else {
        order = order === "ascending" ? ORDER_BY_ASC : ORDER_BY_DESC;
        // 新增某个排序
        let index = orderFieldList.indexOf(prop);
        if (index !== -1) {
          // 已存在该排序字段则修改其排序flag
          orderFlagList[index] = order;
        } else {
          orderFieldList.push(prop);
          orderFlagList.push(order);
        }
      }
      this.orderFieldList = orderFieldList;
      this.orderFlagList = orderFlagList;
      this.search();
    },
    // 处理隐藏图标变化
    handleDeleteIconChange(row) {
      let deleteStatus = getEntityStateContrary(row.deleted);
      row.deleted = deleteStatus;
      updateUserDeleteStatusBatch([row.id], deleteStatus).then(res => {
        this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      }).catch(e => {
        row.deleted = getEntityStateContrary(deleteStatus);
      });
    },
    // 删除用户
    handleDeleteUser(userId) {
      deleteUserBatch([userId]).catch(res => {
        if (HTTP_RESULT_SUCCESS_CODE === res.data.code) {
          this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        }
        this.search();
      })
    },
    // 分页查询用户列表
    search() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition,
        orderFieldList: this.orderFieldList,
        orderFlagList: this.orderFlagList
      }
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      findUserList({...param}).then(res => {
        let data = res.data.data;
        this.userList = data.records;
        this.total = data.total;
        this.pageNum = data.current;
        this.pageSize = data.size;
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
