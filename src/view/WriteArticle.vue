<template>
  <div class="write-article-container p20 flex flex1 flex-direction-row">
    <!-- 草稿箱列表 -->
    <div class="draft-container flex flex-direction-column mr5">
      <!-- 新建文章按钮 -->
      <div @click="newArticle" class="new-btn-container flex flex-direction-row">
        <i class="iconfont icon-add mr10" style="margin-top: 1px;"/>
        <span>新建文章</span>
      </div>
      <!-- 草稿葙列表 -->
      <div class="draft-list-container flex flex1 flex-direction-column">
        <span class="empty-text" v-if="draftList.length === 0">
          草稿箱为空
        </span>
        <!-- 第一个草稿为当前正在编辑的草稿 -->
        <div @click="editDraft(index)" v-for="(item, index) in draftList" :key="item.draftId"
             :class="index === currentDraftIndex ? 'draft-item-container flex flex-direction-row flex-justify-content-space-between ' + 'draft-item-container-current' : 'draft-item-container flex flex-direction-row flex-justify-content-space-between'">
          <i class="flex iconfont icon-icon-article"/>
          <span class="flex draft-title">{{ item.title }}</span>
          <span class="flex draft-date">{{ item.saveTime | dateFormat('yyyy-MM-D') }}</span>
          <el-dropdown class="flex" v-if="currentDraftIndex === index" @command="handleDraftDropdownCommand">
            <i class="iconfont icon-setting" style="font-size: 16px;line-height: 40px;color: #4a4a4a"/>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delete">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <!-- 编辑区 -->
    <div class="editor-container flex flex1">
      <mavon-editor
        ref="md"
        @imgAdd="imgAdd"
        :language="editorConfig.language"
        :font-size="editorConfig.fontSize"
        :scroll-style="editorConfig.scrollStyle"
        :box-shadow="editorConfig.boxShadow"
        :transition="editorConfig.transition"
        :subfield="editorConfig.subfield"
        :defaultOpen="editorConfig.defaultOpen"
        :placeholder="editorConfig.placeholder"
        :editable="editorConfig.editable"
        :code-style="editorConfig.codeStyle"
        :toolbars-flag="editorConfig.toolbarsFlag"
        :navigation="editorConfig.navigation"
        :short-cut="editorConfig.shortCut"
        :autofocus="editorConfig.autofocus"
        :ishljs="editorConfig.ishljs"
        :image-filter="editorConfig.imageFilter"
        :image-click="editorConfig.imageClick"
        :tab-size="4"
        :html="editorConfig.html"
        :xss-options="editorConfig.xssOptions"
        :toolbars="editorConfig.toolbars"
        :value="currentDraftMarkdownContent"
        @change="editorChange"
        @save="editorSave"
        style="width: 100%;">
        <!-- 右工具栏前加入自定义按钮  -->
        <template slot="right-toolbar-before">
          <span>{{ saveStatusStr }}</span>
        </template>
        <template slot="left-toolbar-after">
          <span @click="showPublishForm = !showPublishForm">发布文章</span>
        </template>
      </mavon-editor>
    </div>
    <!-- publishForm -->
    <div v-if="showPublishForm" class="publish-form-container">
      <publish-article-form/>
    </div>
  </div>
</template>

<script>

import {EDITOR_CONFIG} from "../config/commonConfig";
import DateUtil from "@/util/dateUtil";
import PublishArticleForm from "@c/PublishArticleForm.vue";
import {deleteDraft, getDraftDetail, getDraftList, saveOrUpdateDraft} from "../api/article";
import articleUtil from "@/util/articleUtil";
import commonUtil from "@/util/commonUtil";
import {uploadFile} from "@/api/common";

