<template>
  <div class="article-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="输入文章标题"
          clearable @keyup.enter="search" />
        <el-button
          type="primary"
          :icon="Search"
          @click="search(1)">
          搜索
        </el-button>
        <el-dropdown class="ml10" trigger="click" @command="handleSelectionOperation">
          <el-button type="info" :disabled="selectionButtonDisabled" :icon="ArrowDown">
            更多操作
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="recommend">推荐</el-dropdown-item>
              <el-dropdown-item command="top">置顶</el-dropdown-item>
              <el-dropdown-item command="hidden">隐藏</el-dropdown-item>
              <el-dropdown-item command="show">显示</el-dropdown-item>
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div class="table-filters">
          <el-select
            v-model="category"
            placeholder="全部分类"
            clearable
            class="filter-select"
            @change="search()">
            <el-option v-for="item in categoryFilters" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
          <el-select
            v-model="recommend"
            placeholder="推荐状态"
            clearable
            class="filter-select"
            @change="search()">
            <el-option v-for="item in recommendFilters" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
          <el-select
            v-model="top"
            placeholder="置顶状态"
            clearable
            class="filter-select"
            @change="search()">
            <el-option v-for="item in topFilters" :key="item.value" :label="item.text" :value="item.value" />
          </el-select>
        </div>
      </div>
      <!-- 表格 -->
      <div class="article-table-container">
        <el-table :data="articleList"
                  header-row-class-name="table-header"
                  @selection-change="handleSelectionChange"
                  @sort-change="handleSortChange"
                  height="700">
          <el-table-column type="selection" align="center" width="50" />
          <el-table-column fixed="left" prop="title" label="标题" width="200">
            <template #default="{ row }">
              <el-tooltip
                effect="dark"
                :content="row.title"
                placement="top">
                <span class="ellipsis">
                  <i :class="'iconfont mr5 cursor-pointer ' + (row.deleted === ENTITY_DELETE_STATE_DELETE ? 'icon-hidden' : 'icon-show')" @click.stop="handleDeleteIconChange(row)" />
                  <span class="article-title-link" @click="handleTitleClick(row)">{{ row.title }}</span>
                </span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="分类" width="120" />
          <el-table-column prop="author" label="作者" width="120" />
          <el-table-column prop="view" label="浏览量" sortable="custom" width="120">
            <template #default="{ row }">
              <span class="cell-count count-view">
                <i class="iconfont icon-view" />
                <CountUp :end-val="row.view || 0" :options="countUpOptions" />
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="favorite" label="喜欢数" sortable="custom" width="120">
            <template #default="{ row }">
              <span class="cell-count count-favorite">
                <i class="iconfont icon-favorite" />
                <CountUp :end-val="row.favorite || 0" :options="countUpOptions" />
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="recommend" align="center" label="推荐" width="100">
            <template #default="{ row }">
              <el-switch
                :model-value="row.recommend"
                :active-value="ARTICLE_RECOMMEND"
                :inactive-value="ARTICLE_NOT_RECOMMEND"
                @change="changeRecommendStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column prop="top" align="center" label="置顶" width="100">
            <template #default="{ row }">
              <el-switch
                :model-value="row.top"
                :active-value="ARTICLE_TOP"
                :inactive-value="ARTICLE_NOT_TOP"
                @change="changeTopStatus(row)" />
            </template>
          </el-table-column>
          <el-table-column prop="tagList" align="center" label="标签" min-width="180">
            <template #default="{ row }">
              <el-tag size="small" v-for="(tag, index) in row.tagList" :key="index" class="cell-tag">{{ tag }}</el-tag>
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
          <el-table-column prop="modifyTime" label="最后更新" align="center" sortable="custom" width="180">
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

                <el-button link type="primary" :icon="Edit" @click="handleEdit(row)">编辑</el-button>

                <el-dropdown trigger="click" @command="handleOperation">

                  <el-button link type="primary">更多<el-icon class="el-icon--right"><ArrowDown /></el-icon></el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :command="{ opt: 'recommend', row }">推荐</el-dropdown-item>
                    <el-dropdown-item :command="{ opt: 'top', row }">置顶</el-dropdown-item>
                    <el-dropdown-item :command="{ opt: row.deleted === ENTITY_DELETE_STATE_NORMAL ? 'hidden' : 'show', row }">{{ row.deleted === ENTITY_DELETE_STATE_NORMAL ? '隐藏' : '显示' }}</el-dropdown-item>
                    <el-dropdown-item :command="{ opt: 'delete', row }">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
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
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { ElLoading, ElMessage } from "element-plus";
import { Search, ArrowDown, Clock, Edit } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import CountUp from "vue-countup-v3";
import {
  deleteArticleBatch,
  findArticleList,
  updateArticleDeleteBatch,
  updateArticleRecommendBatch,
  updateArticleTopBatch
} from "@/api/article";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";
import { useCommonStore } from "@/store/common";
import {
  ARTICLE_NOT_RECOMMEND,
  ARTICLE_NOT_TOP,
  ARTICLE_RECOMMEND,
  ARTICLE_TOP,
  ENTITY_DELETE_STATE_DELETE,
  ENTITY_DELETE_STATE_NORMAL,
  getArticleRecommendContrary,
  getArticleTopContrary,
  ORDER_BY_ASC,
  ORDER_BY_DESC
} from "@/constant/commonConstant";

