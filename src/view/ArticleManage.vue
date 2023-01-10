<template>
  <div class="article-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="输入文章标题"
          clearable @keyup.enter.native="search"/>
        <el-button class="btn-submit" type="primary" @click="search">搜索</el-button>
      </div>
      <!-- 表格 -->
      <div class="article-table-container">
        <el-table :data="articleList"
                  header-row-class-name="table-header"
                  @filter-change="handleFilterChange"
                  @sort-change="handleSortChange"
                  max-height="650">
          <el-table-column type="selection" align="center" width="50"/>
          <el-table-column fixed="left" prop="title" label="标题" width="200">
            <template #default="{ row, column, $index }">
              <el-tooltip
                effect="dark"
                :content="row.title"
                placement="top">
                <span class="ellipsis">
                  <i v-if="row.deleted === 1" class="iconfont icon-hidden mr5" />
                  <i v-if="row.deleted === 0" class="iconfont icon-show mr5" />
                  {{ row.title }}
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="120" :filters="categoryFilters" :filter-multiple="false" column-key="category" />
          <el-table-column prop="author" label="作者" width="120"/>
          <el-table-column prop="view" label="浏览量"  sortable="custom" width="120">
            <template #default="{ row, column, $index }">
              <i class="iconfont icon-view mr5" style="color: #19be6b;"/>
              <CountUp
                style="color: #19be6b;"
                :endVal="row.view"
                :options="countUpOptions">
              </CountUp>
            </template>
          </el-table-column>
          <el-table-column prop="favorite" label="喜欢数" sortable="custom" width="120">
            <template #default="{ row, column, $index }">
              <i class="iconfont icon-favorite mr5" style="color: #ffaad0"/>
              <CountUp
                style="color: #ffaad0"
                :endVal="row.favorite"
                :options="countUpOptions">
              </CountUp>
            </template>
          </el-table-column>
          <el-table-column prop="recommend" align="center" label="推荐" width="100" :filters="recommendFilters" :filter-multiple="false" column-key="recommend">
            <template #default="{ row, column, $index }">
              <el-switch
                :v-model="row.recommend"
                :value="row.recommend"
                :active-value="1"
                :inactive-value="0"
                @change="changeRecommendStatus(row.id)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="top" align="center" label="置顶" width="100" :filters="topFilters" :filter-multiple="false" column-key="top">
            <template #default="{ row, column, $index }">
              <el-switch
                :v-model="row.top"
                :value="row.top"
                :active-value="1"
                :inactive-value="0"
                @change="changeTopStatus(row.id)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="tagList" align="center" label="标签">
            <template #default="{ row, column, $index }">
              <el-tag size="mini" v-for="(tag, index) in row.tagList" :key="index">
                {{ tag }}
              </el-tag>
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
          <el-table-column prop="modifyTime" label="最后更新" align="center" sortable="custom" width="160">
            <template #default="{ row, column, $index }">
              <span class="cell-time">
                <i class="el-icon-time"/>
                {{ row.modifyTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center">
            <template #default>
              <el-button type="text" size="mini" style="margin-right: 10px">
                编辑
              </el-button>
              <el-dropdown trigger="click">
                <el-button type="text" size="mini">
                  更多操作
                  <i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu>
                  <el-dropdown-item>推荐</el-dropdown-item>
                  <el-dropdown-item>置顶</el-dropdown-item>
                  <el-dropdown-item>隐藏</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
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
    </el-card>
  </div>
</template>

<script>
import {findArticleList} from "@/api/article";
import CountUp from "vue-countup-v2";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import {mapGetters} from "vuex";
import {
  ARTICLE_NOT_RECOMMEND, ARTICLE_NOT_TOP,
  ARTICLE_RECOMMEND,
  ARTICLE_TOP,
  ORDER_BY_ASC,
  ORDER_BY_DESC
} from "@/constant/commonConstant";
import S from "string";

export default {
  name: "Article",
  components: {
    CountUp
  },
  data() {
    return {
      // 文章列表
      articleList: [],
      // countUp配置
      countUpOptions: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: "."
      },
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
      recommend: null,
      // 分类筛选条件
      category: null,
      // 推荐筛选列表
      recommendFilters: [
        {
          text: "推荐",
          value: ARTICLE_RECOMMEND
        },
        {
          text: "不推荐",
          value: ARTICLE_NOT_RECOMMEND
        }
      ],
      // 置顶筛选列表
      topFilters: [
        {
          text: "置顶",
          value: ARTICLE_TOP
        },
        {
          text: "不置顶",
          value: ARTICLE_NOT_TOP
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      categoryFilters: "common/categoryFilters"
    })
  },
  methods: {
    // 当置顶参数改变时
    changeTopStatus(id) {
      let articleList = this.articleList;
      for (let index in articleList) {
        let article = articleList[index];
        if (article.id === id) {
          let oldTop = article.top;
          if (oldTop === ARTICLE_NOT_TOP) {
            this.articleList[index].top = ARTICLE_TOP;
          } else {
            this.articleList[index].top = ARTICLE_NOT_TOP;
          }
        }
      }
    },
    // 当推荐参数改变时
    changeRecommendStatus(id) {
      let articleList = this.articleList;
      for (let index in articleList) {
        let article = articleList[index];
        if (article.id === id) {
          let oldRecommend = article.recommend;
          if (oldRecommend === ARTICLE_NOT_RECOMMEND) {
            this.articleList[index].recommend = ARTICLE_RECOMMEND;
          } else {
            this.articleList[index].recommend = ARTICLE_NOT_RECOMMEND;
          }
        }
      }
    },
    // 处理筛选变化
    async handleFilterChange(filterObj) {
      if (filterObj.category) {
        this.category = filterObj.category[0];
      } else if (filterObj.recommend) {
        this.recommend = filterObj.recommend[0];
      } else if (filterObj.top) {
        this.top = filterObj.top[0];
      }
      await this.search();
    },
    // 处理排序变化
    async handleSortChange(sortObj) {
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
      await this.search();
    },
    // 处理每页条数变化
    async handleSizeChange(val) {
      this.pageSize = val;
      await this.search();
    },
    // 处理当前页数变化
    async handleCurrentChange(val) {
      this.pageNum = val;
      await this.search();
    },
    // 分页查询
    async search() {
      let param = {
        searchCondition: this.searchCondition,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        orderFieldList: this.orderFieldList,
        orderFlagList: this.orderFlagList,
        top: this.top,
        recommend: this.recommend,
        category: this.category
      };
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      await findArticleList({...param}).then(res => {
        let data = res.data.data;
        this.articleList = data.records;
        this.total = data.total;
        this.pageNum = data.current;
        this.pageSize = data.size;
      });
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
    }
  },
  mounted() {
    this.search().catch(e => {
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
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

.article-manage-container {

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
