<template>
  <div class="article-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%" >
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="输入标题、简介"
          clearable @keyup.enter.native="search"/>
        <el-button class="btn-submit" type="primary" @click="search">搜索</el-button>

      </div>
      <!-- 表格 -->
      <div class="article-table-container">
        <el-table :data="articleList"
                  header-row-class-name="table-header"
                  max-height="700">
          <el-table-column type="selection" align="center" width="50"/>
          <el-table-column prop="title" label="标题" />
<!--          <el-table-column prop="summary" label="简介" />-->
          <el-table-column prop="category" label="分类" width="140" />
          <el-table-column prop="author" label="作者" width="140"/>
          <el-table-column prop="view" label="浏览量" align="center" sortable width="90"/>
          <el-table-column prop="favorite" label="喜欢数" align="center" sortable width="90"/>
          <el-table-column prop="recommend" align="center" label="推荐" width="100">
            <template slot="default" slot-scope="row, column, index">
              <el-switch
                :v-model="row.recommend === 0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="top" align="center" label="置顶" width="100">
            <template slot="default" slot-scope="row, column, index">
              <el-switch
                :v-model="row.top === 0">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="tagList" label="标签列表"  >
            <slot name="default">
              <el-tag size="mini" >超小标签</el-tag>
              <el-tag size="mini" >超小标签</el-tag>
              <el-tag size="mini" >超小标签</el-tag>
              <el-tag size="mini" >超小标签</el-tag>
            </slot>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable width="200" >
            <template slot-scope="{ row, column, index }">
              <span class="cell-time">
                <i class="el-icon-time" />
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="modifyTime" label="最后更新" sortable width="200">
            <template slot-scope="{ row, column, index }">
              <span class="cell-time">
                <i class="el-icon-time" />
                {{ row.modifyTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" >
            <slot name="default">
              <el-button size="mini" type="danger">更多</el-button>
            </slot>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="mt50 mb30 fr" >
        <!-- 分页按钮 -->
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="total"
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize" />
      </div>
    </el-card>
  </div>
</template>

<script>
import {findArticleList} from "@/api/article";

export default {
  name: "Article",
  data() {
    return {
      // 文章列表
      articleList: [],
      // 搜索条件
      searchCondition: null,
      // 当前页码
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 排序字段条件
      orderFieldList: [],
      // 排序标记条件
      orderFlagList: [],
      // 置顶筛选条件
      top: null,
      // 推荐筛选条件
      recommend: null
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 分页查询
    search() {
      let param = {
        searchCondition: this.searchCondition,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderFieldList: this.orderFieldList,
        orderFlagList: this.orderFlagList,
        top: this.top,
        recommend: this.recommend
      }
      findArticleList({...param})
        .then(res => {
          let data = res.data.data;
          this.articleList = data.records;
          this.total = data.total;
          this.pageNum = data.current;
          this.pageSize = data.size;
        });
    }
  },
  mounted() {
    this.search();
  }
};
</script>

<style lang="scss" scoped>

.article-manage-container {

  ::v-deep .table-header {
    th {
      background: #FAFAFA;
      font-size: 14px;
      color: #000000;
    }
  }

  ::v-deep table {
    border-spacing: 0px;
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
