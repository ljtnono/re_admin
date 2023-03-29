<template>
  <div class="role-manage-container p20 flex flex1 flex-direction-row">
    <!-- 角色菜单树卡片 -->
    <el-card class="menu-tree-container mr20" style="flex: 1 1">
      <template slot="header">
        菜单树
      </template>
      <el-tree
        :data="roleMenuTreeData"
        default-expand-all
        node-key="id"
        ref="tree"
        highlight-current>
      </el-tree>
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
        <!-- 新增角色接口 -->
        <el-button
          size="mini"
          type="success"
          @click="addFormVisible = true"
          icon="el-icon-plus">
          新增
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
          <el-table-column fixed="left" prop="name" label="名称" />
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
      <!-- 新增角色表单模态弹窗 -->
      <div class="add-form-container">
        <el-dialog title="新增角色"
                   top="4vh"
                   width="800px"
                   center
                   :visible.sync="addFormVisible">
          <template slot="default">
            <div style="padding: 10px 10px;">
              <!-- 新增角色表单 -->
              <el-form ref="addForm" :model="addForm" :rules="addFormRule"  label-width="100px">
                <el-form-item label="角色名：" prop="name" class="is-required" >
                  <el-input v-model="addForm.name" size="small" clearable placeholder="请输入角色名" />
                </el-form-item>
                <el-form-item label="角色描述：" prop="description">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" show-word-limit v-model="addForm.description" size="small" clearable placeholder="请输入角色描述" />
                </el-form-item>
              </el-form>
            </div>
            <div style="padding: 10px 10px; height: 300px; overflow-y: auto; ">
              <el-tree
                :data="menuTreeData"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                @check="handleMenuTreeCheck"
                highlight-current>
              </el-tree>
            </div>
          </template>
          <template slot="footer">
            <span class="dialog-footer">
              <el-button type="primary" @click="commitAddForm('addForm')">提 交</el-button>
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
                   :visible.sync="editFormVisible">
          <template slot="default">
            <div style="padding: 10px 10px;">
              <!-- 编辑角色表单 -->
              <el-form ref="editForm" :model="editForm" :rules="editFormRule"  label-width="100px">
                <el-form-item label="角色名：" prop="name" class="is-required" >
                  <el-input v-model="editForm.name" size="small" clearable placeholder="请输入角色名" />
                </el-form-item>
                <el-form-item label="角色描述：" prop="description">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" show-word-limit v-model="editForm.description" size="small" clearable placeholder="请输入角色描述" />
                </el-form-item>
              </el-form>
            </div>
            <div style="padding: 10px 10px; height: 300px; overflow-y: auto; ">
              <el-tree
                :data="menuTreeData"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current>
              </el-tree>
            </div>
          </template>
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
import {
  ENTITY_DELETE_STATE_DELETE,
  ENTITY_DELETE_STATE_NORMAL,
  ORDER_BY_ASC,
  ORDER_BY_DESC,
  HTTP_RESULT_SUCCESS_CODE
} from "@/constant/commonConstant";
import {findRoleMenuTree, findRolePageList} from "@/api/role";
import {ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG} from "@/config/commonConfig";
import S from "string";
import {findMenuTree} from "@/api/menu";
import { deleteRoleBatch, saveRole, testRoleNameAvailability } from "../api/role";
import { ROLE_ADD_NAME_DUPLICATE_ERROR_MESSAGE, ROLE_ADD_NAME_EMPTY_ERROR_MESSAGE, ROLE_ADD_NAME_FORMAT_ERROR_MESSAGE } from "../constant/errorMessageConstant";
import { ROLE_ADD_NAME_REGEX } from "../constant/regexConstant";

