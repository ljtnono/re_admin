<template>
  <div class="write-article-page">
    <!-- 左侧栏：已发布文章 + 草稿箱 -->
    <aside class="draft-panel">
      <!-- 已发布文章 -->
      <div class="side-group" :class="{ 'side-group--collapsed': articleGroupCollapsed }">
        <div class="side-group__header" @click="articleGroupCollapsed = !articleGroupCollapsed">
          <div class="side-group__heading">
            <i class="side-group__arrow" :class="articleGroupCollapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"/>
            <span class="side-group__title">文章</span>
            <span class="side-group__count" v-if="articleList.length > 0">{{ articleList.length }}</span>
          </div>
        </div>
        <div class="side-group__list" v-show="!articleGroupCollapsed">
          <div
            v-for="(item, index) in articleList"
            :key="item.id"
            class="draft-item"
            :class="{ 'draft-item--active': editingType === 'article' && index === currentArticleIndex }"
            @click="editArticle(index)"
          >
            <div class="draft-item__icon">
              <i class="iconfont icon-icon-article"/>
            </div>
            <div class="draft-item__body">
              <p class="draft-item__title">{{ item.title || "未命名文章" }}</p>
              <p class="draft-item__meta">{{ item.modifyTime | dateFormat("yyyy-MM-DD") }}</p>
            </div>
          </div>
          <div class="draft-empty draft-empty--slim" v-if="articleList.length === 0">
            <p class="draft-empty__hint">暂无已发布文章</p>
          </div>
        </div>
      </div>
      <!-- 草稿箱 -->
      <div class="side-group" :class="{ 'side-group--collapsed': draftGroupCollapsed }">
        <div class="side-group__header">
          <div class="side-group__heading" @click="draftGroupCollapsed = !draftGroupCollapsed">
            <i class="side-group__arrow" :class="draftGroupCollapsed ? 'el-icon-arrow-right' : 'el-icon-arrow-down'"/>
            <span class="side-group__title">草稿箱</span>
            <span class="side-group__count" v-if="draftList.length > 0">{{ draftList.length }}</span>
          </div>
          <button class="draft-panel__new-btn" type="button" @click.stop="newArticle">
            <i class="iconfont icon-add"/>
            <span>新建</span>
          </button>
        </div>
        <div class="side-group__list" v-show="!draftGroupCollapsed">
          <div
            v-for="(item, index) in draftList"
            :key="item.draftId"
            class="draft-item"
            :class="{ 'draft-item--active': editingType === 'draft' && index === currentDraftIndex }"
            @click="editDraft(index)"
          >
            <div class="draft-item__icon">
              <i class="iconfont icon-icon-article"/>
            </div>
            <div class="draft-item__body">
              <p class="draft-item__title">{{ item.title || "未命名草稿" }}</p>
              <p class="draft-item__meta">{{ item.saveTime | dateFormat("yyyy-MM-DD") }}</p>
            </div>
            <el-dropdown
              v-if="editingType === 'draft' && currentDraftIndex === index"
              class="draft-item__actions"
              trigger="click"
              @command="handleDraftDropdownCommand"
            >
              <i class="el-icon-more" @click.stop/>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="delete">
                  <i class="el-icon-delete"/>删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="draft-empty" v-if="draftList.length === 0">
            <i class="draft-empty__icon iconfont icon-icon-article"/>
            <p class="draft-empty__text">草稿箱还是空的</p>
            <p class="draft-empty__hint">点击上方「新建」开始写作</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- 编辑区 -->
    <section class="editor-panel">
      <div class="editor-panel__topbar">
        <div class="editor-panel__doc">
          <span class="editor-panel__doc-label">{{ editingType === "article" ? "正在编辑文章" : "正在编辑草稿" }}</span>
          <span class="editor-panel__doc-title">{{ currentDraftTitle || "未命名文章" }}</span>
        </div>
        <div class="editor-panel__actions">
          <span class="save-status" :class="saveStatusClass">
            <span class="save-status__dot"/>
            {{ saveStatusStr }}
          </span>
          <span class="editor-panel__word-count" v-if="contentLength > 0">{{ contentLength }} 字</span>
          <el-button
            type="primary"
            size="small"
            class="editor-panel__publish-btn"
            @click="publishFormVisible = true"
          >
            {{ editingType === "article" ? "更新文章" : "发布文章" }}
          </el-button>
        </div>
      </div>
      <div class="editor-panel__editor">
        <mavon-editor
          ref="md"
          @imgAdd="imgAdd"
          :language="editorConfig.language"
          :font-size="editorConfig.fontSize"
          :scroll-style="editorConfig.scrollStyle"
          :box-shadow="false"
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
          style="width: 100%; height: 100%;"
        />
      </div>
    </section>

    <!-- 文章发布表单 -->
    <div class="publish-form-container">
      <el-dialog
        :title="publishDialogTitle"
        custom-class="publish-dialog"
        width="640px"
        @open="publishFormOpen"
        top="4vh"
        center
        :visible.sync="publishFormVisible">
        <template slot="footer">
          <span class="dialog-footer">
            <el-button @click="publishFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="commitPublishForm('publishForm')">{{ editingType === "article" ? "更 新" : "发 布" }}</el-button>
          </span>
        </template>
        <!-- 文章发布表单 -->
                <el-form ref="publishForm" :model="publishForm" label-width="100px" >
          <el-form-item label="文章标题：" prop="title" class="is-required">
            <el-input v-model="publishForm.title" clearable placeholder="请输入文章标题"/>
          </el-form-item>
          <el-form-item label="文章类型：" prop="categoryId" class="is-required">
            <el-select style="width: 100%" v-model="publishForm.categoryId" clearable filterable placeholder="请选择文章类型">
              <el-option
                v-for="category in categoryList"
                :key="category.id"
                :label="category.name"
                :value="category.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章标签：" prop="tagList">
            <el-select style="width: 100%"
                       v-model="publishForm.tagList"
                       multiple
                       filterable
                       clearable
                       allow-create
                       default-first-option
                       placeholder="请输入文章标签">
              <el-option
                v-for="tag in tagList"
                :key="tag.id"
                :label="tag.name"
                :value="tag.name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文章设定：" class="is-required">
            <el-radio-group v-model="publishForm.recommend" class="mr30">
              <el-radio :label="1">推荐</el-radio>
              <el-radio :label="0">不推荐</el-radio>
            </el-radio-group>
            <el-radio-group v-model="publishForm.top" class="mr30">
              <el-radio :label="1">置顶</el-radio>
              <el-radio :label="0">不置顶</el-radio>
            </el-radio-group>
            <el-radio-group v-model="publishForm.creationType">
              <el-radio :label="1">原创</el-radio>
              <el-radio :label="2">转载</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="文章简介：" prop="summary">
            <el-input type="textarea" v-model="publishForm.summary" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" show-word-limit placeholder="请输入文章简介，如果不填会根据文章内容自动生成"/>
          </el-form-item>
          <el-form-item label="文章引用：" prop="quoteInfo">
            <el-input type="textarea" v-model="publishForm.quoteInfo" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" show-word-limit placeholder="请输入文章引文信息"/>
          </el-form-item>
          <el-form-item label="文章封面：">
            <el-upload
              :action="articleCoverUploadUrl"
              :httpRequest="uploadArticleCover"
              :onSuccess="uploadArticleCoverSuccess"
              :onExceed="uploadArticleCoverExceed"
              :fileList="articleCoverFileList"
              accept="jpeg,png,gif"
              listType="picture-card"
              :limit="1"
              :multiple="false"
              auto-upload>
              <template v-slot:default>
                <i class="el-icon-plus"/>
              </template>
              <template v-slot:file="{file}">
                <div class="test" v-if="file.url">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" :alt="file.url"/>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="uploadArticleCoverPreview(file)">
                      <i class="el-icon-zoom-in"/>
                    </span>
                    <span class="el-upload-list__item-delete" @click="uploadArticleCoverRemove(file)">
                      <i class="el-icon-delete"/>
                    </span>
                  </span>
                </div>
              </template>
              <template v-slot:tip>
                <div class="el-upload__tip">图片的格式为jpeg/png/gif，大小不能超过2M</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 文章封面缩略图查看弹窗 -->
    <el-dialog :visible.sync="articleCoverUrlPreviewVisible">
      <img width="100%" :src="articleCoverUrl" :alt="articleCoverUrl">
    </el-dialog>
  </div>
