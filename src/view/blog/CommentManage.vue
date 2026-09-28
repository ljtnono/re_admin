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
          @keyup.enter.native="search" />
        <el-button
          size="mini"
          type="primary"
          @click="search"
          icon="el-icon-search">
          搜索
        </el-button>
        <el-button
          size="mini"
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
                  max-height="650">
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
              <el-switch :value="row.pinned" @change="value => handleStatusChange(row, 'pinned', value)" />
            </template>
          </el-table-column>
          <el-table-column label="待审" align="center" width="70">
            <template #default="{ row }">
              <el-switch :value="row.pending" @change="value => handleStatusChange(row, 'pending', value)" />
            </template>
          </el-table-column>
          <el-table-column label="折叠" align="center" width="70">
            <template #default="{ row }">
              <el-switch :value="row.collapsed" @change="value => handleStatusChange(row, 'collapsed', value)" />
            </template>
          </el-table-column>
          <el-table-column label="赞/踩" align="center" width="90">
            <template #default="{ row }">
              {{ row.voteUp }}/{{ row.voteDown }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="评论时间" align="center" width="160">
            <template #default="{ row }">
              <span class="cell-time">
                <i class="el-icon-time" />
                {{ row.createTime }}
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" width="80">
            <template #default="{ row }">
              <el-button type="text" size="mini" style="color: #909399" @click="handleDeleteComment(row.id)">
                删除
              </el-button>
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
          :current-page="pageNum"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pageSize" />
      </div>
    </el-card>
  </div>
</template>

<script>
import { findCommentPageList, deleteCommentBatch, updateCommentStatus } from "@/api/comment";
import { HTTP_RESULT_SUCCESS_CODE } from "@/constant/commonConstant";
import { ELEMENT_PAGE_LOADING_CONFIG, ELEMENT_SUCCESS_MESSAGE_CONFIG } from "@/config/commonConfig";

export default {
  name: "CommentManage",
  data() {
    return {
      // 多选操作按钮点击状态
      selectionButtonDisabled: true,
      // 被选中的评论id列表
      selectedCommentIdList: [],
      // 评论列表
      commentList: [],
      // 当前页数
      pageNum: 1,
      // 每页条数
      pageSize: 10,
      // 总条数
      total: 0,
      // 查询条件
      searchCondition: ""
    };
  },
  methods: {
    // 更新评论状态
    handleStatusChange(row, field, value) {
      let param = {
        commentIdSet: [row.id]
      };
      param[field] = value;
      updateCommentStatus(param).then(() => {
        row[field] = value;
        this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
      }).catch(() => {});
    },
    // 删除单条评论
    handleDeleteComment(commentId) {
      this.$confirm("是否删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCommentBatch([commentId]).then(res => {
          if (HTTP_RESULT_SUCCESS_CODE === res.data.code) {
            this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
          }
          this.search();
        }).catch(() => {});
      });
    },
    // 批量删除评论
    deleteBatch() {
      this.$confirm("是否删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteCommentBatch(this.selectedCommentIdList).then(() => {
          this.$message.success(ELEMENT_SUCCESS_MESSAGE_CONFIG);
          this.search();
        }).catch(() => {});
      });
    },
    // 当多选栏改变时
    handleSelectionChange(selection) {
      this.selectionButtonDisabled = selection.length === 0;
      this.selectedCommentIdList = selection.map(s => s.id);
    },
    // 搜索评论列表
    search() {
      let param = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        searchCondition: this.searchCondition
      };
      this.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      findCommentPageList(param).then(res => {
        let data = res.data.data;
        this.commentList = data.records;
        this.total = data.total;
        this.pageNum = data.current;
        this.pageSize = data.size;
        this.$loading().close();
      }).catch(() => {
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
    }
  },
  mounted() {
    this.search();
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
