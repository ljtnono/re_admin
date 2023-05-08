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
        <!-- 新增用户接口 -->
        <el-button
          size="mini"
          type="success"
          @click="addFormVisible = true"
          icon="el-icon-plus">
          新增
        </el-button>
      </div>
      <!-- 表格数据 -->
      <div class="menu-table-container">
        <el-table :data="menuList"
                  header-row-class-name="table-header"
                  row-key="hash"
                  max-height="650">
          <el-table-column fixed="left" prop="title" label="菜单标题"  />
          <el-table-column prop="icon" label="图标" >
            <template #default="{ row, column, $index }">
              <i :class="'iconfont ' + row.icon" />
            </template>
          </el-table-column>
          <el-table-column prop="routePath" label="路由路径" />
          <el-table-column prop="routeName" label="路由名称" />
          <el-table-column prop="componentPath" label="菜单组件路径" />
          <el-table-column fixed="right" label="操作" align="center">
            <template #default="{ row, column, $index }">
              <el-button type="text" size="mini" style="color: #909399" @click="handleDeleteMenu(row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 新增菜单模态弹窗 -->
      <div class="add-form-container">
        <el-dialog title="新增菜单"
                   top="4vh"
                   width="800px"
                   center
                   :visible.sync="addFormVisible">
          <template slot="default">
            <!-- 新增用户表单 -->
            <el-form ref="addForm" :model="addForm" :rules="addFormRule" label-width="100px" inline>
              <el-tabs activeName="menuConfig">
                <!-- 菜单配置 -->
                <el-tab-pane label="菜单配置" name="menuConfig" >
                  <el-form-item label="菜单标题：" prop="title" class="is-required">
                    <el-input v-model="addForm.title" size="small" clearable placeholder="请输入菜单标题" />
                  </el-form-item>
                  <el-form-item label="路由路径：" prop="routePath" class="is-required">
                    <el-input v-model="addForm.routePath" size="small" clearable placeholder="请输入路由路径" />
                  </el-form-item>
                  <el-form-item label="父级菜单：" prop="parentId" class="is-required">
                    <vue-treeselect
                      v-model="addForm.parentId"
                      :options="menuTreeData"
                      style="width: 182px;" />
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
                  <el-button icon="el-icon-plus" @click="addMenuPermission" class="mb20" size="mini" type="success">新增菜单权限</el-button>
                  <ul class="menu-permission-list-container">
                    <li v-for="(item, index) in addForm.permissionList" :key="index">
                      <el-form-item label="权限名称" class="is-required">
                        <el-input size="small" v-model="item.name" clearable placeholder="请输入权限名称" />
                      </el-form-item>
                      <el-form-item label="权限表达式" class="is-required">
                        <el-input size="small" v-model="item.expression" clearable placeholder="请输入权限表达式" />
                      </el-form-item>
                      <el-button icon="el-icon-sub" @click="removeMenuPermission(index)" class="mb20" size="mini" type="danger">删除</el-button>
                    </li>
                  </ul>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </template>
          <template slot="footer">
            <span class="dialog-footer">
              <el-button @click="addFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="commitAddForm('addForm')">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import {ENTITY_DELETE_STATE_DELETE, ENTITY_DELETE_STATE_NORMAL, HTTP_RESULT_SUCCESS_CODE} from "@/constant/commonConstant";
import {ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG} from "@/config/commonConfig";
import {findMenuList, findMenuTree} from "@/api/menu";
import VueTreeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { deleteMenu } from "@/api/menu";
import {
  MENU_ADD_TITLE_EMPTY_ERROR_MESSAGE,
  MENU_ADD_TITLE_FORMAT_ERROR_MESSAGE,
  MENU_ADD_ROUTE_NAME_EMPTY_ERROR_MESSAGE,
  MENU_ADD_ROUTE_NAME_FORMAT_ERROR_MESSAGE,
  MENU_ADD_ROUTE_NAME_DUPLICATE_ERROR_MESSAGE,
  MENU_ADD_ROUTE_PATH_EMPTY_ERROR_MESSAGE,
  MENU_ADD_ROUTE_PATH_FORMAT_ERROR_MESSAGE,
  MENU_ADD_ROUTE_PATH_DUPLICATE_ERROR_MESSAGE,
  MENU_ADD_COMPONENT_PATH_EMPTY_ERROR_MESSAGE,
  MENU_ADD_COMPONENT_PATH_FORMAT_ERROR_MESSAGE,
  MENU_ADD_PARENT_ID_EMPTY_ERROR_MESSAGE
} from "@/constant/errorMessageConstant";
import {
  MENU_ADD_TITLE_REGEX,
  MENU_ADD_ROUTE_NAME_REGEX,
  MENU_ADD_ROUTE_PATH_REGEX,
  MENU_ADD_COMPONENT_PATH_REGEX
} from "@/constant/regexConstant";
import { checkMenuRouteNameDuplicate, checkMenuRoutePathDuplicate, saveMenu } from "@/api/menu";

