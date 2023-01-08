<template>
  <div class="article-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <div class="search-container">
        搜索拦
      </div>
      <div class="article-table-container">
        <el-table :data="articleList" stripe border max-height="600">
          <el-table-column type="selection" width="40" />
          <el-table-column prop="avatarUrl" label="头像" min-width="80">
            <template slot-scope="scope">
              <div class="img-avatar-container">
                <img :src="scope.row.avatarUrl" :alt="scope.row.username" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="用户名" min-width="160" />
          <el-table-column prop="phone" label="手机号码" min-width="120" />
          <el-table-column prop="email" label="邮箱" min-width="200" />
          <el-table-column
            prop="createTime"
            sortable
            label="创建时间"
            min-width="160"
          />
          <el-table-column
            prop="modifyTime"
            sortable
            label="最后修改时间"
            min-width="160"
          />
          <el-table-column prop="roleIdList" label="角色" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.deleted === 1 ? "已删除" : "正常" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deleted" label="是否删除" min-width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.deleted === 1 ? "已删除" : "正常" }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="160">
            <template slot-scope="scope">
              <el-button size="mini">编辑</el-button>
              <el-button size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Article",
  data() {
    return {
      articleList: []
    }
  },
  methods: {

  },
  mounted() {
  }
};
</script>

<style lang="scss" scoped>
.article-manage-container {

}
</style>
