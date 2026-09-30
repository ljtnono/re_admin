<template>
  <div class="comment-manage-container p20 flex flex1 flex-direction-row">
    <el-card style="width: 100%">
      <!-- 查询表单 -->
      <div class="search-container flex flex-direction-row flex-justify-content-start mb20">
        <el-input
          class="mr20"
          v-model="searchCondition"
          placeholder="请输入评论内容关键字"
          clearable
          @keyup.enter="search" />
        <el-button
          type="primary"
          :icon="Search"
          @click="search">
          搜索
        </el-button>
        <el-button
          type="danger"
          :disabled="selectionButtonDisabled"
          @click="deleteBatch">
          删除
        </el-button>
      </div>
      <!-- 表格数据 -->
      <div class="comment-table-container">
        <el-table :data="commentList"
                  header-row-class-name="table-header"
                  @selection-change="handleSelectionChange"
                  height="700">
          <el-table-column type="selection" align="center" />
          <el-table-column prop="content" label="评论内容" show-overflow-tooltip />
          <el-table-column prop="nickname" label="评论人" align="center" width="120" />
          <el-table-column prop="articleTitle" label="所属文章" show-overflow-tooltip width="180">
            <template #default="{ row }">
              {{ row.articleTitle || row.pageKey }}
            </template>
          </el-table-column>
          <el-table-column prop="ip" label="IP" align="center" width="140" show-overflow-tooltip />
          <el-table-column label="置顶" align="center" width="70">
            <template #default="{ row }">
              <el-switch :model-value="row.pinned" @change="value => handleStatusChange(row, 'pinned', value)" />
            </template>
          </el-table-column>
          <el-table-column label="待审" align="center" width="70">
            <template #default="{ row }">
              <el-switch :model-value="row.pending" @change="value => handleStatusChange(row, 'pending', value)" />
            </template>
          </el-table-column>
          <el-table-column label="折叠" align="center" width="70">
            <template #default="{ row }">
              <el-switch :model-value="row.collapsed" @change="value => handleStatusChange(row, 'collapsed', value)" />
            </template>
          </el-table-column>
          <el-table-column label="赞/踩" align="center" width="90">
            <template #default="{ row }">
              {{ row.voteUp }}/{{ row.voteDown }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="评论时间" align="center" width="180">
            <template #default="{ row }">
              <span class="cell-time">
                <el-icon><Clock /></el-icon>
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="80">
            <template #default="{ row }">
              <div class="table-actions">

                <el-button link type="danger" :icon="Delete" @click="handleDeleteComment(row.id)">删除</el-button>

              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="mt50 mb30 fr">
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
import { ref, onMounted } from "vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import { Search, Clock, Delete } from "@element-plus/icons-vue";
import { findCommentPageList, deleteCommentBatch, updateCommentStatus } from "@/api/comment";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";

defineOptions({ name: "CommentManage" });

// 多选操作按钮点击状态
const selectionButtonDisabled = ref(true);
// 被选中的评论id列表
const selectedCommentIdList = ref([]);
// 评论列表
const commentList = ref([]);
// 当前页数
const pageNum = ref(1);
// 每页条数
const pageSize = ref(20);
// 总条数
const total = ref(0);
// 查询条件
const searchCondition = ref("");

// 更新评论状态
const handleStatusChange = (row, field, value) => {
  const param = {
    commentIdSet: [row.id]
  };
  param[field] = value;
  updateCommentStatus(param).then(() => {
    row[field] = value;
    ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
  }).catch(() => {
    // 错误消息已由axios响应拦截器统一弹出
  });
};

// 删除单条评论
const handleDeleteComment = (commentId) => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCommentBatch([commentId]).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出
    });
  }).catch(() => {});
};

// 批量删除评论
const deleteBatch = () => {
  ElMessageBox.confirm("是否删除?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCommentBatch(selectedCommentIdList.value).then(() => {
      ElMessage.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      search();
    }).catch(() => {
      // 错误消息已由axios响应拦截器统一弹出
    });
  }).catch(() => {});
};

// 当多选栏改变时
const handleSelectionChange = (selection) => {
  selectionButtonDisabled.value = selection.length === 0;
  selectedCommentIdList.value = selection.map(s => s.id);
};

// 搜索评论列表
const search = () => {
  const param = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    searchCondition: searchCondition.value
  };
  const loading = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
  findCommentPageList(param).then(res => {
    const data = res.data.data;
    commentList.value = data.records;
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
.comment-manage-container {
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