</template>

<script>

import {EDITOR_CONFIG, ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import DateUtil from "@/util/dateUtil";
import {deleteDraft, findArticleDetail, findArticleList, findDraftDetail, findDraftList, publishArticle, saveOrUpdateDraft, updateArticle} from "@/api/article";
import articleUtil from "@/util/articleUtil";
import commonUtil from "@/util/commonUtil";
import {uploadFile} from "@/api/common";
import {mapState} from "vuex";
import {
  ARTICLE_COVER_SIZE_LIMIT,
  ARTICLE_CREATION_TYPE_VALUES,
  ARTICLE_CREATION_YC,
  ARTICLE_CREATION_ZZ,
  ARTICLE_NOT_RECOMMEND,
  ARTICLE_NOT_TOP,
  ARTICLE_RECOMMEND_VALUES,
  ARTICLE_TOP_VALUES,
  BASE_URL
} from "@/constant/commonConstant";
import {
  ARTICLE_PUBLISH_CATEGORY_EMPTY_ERROR,
  ARTICLE_PUBLISH_MARKDOWN_CONTENT_EMPTY_ERROR,
  ARTICLE_PUBLISH_NO_TRANSPORT_INFO_ERROR_MESSAGE,
  ARTICLE_PUBLISH_SUMMARY_FORMAT_ERROR,
  ARTICLE_PUBLISH_TAG_NAME_FORMAT_ERROR_MESSAGE,
  ARTICLE_PUBLISH_TITLE_EMPTY_ERROR,
  ARTICLE_PUBLISH_TITLE_FORMAT_ERROR,
  ILLEGAL_PARAM_ERROR
} from "@/constant/errorMessageConstant";
import {
  ARTICLE_PUBLISH_SUMMARY_REGEX,
  ARTICLE_PUBLISH_TAG_REGEX,
  ARTICLE_PUBLISH_TITLE_REGEX
} from "@/constant/regexConstant";
import {findTagList} from "@/api/tag";

export default {
  name: "WriteArticle",
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
      // 已发布文章列表
      articleList: [],
      // 当前编辑类型, article 已发布文章 draft 草稿
      editingType: "draft",
      // 当前文章id
      currentArticleId: null,
      // 当前文章在文章列表中的下标
      currentArticleIndex: 0,
      // 当前编辑文章的完整信息（更新时保留元数据）
      currentArticleDetail: null,
      // 文章分组折叠状态
      articleGroupCollapsed: false,
      // 草稿分组折叠状态
      draftGroupCollapsed: false,
      // 当前保存状态, 0 未保存 1 保存中 2 已保存
      saveStatus: 2,
      // 文章发布表单状态
      publishFormVisible: false,
      // markdown编辑器配置
      editorConfig: EDITOR_CONFIG,
      // 文章封面上传地址
      articleCoverUploadUrl: BASE_URL + "/api-backend/file/uploadFile",
      // 文章封面路径
      articleCoverUrl: null,
      // 文章封面缩略图可见状态
      articleCoverUrlPreviewVisible: false,
      // 文章封面上传文件列表
      articleCoverFileList: null,
      // 文章发布表单
      publishForm: {
        draftId: null,
        title: null,
        markdownContent: null,
        htmlContent: null,
        summary: null,
        categoryId: null,
        tagList: [],
        recommend: ARTICLE_NOT_RECOMMEND,
        top: ARTICLE_NOT_TOP,
        creationType: ARTICLE_CREATION_YC,
        coverUrl: null,
        transportInfo: null,
        quoteInfo: null
      }
    }
  },
  computed: {
    ...mapState({
      categoryList: state => state.common.categoryList,
      tagList: state => state.common.tagList
    }),
    saveStatusStr() {
      let saveStatus = this.saveStatus;
      if (saveStatus === 0) {
        return "未保存";
      } else if (saveStatus === 1) {
        return "保存中...";
      } else {
        return "已保存";
      }
    },
    // 保存状态样式类名
    saveStatusClass() {
      return {
        0: "save-status--unsaved",
        1: "save-status--saving",
        2: "save-status--saved"
      }[this.saveStatus] || "save-status--saved";
    },
    // 当前草稿字数
    contentLength() {
      return (this.currentDraftMarkdownContent || "").length;
    },
    // 发布弹窗标题
    publishDialogTitle() {
      return this.editingType === "article" ? "更新文章" : "发布文章";
    }
  },
  methods: {
    // 当发布文章表单打开时进行处理
    publishFormOpen() {
      let that = this;
      if (that.editingType === "article" && that.currentArticleDetail) {
        // 编辑已发布文章时，回显文章的元数据
        let detail = that.currentArticleDetail;
        that.publishForm = {
          title: detail.title,
          draftId: null,
          htmlContent: null,
          markdownContent: that.currentDraftMarkdownContent,
          summary: detail.summary,
          categoryId: detail.categoryId,
          tagList: detail.tagList || [],
          recommend: detail.recommend,
          top: detail.top,
          creationType: detail.creationType,
          coverUrl: detail.coverUrl,
          transportInfo: detail.transportInfo,
          quoteInfo: detail.quoteInfo
        }
      } else {
        that.publishForm = {
          title: that.currentDraftTitle,
          draftId: that.currentDraftId,
          htmlContent: null,
          markdownContent: that.currentDraftMarkdownContent,
          summary: that.title,
          categoryId: null,
          tagList: [],
          recommend: ARTICLE_NOT_RECOMMEND,
          top: ARTICLE_NOT_TOP,
          creationType: ARTICLE_CREATION_YC,
          coverUrl: null,
          transportInfo: null,
          quoteInfo: null
        }
      }
    },
    // 上传文章封面图片
    async uploadArticleCover(request) {
      let size = request.file.size;
      // 不能超过2M
      if (ARTICLE_COVER_SIZE_LIMIT < size) {
        return false;
      }
      let result;
      let data = new FormData();
      data.append("file", request.file);
      this.articleCoverUrl = request.url;
      await uploadFile(data).then(res => {
        result = res.data.data;
      });
      return result;
    },
    // 上传文章封面图片成功回调函数
    uploadArticleCoverSuccess(response, file, fileList) {
      if (response) {
        this.articleCoverUrl = response;
        this.publishForm.coverUrl = response;
        this.$message({
          message: "上传成功",
          type: "success",
          duration: 2000,
          center: false
        });
      }
    },
    // 上传文章封面移除图片
    uploadArticleCoverRemove(file) {
      file.url = null;
      this.articleCoverUrl = null;
      this.articleCoverUrlPreviewVisible = false;
      this.articleCoverFileList = [];
      this.publishForm.coverUrl = null;
    },
    // 上传文章封面查看缩略图
    uploadArticleCoverPreview(file) {
      this.articleCoverUrlPreviewVisible = true;
    },
    // 上传文件多个报错
    uploadArticleCoverExceed() {
      this.$message({
        message: "只允许上传一个封面",
        type: "error",
        duration: 2000,
        center: false
      });
    },
    // 校验文章发布表单
    validatePublishForm() {
      let that = this;
      let form = that.publishForm;
      let title = form.title;
      let markdownContent = form.markdownContent;
      let summary = form.summary;
      let categoryId = form.categoryId;
      let recommend = form.recommend;
      let creationType = form.creationType;
      let top = form.top;
      let transportInfo = form.transportInfo;
      let tagList = form.tagList;
      // 空值校验
      // 标题不能为空
      if (title === null || title === "") {
        this.$message({
          message: ARTICLE_PUBLISH_TITLE_EMPTY_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      // 文章内容不能为空
      if (markdownContent === null || markdownContent === "") {
        this.$message({
          message: ARTICLE_PUBLISH_MARKDOWN_CONTENT_EMPTY_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      // 文章分类不能为null 或者小于0
      if (categoryId === null || categoryId < 0) {
        this.$message({
          message: ARTICLE_PUBLISH_CATEGORY_EMPTY_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      if (!recommend) {
        // 默认不推荐
        recommend = ARTICLE_NOT_RECOMMEND;
        form.recommend = ARTICLE_NOT_RECOMMEND;
      }
      if (!creationType) {
        // 默认原创
        creationType = ARTICLE_CREATION_YC;
        form.creationType = ARTICLE_CREATION_YC;
      }
      if (!top) {
        top = ARTICLE_NOT_TOP;
        form.top = ARTICLE_NOT_TOP;
      }
      // 校验规则校验
      // 标题不能超过100个字符
      if (!ARTICLE_PUBLISH_TITLE_REGEX.test(title)) {
        this.$message({
          message: ARTICLE_PUBLISH_TITLE_FORMAT_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      // 简介不能超过200个字符
      if (!ARTICLE_PUBLISH_SUMMARY_REGEX.test(summary)) {
        this.$message({
          message: ARTICLE_PUBLISH_SUMMARY_FORMAT_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      // 校验推荐值是否存在
      if (!ARTICLE_RECOMMEND_VALUES.includes(recommend)) {
        this.$message({
          message: ILLEGAL_PARAM_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      // 校验创作类型值是否存在
      if (!ARTICLE_CREATION_TYPE_VALUES.includes(creationType)) {
        this.$message({
          message: ILLEGAL_PARAM_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      // 校验置顶值是否存在
      if (!ARTICLE_TOP_VALUES.includes(top)) {
        this.$message({
          message: ILLEGAL_PARAM_ERROR,
          type: "error",
          duration: 2000,
          center: false
        });
        return false;
      }
      // 当文章是转载类型时，必须有转载说明
      if (ARTICLE_CREATION_ZZ === creationType) {
        if (transportInfo === null || transportInfo === "") {
          this.$message({
            message: ARTICLE_PUBLISH_NO_TRANSPORT_INFO_ERROR_MESSAGE,
            type: "error",
            duration: 2000,
            center: false
          });
          return false;
        }
      }
      if (tagList !== [] && tagList !== null && tagList.length > 0) {
        let flag = true;
        for (let tag of tagList) {
          if (!ARTICLE_PUBLISH_TAG_REGEX.test(tag)) {
            this.$message({
              message: ARTICLE_PUBLISH_TAG_NAME_FORMAT_ERROR_MESSAGE,
              type: "error",
              duration: 2000,
              center: false
            });
            flag = false;
          }
        }
        if (!flag) {
          return false;
        }
      }
      return true;
    },
    // 提交发布文章表单
    commitPublishForm(formName) {
      let that = this;
      let form = that.publishForm;
      form.htmlContent = this.$refs.md.d_render;
      if (!that.validatePublishForm()) {
        return;
      }
      // 编辑已发布文章：走更新接口
      if (that.editingType === "article") {
        that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
        updateArticle({...form, articleId: that.currentArticleId}).then(async res => {
          that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
          this.$message({
            type: "success",
            message: "更新成功",
            duration: 2000,
            center: false,
          });
          that.publishFormVisible = false;
          // 刷新文章列表与当前文章详情
          await that.refreshArticleList();
          await findArticleDetail(that.currentArticleId).then(r => {
            that.currentArticleDetail = r.data.data;
            that.currentDraftTitle = r.data.data.title;
          });
        }).catch(e => {
          that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
        });
        return;
      }
      that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
      publishArticle({...form}).then(async res => {
        that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
        this.$message({
          type: "success",
          message: "发布成功",
          duration: 2000,
          center: false,
        });
        that.publishFormVisible = false;
        // 再请求一次列表
        await that.refreshDraftList();
        // 再请求一次文章列表
        await that.refreshArticleList();
        // 再获取一次标签列表
        await findTagList().then(res => {
          that.$store.commit("common/changeTagList", res.data.data);
        });
      }).catch(e => {
        that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
      });
    },
    // 刷新草稿列表并显示第index草稿的内容
    async refreshDraftList(showIndex) {
      let that = this;
      await findDraftList().then(async res => {
        that.draftList = res.data.data || [];
        if (that.draftList.length === 0) {
          // 草稿箱为空时重置当前编辑状态
          that.currentDraftId = null;
          that.currentDraftTitle = null;
          that.currentDraftMarkdownContent = "";
          that.currentDraftIndex = 0;
          that.saveStatus = 2;
          return;
        }
        if (!showIndex) {
          showIndex = 0;
        }
        let showDraftId = that.draftList[showIndex].draftId;
        // 获取当前数据
        await findDraftDetail(showDraftId).then(r => {
          let draft = r.data.data;
          that.editingType = "draft";
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
    // 刷新已发布文章列表
    async refreshArticleList() {
      let that = this;
      await findArticleList({
        searchCondition: null,
        category: null,
        recommend: null,
        top: null,
        orderFieldList: null,
        orderFlagList: null,
        pageNum: 1,
        pageSize: 100
      }).then(res => {
        that.articleList = (res.data.data && res.data.data.records) || [];
      });
    },
    // 编辑某篇已发布文章
    editArticle: commonUtil.throttle(async function (index) {
      let that = this;
      if (that.editingType === "article" && that.currentArticleIndex === index) {
        return;
      }
      let articleId = that.articleList[index].id;
      try {
        // 先保存当前未保存的内容
        await that.saveCurrentContent();
        await findArticleDetail(articleId).then(r => {
          let detail = r.data.data;
          that.editingType = "article";
          that.currentArticleId = detail.id;
          that.currentArticleIndex = index;
          that.currentArticleDetail = detail;
          that.currentDraftMarkdownContent = detail.markdownContent;
          that.currentDraftTitle = detail.title;
          that.saveStatus = 2;
        });
        that.saveStatus = 2;
      } catch (e) {
        // 加载失败时保持当前编辑状态，错误消息已由响应拦截器弹出
        console.error("加载文章详情失败", e);
      }
    }, 200),
    // 保存当前未保存的内容（根据当前编辑类型走不同接口）
    async saveCurrentContent() {
      let that = this;
      if (that.saveStatus !== 0) {
        return;
      }
      let markdownContent = that.currentDraftMarkdownContent;
      let title = articleUtil.getTitleFromMarkdownContent(markdownContent) || DateUtil.getNowDate("yyyy-MM-DD");
      if (that.editingType === "article") {
        // 更新文章正文，元数据沿用当前文章信息
        await updateArticle({
          ...that.currentArticleDetail,
          articleId: that.currentArticleId,
          title: title,
          markdownContent: markdownContent,
          htmlContent: that.$refs.md ? that.$refs.md.d_render : (that.currentArticleDetail.htmlContent || null)
        });
        await that.refreshArticleList();
      } else {
        await saveOrUpdateDraft(that.currentDraftId, title, markdownContent);
      }
      that.saveStatus = 2;
    },
    // 编辑某个草稿
    editDraft: commonUtil.throttle(async function (index) {
      let that = this;
      let showDraftId = that.draftList[index].draftId;
      if (that.editingType !== "draft" || that.currentDraftIndex !== index) {
        try {
          // 先保存当前的内容（可能是文章或另一篇草稿）
          await that.saveCurrentContent();
          await findDraftDetail(showDraftId).then(r => {
            let draft = r.data.data;
            that.editingType = "draft";
            that.currentDraftIndex = index;
            that.currentDraftMarkdownContent = draft.markdownContent;
            that.currentDraftTitle = draft.title;
            that.currentDraftId = draft.draftId;
            that.saveStatus = 2;
          });
          that.saveStatus = 2;
        } catch (e) {
          // 加载失败时保持当前编辑状态，错误消息已由响应拦截器弹出
          console.error("加载草稿详情失败", e);
        }
      }
    }, 200),
    // 监听markdown内容改变事件
    editorChange(value) {
      let that = this;
      // 只监听当前草稿的改动
      that.currentDraftMarkdownContent = value;
      that.currentDraftTitle = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("yyyy-MM-DD");
      that.saveStatus = 0;
    },
    // 保存草稿或文章
    editorSave: commonUtil.throttle(async function (value) {
      let that = this;
      that.saveStatus = 1;
      let title = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("yyyy-MM-DD");
      if (that.editingType === "article") {
        // 更新已发布文章
        await updateArticle({
          ...that.currentArticleDetail,
          articleId: that.currentArticleId,
          title: title,
          markdownContent: value,
          htmlContent: that.$refs.md ? that.$refs.md.d_render : (that.currentArticleDetail.htmlContent || null)
        });
        await that.refreshArticleList();
      } else {
        // 保存或更新草稿
        await saveOrUpdateDraft(that.currentDraftId, title, value);
        // 重新获取草稿列表
        await that.refreshDraftList();
      }
      that.saveStatus = 2;
    }, 200),
    // 新建文章
    newArticle: commonUtil.throttle(async function () {
      let that = this;
      let now = DateUtil.getNowDate("yyyy-MM-DD");
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
        try {
          await that.$confirm("删除后无法恢复，确定删除该草稿吗？", "删除草稿", {
            confirmButtonText: "删除",
            cancelButtonText: "取消",
            type: "warning"
          });
        } catch (e) {
          return;
        }
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
        // 第二步.将返回的url替换到文本原位置
        let url = res.data.data;
        vm.$img2Url(pos, url);
      });
    }
  },
  async mounted() {
    let that = this;
    // 获取草稿列表和已发布文章列表
    that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
    await Promise.all([
      that.refreshDraftList(),
      that.refreshArticleList()
    ]).catch(e => {
      that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
    });
    that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();

    // 从文章管理列表跳转过来时，直接定位并加载对应文章
    let targetArticleId = that.$route.query.articleId;
    if (targetArticleId) {
      try {
        await findArticleDetail(targetArticleId).then(r => {
          let detail = r.data.data;
          that.editingType = "article";
          that.currentArticleId = detail.id;
          that.currentArticleIndex = that.articleList.findIndex(a => a.id === detail.id);
          that.currentArticleDetail = detail;
          that.currentDraftMarkdownContent = detail.markdownContent;
          that.currentDraftTitle = detail.title;
          that.saveStatus = 2;
        });
      } catch (e) {
        // 加载失败时保持默认草稿编辑状态，错误消息已由响应拦截器弹出
        console.error("加载文章详情失败", e);
      }
    }
  },
  async beforeDestroy() {
    let that = this;
    // 页面销毁之前保存当前内容
    if (that.saveStatus === 0) {
      that.saveStatus = 1;
      await that.saveCurrentContent();
      that.saveStatus = 2;
    }
  },
  async beforeRouteLeave(to, from, next) {
    let that = this;
    // 跳转之前保存当前内容
    if (that.saveStatus === 0) {
      that.saveStatus = 1;
      await that.saveCurrentContent();
      that.saveStatus = 2;
    }
    next();
  }
}
</script>

<style lang="scss" scoped>
// ========== 设计变量 ==========
$primary: #409eff;
$primary-light: #ecf5ff;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$text-placeholder: #c0c4cc;
$border-color: #ebeef5;
$border-light: #f2f6fc;
$panel-bg: #ffffff;
$page-bg: #f1f1f1;

.write-article-page {
  display: flex;
  gap: 16px;
  height: calc(100vh - 60px);
  padding: 16px 20px;
  background: $page-bg;
  box-sizing: border-box;
  overflow: hidden;
}

// ========== 草稿箱 ==========
.draft-panel {
  display: flex;
  flex-direction: column;
  width: 280px;
  flex-shrink: 0;
  background: $panel-bg;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  min-height: 0;

  &__new-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 30px;
    padding: 0 12px;
    font-size: 13px;
    color: $primary;
    background: $primary-light;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    i {
      font-size: 14px;
    }

    &:hover {
      background: darken($primary-light, 4%);
      color: darken($primary, 8%);
    }

    &:active {
      transform: scale(0.96);
    }
  }

}

// ========== 侧栏分组（已发布文章 / 草稿箱） ==========
.side-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  &--collapsed {
    flex: 0 0 auto;
  }

  & + & {
    border-top: 1px solid $border-light;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 8px 12px 16px;
    flex-shrink: 0;

    &:hover {
      background: #f7f8fa;
    }
  }

  &__heading {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
  }

  &__arrow {
    font-size: 12px;
    color: $text-secondary;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
  }

  &__count {
    min-width: 20px;
    height: 20px;
    line-height: 20px;
    padding: 0 6px;
    text-align: center;
    font-size: 12px;
    color: $primary;
    background: $primary-light;
    border-radius: 10px;
    box-sizing: border-box;
  }

  &__list {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 4px 8px 8px;
  }
}

.draft-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;

  & + & {
    margin-top: 2px;
  }

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 0;
    background: $primary;
    border-radius: 0 3px 3px 0;
    transition: height 0.2s ease;
  }

  &:hover {
    background: #f7f8fa;
  }

  &--active {
    background: $primary-light;

    &::before {
      height: 24px;
    }

    .draft-item__icon {
      background: #d9ecff;

      i {
        color: $primary;
      }
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    background: #f7f9fc;
    border-radius: 6px;
    transition: background 0.15s ease;

    i {
      font-size: 20px;
      color: #c1b075;
      transition: color 0.15s ease;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 13px;
    color: $text-regular;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__meta {
    margin: 3px 0 0;
    font-size: 12px;
    color: $text-placeholder;
  }

  &__actions {
    flex-shrink: 0;
    padding: 4px;
    color: $text-secondary;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      color: $text-primary;
      background: rgba(0, 0, 0, 0.06);
    }
  }
}

.draft-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;

  &--slim {
    padding: 24px 0;
  }

  &__icon {
    font-size: 42px;
    color: #dcdfe6;
  }

  &__text {
    margin: 12px 0 0;
    font-size: 14px;
    color: $text-secondary;
  }

  &__hint {
    margin: 6px 0 0;
    font-size: 12px;
    color: $text-placeholder;
  }
}

// ========== 编辑区 ==========
.editor-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  background: $panel-bg;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  &__topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 52px;
    padding: 0 16px;
    border-bottom: 1px solid $border-light;
    flex-shrink: 0;
  }

  &__doc {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
  }

  &__doc-label {
    flex-shrink: 0;
    font-size: 12px;
    color: $text-placeholder;
  }

  &__doc-title {
    font-size: 14px;
    font-weight: 600;
    color: $text-primary;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-shrink: 0;
  }

  &__word-count {
    font-size: 12px;
    color: $text-placeholder;
  }

  &__publish-btn {
    font-weight: 500;
  }

  &__editor {
    flex: 1;
    min-height: 0;
  }
}

// ========== 保存状态 ==========
.save-status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text-secondary;

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  &--unsaved .save-status__dot {
    background: #e6a23c;
  }

  &--saving .save-status__dot {
    background: $primary;
    animation: save-breath 1s ease-in-out infinite;
  }

  &--saved .save-status__dot {
    background: #67c23a;
  }
}

@keyframes save-breath {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

// ========== mavon-editor 深度定制 ==========
::v-deep .v-note-wrapper {
  box-shadow: none !important;

  .v-note-op {
    background: #fafbfc;
    border-bottom: 1px solid $border-light;
    box-shadow: none;
  }

  .v-note-op .op-icon {
    color: #5a5e66;
    border-radius: 4px;
    margin: 6px 1px;

    &:hover {
      color: $primary;
      background: #e8f3ff;
    }

    &.selected {
      color: $primary;
      background: #e8f3ff;
    }
  }

  .v-note-op .op-icon-divider {
    border-right: 1px solid $border-color;
  }

  .content-input-wrapper {
    background: #ffffff;
  }

  .auto-textarea-input {
    background: #ffffff;
  }
}

// ========== 发布弹窗 ==========
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

::v-deep .publish-dialog {
  border-radius: 10px;
  overflow: hidden;

  .el-dialog__header {
    border-bottom: 1px solid $border-light;
    padding: 18px 20px;
  }

  .el-dialog__title {
    font-size: 16px;
    font-weight: 600;
    color: $text-primary;
  }

  .el-dialog__body {
    padding: 24px 28px 8px;
  }

  .el-dialog__footer {
    border-top: 1px solid $border-light;
    padding: 14px 20px;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .el-form-item__label {
    color: $text-regular;
  }
}
</style>