export default {
  name: "RoleManage",
  data() {
    return {
      ENTITY_DELETE_STATE_DELETE,
      ENTITY_DELETE_STATE_NORMAL,
      // 多选操作按钮点击状态
      selectionButtonDisabled: true,
      // 被选中的行列表
      selection: [],
      selectedRoleIdList: [],
      // 当前页数
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 当前查询条件
      searchCondition: "",
      // 排序字段条件
      orderFieldList: [],
      // 排序标记条件
      orderFlagList: [],
      // 角色列表
      roleList: [],
      // 角色的菜单树
      roleMenuTreeData: [],
      // 全部菜单树
      menuTreeData: [],
      // 显示的菜单树对应的角色id
      menuTreeRoleId: null,
      // 新增角色表单是否显示
      addFormVisible: false,
      // 编辑角色表单是否显示
      editFormVisible: false,
      // 新增角色表单
      addForm: {
        name: null,
        description: null,
        menuIdSet: []
      },
      addFormRule: {
        name: [
          {
            required: true,
            validator: this.addRoleNameCheck,
            trigger: "blur"
          }
        ],
      },
      // 编辑角色表单
      editForm: {
        name: null,
        description: null,
        menuIdSet: []
      },
      editFormRule: {
        name: [
          {
            required: true,
            validator: this.editRoleNameCheck,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    // 打开编辑角色弹窗
    openEditForm(row) {
      let name = row.name;
      let description = row.description;
      this.editFormVisible = true;
      this.editForm.name = name;
      this.editForm.description = description;
      this.editForm.menuIdSet = [];
    },
    // 处理角色菜单树选中状态改变事件
    handleMenuTreeCheck(checkedNode, checkedData) {
      this.addForm.menuIdSet = checkedData.checkedKeys;
    },
    // 编辑角色表单校验角色名称
    async editRoleNameCheck(rule, value, callback) {
      let name = this.editForm.name;
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
      await testRoleNameAvailability(name).then(res => {
        availability = res.data.data;
      });
      if (!availability) {
        return callback(new Error(ROLE_ADD_NAME_DUPLICATE_ERROR_MESSAGE));
      }
      return callback();
    },
    // 新增角色表单校验角色名称
    async addRoleNameCheck(rule, value, callback) {
      let name = this.addForm.name;
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
      await testRoleNameAvailability(name).then(res => {
        availability = res.data.data;
      });
      if (!availability) {
        return callback(new Error(ROLE_ADD_NAME_DUPLICATE_ERROR_MESSAGE));
      }
      return callback();
    },
    // 提交新增角色表单
    commitAddForm(formName) {
      let that = this;
      // 先校验表单数据
      this.$refs[formName].validate(async (valid, error) => {
        // 校验成功，请求保存角色接口
        let name = this.addForm.name;
        let description = this.addForm.description;
        let menuIdSet = this.addForm.menuIdSet;
        if (valid) {
          this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
          await saveRole({name, description, menuIdSet}).then(res => {
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
    // 删除角色
    handleDeleteRole(roleId) {
      deleteRoleBatch([roleId]).then(res => {
        if (HTTP_RESULT_SUCCESS_CODE === res.data.code) {
          this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
        }
        this.search();
      })
    },
    // 搜索角色列表
    search() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition,
        orderFieldList: this.orderFieldList,
        orderFlagList: this.orderFlagList
      }
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      findRolePageList({...param}).then(async res => {
        let data = res.data.data;
        this.roleList = data.records;
        this.total = data.total;
        this.pageNum = data.current;
        this.pageSize = data.size;
        await this.menuTree(data.records[0].id);
        this.$loading().close();
      }).catch(e => {
        this.$loading().close();
      })
    },
    // 当多选栏改变时
    handleSelectionChange(selection) {
      // 需要判断被选中的行是否大于0
      if (selection.length > 0) {
        this.selectionButtonDisabled = false;
      } else {
        this.selectionButtonDisabled = true;
      }
      this.selectedRoleIdList = selection.map(s => s.id);
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
    // 获取并设置角色的菜单树
    menuTree(roleId) {
      findRoleMenuTree(roleId).then(res => {
        let data = res.data.data;
        this.menuTreeRoleId = data.roleId;
        let menuTreeData = data.menuTree.map(menuTree => {
          return {
            id: menuTree.menuId,
            label: menuTree.menuTitle,
            children: menuTree.children.map(child => {
              return {
                id: child.menuId,
                label: child.menuTitle
              }
            })
          }
        });
        this.roleMenuTreeData = menuTreeData;
      });
    },
  },
  mounted() {
    this.search();
    // 获取所有可配置的角色菜单树
    findMenuTree().then(res => {
      let data = res.data.data;
      let menuTreeData = data.map(menuTree => {
        return {
          id: menuTree.menuId,
          label: menuTree.menuTitle,
          children: menuTree.children.map(child => {
            return {
              id: child.menuId,
              label: child.menuTitle
            }
          })
        }
      });
      this.menuTreeData = menuTreeData;
    });
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