export default {
  name: "WriteArticle",
  components: {PublishArticleForm},
  data() {
    return {
      // 当前草稿id
      currentDraftId: null,
      // 当前草稿标题
      currentDraftTitle: null,
      // 当前草稿内容
      currentDraftMarkdownContent: null,
      // 草稿列表
      draftList: [],
      // 当前显示的草稿列表下表
      currentDraftIndex: 0,
      // 当前保存状态
      saveStatus: 2,
      showPublishForm: true,
      editorConfig: EDITOR_CONFIG,
    }
  },
  computed: {
    saveStatusStr() {
      let saveStatus = this.saveStatus;
      if (saveStatus === 0) {
        return "未保存";
      } else if (saveStatus === 1) {
        return "保存中...";
      } else {
        return "已保存";
      }
    }
  },
  props: {},
  methods: {
    // 刷新草稿列表并显示第index草稿的内容
    async refreshDraftList(showIndex) {
      let that = this;
      getDraftList().then(async res => {
        that.draftList = res.data.data;
        if (!showIndex) {
          showIndex = 0;
        }
        let showDraftId = that.draftList[showIndex].draftId;
        // 获取当前数据
        await getDraftDetail(showDraftId).then(r => {
          let draft = r.data.data;
          that.currentDraftId = draft.draftId;
          that.currentDraftIndex = showIndex;
          that.currentDraftMarkdownContent = draft.markdownContent;
          that.currentDraftTitle = draft.title;
          that.saveStatus = 2;
        });
        // 这里是为了修复从别的页面跳转时保存状态被editorChange覆盖为0，请勿删除
        that.saveStatus = 2;
      });
    },
    // 编辑某个草稿
    editDraft: commonUtil.throttle(async function (index) {
      let that = this;
      let showDraftId = that.draftList[index].draftId;
      if (that.currentDraftIndex !== index) {
        // 先保存当前的内容
        let currentDraftMarkdownContent = that.currentDraftMarkdownContent;
        let currentDraftTitle = articleUtil.getTitleFromMarkdownContent(currentDraftMarkdownContent) || DateUtil.getNowDate("yyyy-MM-D");
        let currentDraftId = that.currentDraftId;
        await saveOrUpdateDraft(currentDraftId, currentDraftTitle, currentDraftMarkdownContent);
        await getDraftDetail(showDraftId).then(r => {
          let draft = r.data.data;
          that.currentDraftIndex = index;
          that.currentDraftMarkdownContent = draft.markdownContent;
          that.currentDraftTitle = draft.title;
          that.currentDraftId = draft.draftId;
          that.saveStatus = 2;
        });
        that.saveStatus = 2;
      }
    }, 200),
    // 监听markdown内容改变事件
    editorChange(value) {
      let that = this;
      // 只监听当前草稿的改动
      that.currentDraftMarkdownContent = value;
      that.currentDraftTitle = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("yyyy-MM-D");
      that.saveStatus = 0;
    },
    // 保存草稿
    editorSave: commonUtil.throttle(async function (value) {
      let that = this;
      that.saveStatus = 1;
      // 保存或更新草稿
      let draftTitle = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("yyyy-MM-D");
      await saveOrUpdateDraft(that.currentDraftId, draftTitle, value);
      // 重新获取草稿列表
      await that.refreshDraftList();
      that.saveStatus = 2;
    }, 200),
    // 新建文章
    newArticle: commonUtil.throttle(async function () {
      let that = this;
      let now = DateUtil.getNowDate("yyyy-MM-D");
      let markdownContent = "# " + now;
      let title = articleUtil.getTitleFromMarkdownContent(markdownContent) || now;
      that.saveStatus = 1;
      await saveOrUpdateDraft(null, title, markdownContent);
      that.saveStatus = 2;
      // 再请求一次列表
      await that.refreshDraftList();
    }, 200),
    // 处理草稿下拉列表
    async handleDraftDropdownCommand(command) {
      let that = this;
      if (command === "delete") {
        let draftId = that.currentDraftId;
        // 删除该行
        await deleteDraft(draftId).then(() => {
          // 弹出删除成功的弹窗
          that.$message.success("删除成功");
        });
        // 重新请求草稿列表
        await that.refreshDraftList();
      }
    },
    // 处理图片上传
    imgAdd(pos, file) {
      let vm = this.$refs.md;
      const data = new FormData();
      data.append("file", file);
      // 第一步.将图片上传到服务器.
      uploadFile(data).then(res => {
        // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
        let url = res.data.data;
        vm.$img2Url(pos, url);
      });
    }
  },
  mounted() {
    let that = this;
    // 获取草稿列表
    that.refreshDraftList();
  },
  async beforeDestroy() {
    let that = this;
    // 页面销毁之前保存草稿
    if (that.saveStatus === 0) {
      that.saveStatus = 1;
      await saveOrUpdateDraft(that.currentDraftId, that.currentDraftTitle, that.currentDraftMarkdownContent);
      that.saveStatus = 2;
    }
  },
  async beforeRouteLeave(to, from, next) {
    let that = this;
    // 跳转之前保存当前草稿
    if (that.saveStatus === 0) {
      that.saveStatus = 1;
      await saveOrUpdateDraft(that.currentDraftId, that.currentDraftTitle, that.currentDraftMarkdownContent);
      that.saveStatus = 2;
    }
    next();
  }
}
</script>

<style lang="scss" scoped>
.write-article-container {

  .draft-container {
    width: 20%;
    background: #ffffff;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;
    height: 850px;

    .new-btn-container {
      height: 20px;
      padding: 20px 25px;
      cursor: pointer;
      border-bottom: 1px solid #cccccc;

      a {
        color: #595959;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
      }
    }

    .draft-list-container {
      overflow-y: scroll;
      overflow-x: hidden;

      .empty-text {
        font-size: 16px;
        text-align: center;
        margin-top: 40px;
        color: #4a4a4a;
      }

      .draft-item-container {
        padding: 10px;
        border-bottom: 1px solid #cccccc;
        height: 40px;
        cursor: pointer;

        i {
          font-size: 30px;
          color: #c1b075;
        }

        span {
          line-height: 40px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .draft-title {
          font-size: 12px;
          color: #595959;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .draft-date {
          font-size: 12px;
        }

        &:hover {
          background: #e0e0e0;
        }
      }

      .draft-item-container-current {
        background: #e0e0e0;

        i {
          color: #b0b0b0;
        }
      }
    }
  }

  .editor-container {
    width: 80%;
    height: 850px;
  }
}
</style>
