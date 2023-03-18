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
          <span class="flex draft-date">{{ item.saveTime | dateFormat('yyyy-MM-DD') }}</span>
          <el-dropdown class="flex" v-if="currentDraftIndex === index" @command="handleDraftDropdownCommand"
                       trigger="click">
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
          <span style="cursor: pointer" @click="publishFormVisible = true">发布文章</span>
        </template>
      </mavon-editor>
    </div>
    <!-- 文章发布表单 -->
    <div class="publish-form-container">
      <el-dialog
        title="发布文章"
        @open="publishFormOpen"
        top="4vh"
        center
        :visible.sync="publishFormVisible">
        <template slot="footer">
          <span class="dialog-footer">
            <el-button @click="publishFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="commitPublishForm('publishForm')">发 布</el-button>
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
import {deleteDraft, findDraftDetail, findDraftList, publishArticle, saveOrUpdateDraft} from "@/api/article";
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
    }
  },
  methods: {
    // 当发布文章表单打开时进行处理
    publishFormOpen() {
      let that = this;
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
      if (that.validatePublishForm()) {
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
          // 再获取一次标签列表
          await findTagList().then(res => {
            that.$store.commit("common/changeTagList", res.data.data);
          });
        }).catch(e => {
          that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
        });
      }
    },
    // 刷新草稿列表并显示第index草稿的内容
    async refreshDraftList(showIndex) {
      let that = this;
      await findDraftList().then(async res => {
        that.draftList = res.data.data;
        if (!showIndex) {
          showIndex = 0;
        }
        let showDraftId = that.draftList[showIndex].draftId;
        // 获取当前数据
        await findDraftDetail(showDraftId).then(r => {
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
        if (that.saveStatus === 0) {
          let currentDraftMarkdownContent = that.currentDraftMarkdownContent;
          let currentDraftTitle = articleUtil.getTitleFromMarkdownContent(currentDraftMarkdownContent) || DateUtil.getNowDate("yyyy-MM-DD");
          let currentDraftId = that.currentDraftId;
          await saveOrUpdateDraft(currentDraftId, currentDraftTitle, currentDraftMarkdownContent);
        }
        await findDraftDetail(showDraftId).then(r => {
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
      that.currentDraftTitle = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("yyyy-MM-DD");
      that.saveStatus = 0;
    },
    // 保存草稿
    editorSave: commonUtil.throttle(async function (value) {
      let that = this;
      that.saveStatus = 1;
      // 保存或更新草稿
      let draftTitle = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("yyyy-MM-DD");
      await saveOrUpdateDraft(that.currentDraftId, draftTitle, value);
      // 重新获取草稿列表
      await that.refreshDraftList();
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
    // 获取草稿列表
    that.$loading(ELEMENT_PAGE_LOADING_CONFIG);
    await that.refreshDraftList().catch(e => {
      that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
    });
    that.$loading(ELEMENT_PAGE_LOADING_CONFIG).close();
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

  .publish-form-container {

  }
}
</style>