export default {
  name: "MenuManage",
  components: {
    VueTreeselect
  },
  data() {
    return {
      ENTITY_DELETE_STATE_DELETE,
      ENTITY_DELETE_STATE_NORMAL,
      // 当前查询条件
      searchCondition: "",
      // 菜单列表
      menuList: [],
      // 新增表单框是否显示
      addFormVisible: false,
      // 菜单树数据
      menuTreeData: [],
      // 新增菜单表单数据
      addForm: {
        title: null,
        icon: null,
        parentId: null,
        routePath: null,
        routeName: null,
        componentPath: null,
        permissionList: [{
          name: null,
          expression: null
        }]
      },
      // 新增菜单表单校验
      addFormRule: {
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
            validator: this.addRouteNameCheck,
            trigger: "blur"
          }
        ],
        routePath: [
          {
            required: true,
            validator: this.addRoutePathCheck,
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
      }
    }
  },
  methods: {
    addMenuPermission() {
      this.addForm.permissionList.push({
        name: null,
        expression: null
      });
    },
    removeMenuPermission(index) {
      // 移除最后一个表单项
      this.addForm.permissionList.splice(index, 1);
    },
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
    // 处理新增菜单路由名称校验
    async addRouteNameCheck(rule, value, callback) {
      let routeName = this.addForm.routeName;
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
    },
    // 处理新增菜单路由名称校验
    async addRoutePathCheck(rule, value, callback) {
      let routePath = this.addForm.routePath;
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
    },
    // 提交新增菜单表单
    commitAddForm(formName) {
      let that = this;
      // 先校验表单数据
      this.$refs[formName].validate(async (valid, error) => {
        // 校验成功，请求保存菜单接口
        let data = {
          title: this.addForm.title,
          routeName: this.addForm.routeName,
          parentId: this.addForm.parentId,
          routePath: this.addForm.routePath,
          componentPath: this.addForm.componentPath,
          icon: this.addForm.icon
        }
        if (valid) {
          this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
          await saveMenu({...data}).then(res => {
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
          await findMenuTree().then(res => {
            let data = res.data.data;
            let allRoleMenuTreeData = [{
              id: -1,
              label: "顶层菜单"
            }];
            let mapData = this.mapMenuData(data);
            mapData.forEach(d => allRoleMenuTreeData.push(d));
            this.menuTreeData = allRoleMenuTreeData;
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
    mapMenuData(data) {
      return data.map(item => ({
        id: item.menuId,
        label: item.menuTitle,
        children: item.children.length > 0 ? this.mapMenuData(item.children) : undefined
      }));
    },
    // 处理删除菜单
    handleDeleteMenu(menuId) {
      this.$confirm("是否删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteMenu(menuId).then(res => {
          if (HTTP_RESULT_SUCCESS_CODE === res.data.code) {
            this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
            this.search();
          }
        });
      });
    }
  },
  mounted() {
    this.search();
    // 获取所有可配置的角色菜单树
    findMenuTree().then(res => {
      let data = res.data.data;
      let allRoleMenuTreeData = [{
        id: -1,
        label: "顶层菜单"
      }];
      let mapData = this.mapMenuData(data);
      mapData.forEach(d => allRoleMenuTreeData.push(d));
      this.menuTreeData = allRoleMenuTreeData;
    });
  }
}
</script>

<style scoped lang="scss">

::v-deep .el-tabs__content {
  overflow: visible;
}

::v-deep .el-form-item__content {
  line-height: normal;
}

::v-deep .vue-treeselect__input {
  height: 32px;
  box-sizing: border-box;
}

::v-deep .vue-treeselect__control {
  height: 32px;
}

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