defineOptions({ name: "ArticleManage" });

const router = useRouter();
const commonStore = useCommonStore();

// 文章列表
const articleList = ref([]);
// 多选操作按钮点击状态
const selectionButtonDisabled = ref(true);
// 被选中的文章id列表
const selectedArticleIdList = ref([]);
// countUp配置
const countUpOptions = {
  useEasing: true,
  useGrouping: true,
  separator: ",",
  decimal: "."
};
// 搜索条件
const searchCondition = ref(null);
// 当前页码
const pageNum = ref(1);
// 每页条数
const pageSize = ref(20);
// 总条数
const total = ref(0);
// 排序字段条件
const orderFieldList = ref([]);
// 排序标记条件
const orderFlagList = ref([]);
// 置顶筛选条件
const top = ref(null);
// 推荐筛选条件
const recommend = ref(null);
// 分类筛选条件
const category = ref(null);
// 推荐筛选列表
const recommendFilters = [
  {
    text: "推荐",
    value: ARTICLE_RECOMMEND
  },
  {
    text: "不推荐",
    value: ARTICLE_NOT_RECOMMEND
  }
];
// 置顶筛选列表
const topFilters = [
  {
    text: "置顶",
    value: ARTICLE_TOP
  },
  {
    text: "不置顶",
    value: ARTICLE_NOT_TOP
  }
];

// 分类筛选列表
const categoryFilters = computed(() => commonStore.categoryFilters);

// 驼峰转下划线
const underscore = (str) => str.replace(/([A-Z])/g, (m) => "_" + m.toLowerCase());

// 跳转到写文章页面编辑该文章
const handleEdit = (row) => {
  router.push({ name: "WriteArticle", query: { articleId: row.id } });
};

// 点击文章标题：跳转到写文章页面并以预览模式查看
const handleTitleClick = (row) => {
  router.push({ name: "WriteArticle", query: { articleId: row.id, preview: 1 } });
};

// 处理多选栏操作
const handleSelectionOperation = async (command) => {
  const articleIdList = selectedArticleIdList.value;
  if (command === "recommend") {
    await updateArticleRecommendBatch(articleIdList, ARTICLE_RECOMMEND).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {});
  } else if (command === "top") {
    await updateArticleTopBatch(articleIdList, ARTICLE_TOP).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {});
  } else if (command === "hidden") {
    await updateArticleDeleteBatch(articleIdList, ENTITY_DELETE_STATE_DELETE).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {});
  } else if (command === "show") {
    await updateArticleDeleteBatch(articleIdList, ENTITY_DELETE_STATE_NORMAL).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {});
  } else if (command === "delete") {
    await deleteArticleBatch(articleIdList).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {});
  }
  search();
};

