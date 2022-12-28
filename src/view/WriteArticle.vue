<template>
  <div class="write-article-container p20 flex flex1 flex-direction-row">
    <!-- 草稿箱列表 -->
    <div class="draft-container flex flex-direction-column mr5">
      <!-- 新建文章按钮 -->
      <div @click="newArticle" class="new-btn-container flex flex-direction-row flex-justify-content-space-between">
        <a href="javascript:;">
          <i class="iconfont icon-add"/>
          新建文章
        </a>
      </div>
      <!-- 草稿葙列表 -->
      <div class="draft-list-container flex flex1 flex-direction-column">
        <div v-if="draftList.length === 0">
          草稿箱为空
        </div>
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
        :value="markdownContent"
        @change="editorChange"
        @save="editorSave"
        style="width: 100%; height: 850px">
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

import { EDITOR_CONFIG } from "../config/commonConfig";
import DateUtil from "@/util/dateUtil";
import PublishArticleForm from "@c/PublishArticleForm.vue";
import {deleteDraft, getDraftList, saveOrUpdateDraft} from "../api/article";
import articleUtil from "@/util/articleUtil";
import commonUtil from "@/util/commonUtil";

export default {
  name: "WriteArticle",
  components: { PublishArticleForm },
  data() {
    return {
      // 文章标题
      title: null,
      // 文章内容
      markdownContent: null,
      // showDrawer: false,
      editorConfig: EDITOR_CONFIG,
      draftList: [],
      currentDraftIndex: 0,
      saveStatus: 2,
      showPublishForm: false
    }
  },
  computed: {
    commonUtil() {
      return commonUtil
    },
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
      getDraftList().then(res => {
        that.draftList = res.data.data;
        if (!showIndex) {
          showIndex = 0;
        }
        let draft = that.draftList[showIndex];
        that.currentDraftIndex = showIndex;
        that.markdownContent = draft.markdownContent;
        that.title = draft.title;
        that.saveStatus = 2;
      });
    },
    // 编辑某个草稿
    editDraft(index) {
      let that = this;
      if (index !== that.currentDraftIndex) {
        that.currentDraftIndex = index;
        that.markdownContent = that.draftList[index].markdownContent;
        that.title = that.draftList[index].title;
      }
    },
    // 监听markdown内容改变事件
    editorChange: commonUtil.throttle(function (value) {
      let that = this;
      that.markdownContent = value;
      that.title = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("yyyy-MM-D");
    }, 1000),
    // 保存草稿
    editorSave: commonUtil.throttle(async function (value) {
      let that = this;
      this.saveStatus = 1;
      // 保存或更新草稿
      await saveOrUpdateDraft(that.draftList[that.currentDraftIndex].draftId, that.title, value);
      // 重新获取草稿列表
      await that.refreshDraftList();
      this.saveStatus = 2;
    }, 1000),
    // 新建文章
    newArticle: commonUtil.throttle(async function() {
      let that = this;
      let now = DateUtil.getNowDate("yyyy-MM-D");
      let markdownContent = "# " + now;
      let title = articleUtil.getTitleFromMarkdownContent(markdownContent) || now;
      this.saveStatus = 1;
      await saveOrUpdateDraft(null, title, markdownContent);
      this.saveStatus = 2;
      // 再请求一次列表
      await that.refreshDraftList();
    }, 1000),
    // 处理草稿下拉列表
    async handleDraftDropdownCommand(command) {
      let that = this;
      if (command === "delete") {
        let draftId = that.draftList[that.currentDraftIndex].draftId;
        // 删除该行
        await deleteDraft(draftId).then(() => {
          // 弹出删除成功的弹窗
          that.$message.success("删除成功");
        });
        // 重新请求草稿列表
        await that.refreshDraftList();
      }
    }
  },
  async mounted() {
    let that = this;
    // 获取草稿列表
    await that.refreshDraftList();
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