// 当多选栏改变时
const handleSelectionChange = (selection) => {
  selectionButtonDisabled.value = selection.length === 0;
  selectedArticleIdList.value = selection.map(s => s.id);
};

// 修改推荐状态
const changeRecommendStatus = (article) => {
  const recommend = article.recommend;
  article.recommend = getArticleRecommendContrary(article.recommend);
  updateArticleRecommendBatch([article.id], article.recommend).then(() => {
    ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
  }).catch(() => {
    article.recommend = recommend;
  });
};

// 修改置顶状态
const changeTopStatus = (article) => {
  const top = article.top;
  article.top = getArticleTopContrary(article.top);
  updateArticleTopBatch([article.id], article.top).then(() => {
    ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
  }).catch(() => {
    article.top = top;
  });
};

// 处理行内更多操作
const handleOperation = (command) => {
  const article = command.row;
  const articleId = article.id;
  const opt = command.opt;
  if (opt === "recommend") {
    const recommend = article.recommend;
    article.recommend = ARTICLE_RECOMMEND;
    updateArticleRecommendBatch([articleId], ARTICLE_RECOMMEND).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {
      article.recommend = recommend;
    });
  } else if (opt === "top") {
    const top = article.top;
    article.top = ARTICLE_TOP;
    updateArticleTopBatch([articleId], ARTICLE_TOP).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {
      article.top = top;
    });
  } else if (opt === "hidden") {
    const deleted = article.deleted;
    article.deleted = ENTITY_DELETE_STATE_DELETE;
    updateArticleDeleteBatch([articleId], ENTITY_DELETE_STATE_DELETE).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {
      article.deleted = deleted;
    });
  } else if (opt === "show") {
    const deleted = article.deleted;
    article.deleted = ENTITY_DELETE_STATE_NORMAL;
    updateArticleDeleteBatch([articleId], ENTITY_DELETE_STATE_NORMAL).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
    }).catch(() => {
      article.deleted = deleted;
    });
  } else if (opt === "delete") {
    deleteArticleBatch([articleId]).then(async () => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      await search();
    }).catch(() => {});
  }
};

// 处理点击眼睛按钮
const handleDeleteIconChange = (row) => {
  const deleteStatus = row.deleted === ENTITY_DELETE_STATE_DELETE ? ENTITY_DELETE_STATE_NORMAL : ENTITY_DELETE_STATE_DELETE;
  row.deleted = deleteStatus;
  updateArticleDeleteBatch([row.id], deleteStatus).then(() => {
    ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
  }).catch(() => {
    row.deleted = deleteStatus === ENTITY_DELETE_STATE_DELETE ? ENTITY_DELETE_STATE_NORMAL : ENTITY_DELETE_STATE_DELETE;
  });
};

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

// 分页查询
const search = (num, size) => {
  if (num != null) {
    pageNum.value = num;
  }
  if (size != null) {
    pageSize.value = size;
  }
  const param = {
    searchCondition: searchCondition.value,
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    orderFieldList: orderFieldList.value,
    orderFlagList: orderFlagList.value,
    top: top.value,
    recommend: recommend.value,
    category: category.value
  };
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  findArticleList({ ...param }).then(res => {
    const data = res.data.data;
    articleList.value = data.records;
    total.value = data.total;
    pageNum.value = data.current;
    pageSize.value = data.size;
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
.article-manage-container {

  .search-container {
    width: auto;
    height: 40px;

    .el-input {
      width: auto;
      min-width: 280px;
    }

    // 筛选区：靠右对齐，与左侧搜索区域拉开间距
    .table-filters {
      margin-left: auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 10px;

      .filter-select {
        width: 130px;
      }
    }
  }

  // 文章标题链接：悬停高亮
  .article-title-link {
    cursor: pointer;
    padding: 2px 6px;
    margin-left: -6px;
    border-radius: 4px;
    transition: color 0.2s, background-color 0.2s;

    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
  }
}
</style>
