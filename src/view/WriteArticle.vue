<template>
  <div class="write-article-page">
    <!-- 左侧栏：已发布文章 + 草稿箱 -->
    <aside class="draft-panel">
      <!-- 已发布文章 -->
      <div class="side-group" :class="{ 'side-group--collapsed': articleGroupCollapsed }">
        <div class="side-group__header" @click="articleGroupCollapsed = !articleGroupCollapsed">
          <div class="side-group__heading">
            <el-icon class="side-group__arrow">
              <ArrowRight v-if="articleGroupCollapsed"/>
              <ArrowDown v-else/>
            </el-icon>
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
              <p class="draft-item__meta">{{ dateFormat(item.modifyTime, "YYYY-MM-DD") }}</p>
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
            <el-icon class="side-group__arrow">
              <ArrowRight v-if="draftGroupCollapsed"/>
              <ArrowDown v-else/>
            </el-icon>
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
              <p class="draft-item__meta">{{ dateFormat(item.saveTime, "YYYY-MM-DD") }}</p>
            </div>
            <el-dropdown
              v-if="editingType === 'draft' && currentDraftIndex === index"
              class="draft-item__actions"
              trigger="click"
              @command="handleDraftDropdownCommand"
            >
              <el-icon @click.stop><More/></el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">
                    <el-icon><Delete/></el-icon>删除
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
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
        <MdEditor
          v-model="currentDraftMarkdownContent"
          :preview-only="previewMode"
          :placeholder="EDITOR_PLACEHOLDER"
          style="width: 100%; height: 100%;"
          @on-change="editorChange"
          @on-save="editorSave"
          @on-html-changed="onHtmlChanged"
          @on-upload-img="onUploadImg"
        />
      </div>
    </section>

    <!-- 文章发布表单 -->
    <div class="publish-form-container">
      <el-dialog
        v-model="publishFormVisible"
        :title="publishDialogTitle"
        class="publish-dialog"
        width="640px"
        top="4vh"
        center
        @open="publishFormOpen">
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="publishFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="commitPublishForm">{{ editingType === "article" ? "更 新" : "发 布" }}</el-button>
          </span>
        </template>
        <!-- 文章发布表单 -->
        <el-form ref="publishFormRef" :model="publishForm" label-width="100px">
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
              <el-radio :value="1">推荐</el-radio>
              <el-radio :value="0">不推荐</el-radio>
            </el-radio-group>
            <el-radio-group v-model="publishForm.top" class="mr30">
              <el-radio :value="1">置顶</el-radio>
              <el-radio :value="0">不置顶</el-radio>
            </el-radio-group>
            <el-radio-group v-model="publishForm.creationType">
              <el-radio :value="1">原创</el-radio>
              <el-radio :value="2">转载</el-radio>
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
              :http-request="uploadArticleCover"
              :on-success="uploadArticleCoverSuccess"
              :on-exceed="uploadArticleCoverExceed"
              :file-list="articleCoverFileList"
              accept="image/jpeg,image/png,image/gif"
              list-type="picture-card"
              :limit="1"
              :multiple="false">
              <el-icon><Plus/></el-icon>
              <template #file="{ file }">
                <div class="test" v-if="file.url">
                  <img class="el-upload-list__item-thumbnail" :src="file.url" :alt="file.url"/>
                  <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="uploadArticleCoverPreview(file)">
                      <el-icon><ZoomIn/></el-icon>
                    </span>
                    <span class="el-upload-list__item-delete" @click="uploadArticleCoverRemove(file)">
                      <el-icon><Delete/></el-icon>
                    </span>
                  </span>
                </div>
              </template>
              <template #tip>
                <div class="el-upload__tip">图片的格式为jpeg/png/gif，大小不能超过2M</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!-- 文章封面缩略图查看弹窗 -->
    <el-dialog v-model="articleCoverUrlPreviewVisible">
      <img width="100%" :src="articleCoverUrl" :alt="articleCoverUrl">
    </el-dialog>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {ElLoading, ElMessage, ElMessageBox} from "element-plus";
import {ArrowDown, ArrowRight, Delete, More, Plus, ZoomIn} from "@element-plus/icons-vue";
import {MdEditor} from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import {ELEMENT_PAGE_LOADING_CONFIG} from "@/config/commonConfig";
import DateUtil from "@/util/dateUtil";
import {deleteDraft, findArticleDetail, findArticleList, findDraftDetail, findDraftList, publishArticle, saveOrUpdateDraft, updateArticle} from "@/api/article";
import articleUtil from "@/util/articleUtil";
import commonUtil from "@/util/commonUtil";
import {uploadFile} from "@/api/common";
import {useCommonStore} from "@/store/common";
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

// markdown编辑器空内容提示文本
const EDITOR_PLACEHOLDER = "还没有内容哦！快来写点什么吧...";

const route = useRoute();
const commonStore = useCommonStore();

const categoryList = computed(() => commonStore.categoryList);
const tagList = computed(() => commonStore.tagList);

// 当前草稿id
const currentDraftId = ref(null);
// 当前草稿标题
const currentDraftTitle = ref(null);
// 当前草稿内容
const currentDraftMarkdownContent = ref("");
// 当前草稿渲染后的html内容（由编辑器onHtmlChanged回调维护）
const currentHtmlContent = ref(null);
// 草稿列表
const draftList = ref([]);
// 当前显示的草稿列表下标
const currentDraftIndex = ref(0);
// 已发布文章列表
const articleList = ref([]);
// 当前编辑类型, article 已发布文章 draft 草稿
const editingType = ref("draft");
// 当前文章id
const currentArticleId = ref(null);
// 当前文章在文章列表中的下标
const currentArticleIndex = ref(0);
// 当前编辑文章的完整信息（更新时保留元数据）
const currentArticleDetail = ref(null);
// 文章分组折叠状态
const articleGroupCollapsed = ref(false);
// 草稿分组折叠状态
const draftGroupCollapsed = ref(false);
// 当前保存状态, 0 未保存 1 保存中 2 已保存
const saveStatus = ref(2);
// 文章发布表单状态
const publishFormVisible = ref(false);
// 是否预览模式（从文章管理点击标题进入时为纯预览，不可编辑）
const previewMode = ref(route.query.preview === "1");
// 文章封面上传地址
const articleCoverUploadUrl = BASE_URL + "/api-backend/file/uploadFile";
// 文章封面路径
const articleCoverUrl = ref(null);
// 文章封面缩略图可见状态
const articleCoverUrlPreviewVisible = ref(false);
// 文章封面上传文件列表
const articleCoverFileList = ref([]);
// 文章发布表单
const publishForm = ref({
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
});

const saveStatusStr = computed(() => {
  if (saveStatus.value === 0) {
    return "未保存";
  } else if (saveStatus.value === 1) {
    return "保存中...";
  } else {
    return "已保存";
  }
});

// 保存状态样式类名
const saveStatusClass = computed(() => {
  return {
    0: "save-status--unsaved",
    1: "save-status--saving",
    2: "save-status--saved"
  }[saveStatus.value] || "save-status--saved";
});

// 当前草稿字数
const contentLength = computed(() => (currentDraftMarkdownContent.value || "").length);

// 发布弹窗标题
const publishDialogTitle = computed(() => editingType.value === "article" ? "更新文章" : "发布文章");

// 页面级loading实例
let pageLoadingInstance = null;
const openPageLoading = () => {
  pageLoadingInstance = ElLoading.service(ELEMENT_PAGE_LOADING_CONFIG);
};
const closePageLoading = () => {
  if (pageLoadingInstance) {
    pageLoadingInstance.close();
    pageLoadingInstance = null;
  }
};

// 时间格式化（替代vue2过滤器）
const dateFormat = (date, style) => (date ? DateUtil.format(date, style) : "");

// 当发布文章表单打开时进行处理
function publishFormOpen() {
  if (editingType.value === "article" && currentArticleDetail.value) {
    // 编辑已发布文章时，回显文章的元数据
    const detail = currentArticleDetail.value;
    publishForm.value = {
      title: detail.title,
      draftId: null,
      htmlContent: null,
      markdownContent: currentDraftMarkdownContent.value,
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
    publishForm.value = {
      title: currentDraftTitle.value,
      draftId: currentDraftId.value,
      htmlContent: null,
      markdownContent: currentDraftMarkdownContent.value,
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
}

// 上传文章封面图片
async function uploadArticleCover(request) {
  const size = request.file.size;
  // 不能超过2M
  if (ARTICLE_COVER_SIZE_LIMIT < size) {
    return false;
  }
  const data = new FormData();
  data.append("file", request.file);
  let result;
  await uploadFile(data).then(res => {
    result = res.data.data;
  });
  return result;
}

// 上传文章封面图片成功回调函数
function uploadArticleCoverSuccess(response) {
  if (response) {
    articleCoverUrl.value = response;
    publishForm.value.coverUrl = response;
    ElMessage({
      message: "上传成功",
      type: "success",
      duration: 2000,
      center: false
    });
  }
}

// 上传文章封面移除图片
function uploadArticleCoverRemove(file) {
  file.url = null;
  articleCoverUrl.value = null;
  articleCoverUrlPreviewVisible.value = false;
  articleCoverFileList.value = [];
  publishForm.value.coverUrl = null;
}

// 上传文章封面查看缩略图
function uploadArticleCoverPreview() {
  articleCoverUrlPreviewVisible.value = true;
}

// 上传文件多个报错
function uploadArticleCoverExceed() {
  ElMessage({
    message: "只允许上传一个封面",
    type: "error",
    duration: 2000,
    center: false
  });
}

// 校验文章发布表单
function validatePublishForm() {
  const form = publishForm.value;
  const title = form.title;
  const markdownContent = form.markdownContent;
  const summary = form.summary;
  const categoryId = form.categoryId;
  let recommend = form.recommend;
  let creationType = form.creationType;
  let top = form.top;
  const transportInfo = form.transportInfo;
  const tagList = form.tagList;
  // 空值校验
  // 标题不能为空
  if (title === null || title === "") {
    ElMessage({
      message: ARTICLE_PUBLISH_TITLE_EMPTY_ERROR,
      type: "error",
      duration: 2000,
      center: false
    });
    return false;
  }
  // 文章内容不能为空
  if (markdownContent === null || markdownContent === "") {
    ElMessage({
      message: ARTICLE_PUBLISH_MARKDOWN_CONTENT_EMPTY_ERROR,
      type: "error",
      duration: 2000,
      center: false
    });
    return false;
  }
  // 文章分类不能为null 或者小于0
  if (categoryId === null || categoryId < 0) {
    ElMessage({
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
    ElMessage({
      message: ARTICLE_PUBLISH_TITLE_FORMAT_ERROR,
      type: "error",
      duration: 2000,
      center: false
    });
    return false;
  }
  // 简介不能超过200个字符
  if (!ARTICLE_PUBLISH_SUMMARY_REGEX.test(summary)) {
    ElMessage({
      message: ARTICLE_PUBLISH_SUMMARY_FORMAT_ERROR,
      type: "error",
      duration: 2000,
      center: false
    });
    return false;
  }
  // 校验推荐值是否存在
  if (!ARTICLE_RECOMMEND_VALUES.includes(recommend)) {
    ElMessage({
      message: ILLEGAL_PARAM_ERROR,
      type: "error",
      duration: 2000,
      center: false
    });
    return false;
  }
  // 校验创作类型值是否存在
  if (!ARTICLE_CREATION_TYPE_VALUES.includes(creationType)) {
    ElMessage({
      message: ILLEGAL_PARAM_ERROR,
      type: "error",
      duration: 2000,
      center: false
    });
    return false;
  }
  // 校验置顶值是否存在
  if (!ARTICLE_TOP_VALUES.includes(top)) {
    ElMessage({
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
      ElMessage({
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
        ElMessage({
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
}

// 提交发布文章表单
function commitPublishForm() {
  const form = publishForm.value;
  form.htmlContent = currentHtmlContent.value;
  if (!validatePublishForm()) {
    return;
  }
  // 编辑已发布文章：走更新接口
  if (editingType.value === "article") {
    openPageLoading();
    updateArticle({...form, articleId: currentArticleId.value}).then(async () => {
      closePageLoading();
      ElMessage({
        type: "success",
        message: "更新成功",
        duration: 2000,
        center: false,
      });
      publishFormVisible.value = false;
      // 刷新文章列表与当前文章详情
      await refreshArticleList();
      await findArticleDetail(currentArticleId.value).then(r => {
        currentArticleDetail.value = r.data.data;
        currentDraftTitle.value = r.data.data.title;
      });
    }).catch(() => {
      // 错误消息已由响应拦截器弹出
      closePageLoading();
    });
    return;
  }
  openPageLoading();
  publishArticle({...form}).then(async () => {
    closePageLoading();
    ElMessage({
      type: "success",
      message: "发布成功",
      duration: 2000,
      center: false,
    });
    publishFormVisible.value = false;
    // 再请求一次列表
    await refreshDraftList();
    // 再请求一次文章列表
    await refreshArticleList();
    // 再获取一次标签列表
    await commonStore.refreshTagList();
  }).catch(() => {
    // 错误消息已由响应拦截器弹出
    closePageLoading();
  });
}

// 刷新草稿列表并显示第index草稿的内容
async function refreshDraftList(showIndex) {
  await findDraftList().then(async res => {
    draftList.value = res.data.data || [];
    if (draftList.value.length === 0) {
      // 草稿箱为空时重置当前编辑状态
      currentDraftId.value = null;
      currentDraftTitle.value = null;
      currentDraftMarkdownContent.value = "";
      currentDraftIndex.value = 0;
      saveStatus.value = 2;
      return;
    }
    if (!showIndex) {
      showIndex = 0;
    }
    const showDraftId = draftList.value[showIndex].draftId;
    // 获取当前数据
    await findDraftDetail(showDraftId).then(r => {
      const draft = r.data.data;
      editingType.value = "draft";
      currentDraftId.value = draft.draftId;
      currentDraftIndex.value = showIndex;
      currentDraftMarkdownContent.value = draft.markdownContent;
      currentDraftTitle.value = draft.title;
      saveStatus.value = 2;
    });
    // 这里是为了修复从别的页面跳转时保存状态被editorChange覆盖为0，请勿删除
    saveStatus.value = 2;
  });
}

// 刷新已发布文章列表
async function refreshArticleList() {
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
    articleList.value = (res.data.data && res.data.data.records) || [];
  });
}

// 编辑某篇已发布文章
const editArticle = commonUtil.throttle(async function (index) {
  if (editingType.value === "article" && currentArticleIndex.value === index) {
    return;
  }
  const articleId = articleList.value[index].id;
  try {
    // 先保存当前未保存的内容
    await saveCurrentContent();
    await findArticleDetail(articleId).then(r => {
      const detail = r.data.data;
      editingType.value = "article";
      currentArticleId.value = detail.id;
      currentArticleIndex.value = index;
      currentArticleDetail.value = detail;
      currentDraftMarkdownContent.value = detail.markdownContent;
      currentDraftTitle.value = detail.title;
      saveStatus.value = 2;
    });
    saveStatus.value = 2;
  } catch (e) {
    // 加载失败时保持当前编辑状态，错误消息已由响应拦截器弹出
    console.error("加载文章详情失败", e);
  }
}, 200);

// 保存当前未保存的内容（根据当前编辑类型走不同接口）
async function saveCurrentContent() {
  if (saveStatus.value !== 0) {
    return;
  }
  const markdownContent = currentDraftMarkdownContent.value;
  const title = articleUtil.getTitleFromMarkdownContent(markdownContent) || DateUtil.getNowDate("YYYY-MM-DD");
  if (editingType.value === "article") {
    // 更新文章正文，元数据沿用当前文章信息
    await updateArticle({
      ...currentArticleDetail.value,
      articleId: currentArticleId.value,
      title: title,
      markdownContent: markdownContent,
      htmlContent: currentHtmlContent.value || (currentArticleDetail.value ? currentArticleDetail.value.htmlContent : null)
    });
    await refreshArticleList();
  } else {
    await saveOrUpdateDraft(currentDraftId.value, title, markdownContent);
  }
  saveStatus.value = 2;
}

// 编辑某个草稿
const editDraft = commonUtil.throttle(async function (index) {
  const showDraftId = draftList.value[index].draftId;
  if (editingType.value !== "draft" || currentDraftIndex.value !== index) {
    try {
      // 先保存当前的内容（可能是文章或另一篇草稿）
      await saveCurrentContent();
      await findDraftDetail(showDraftId).then(r => {
        const draft = r.data.data;
        editingType.value = "draft";
        currentDraftIndex.value = index;
        currentDraftMarkdownContent.value = draft.markdownContent;
        currentDraftTitle.value = draft.title;
        currentDraftId.value = draft.draftId;
        saveStatus.value = 2;
      });
      saveStatus.value = 2;
    } catch (e) {
      // 加载失败时保持当前编辑状态，错误消息已由响应拦截器弹出
      console.error("加载草稿详情失败", e);
    }
  }
}, 200);

// 监听markdown内容改变事件
function editorChange(value) {
  // 只监听当前草稿的改动
  currentDraftMarkdownContent.value = value;
  currentDraftTitle.value = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("YYYY-MM-DD");
  saveStatus.value = 0;
}

// 监听markdown渲染出的html内容变化
function onHtmlChanged(h) {
  currentHtmlContent.value = h;
}

// 保存草稿或文章
const editorSave = commonUtil.throttle(async function (value) {
  saveStatus.value = 1;
  const title = articleUtil.getTitleFromMarkdownContent(value) || DateUtil.getNowDate("YYYY-MM-DD");
  if (editingType.value === "article") {
    // 更新已发布文章
    await updateArticle({
      ...currentArticleDetail.value,
      articleId: currentArticleId.value,
      title: title,
      markdownContent: value,
      htmlContent: currentHtmlContent.value || (currentArticleDetail.value ? currentArticleDetail.value.htmlContent : null)
    });
    await refreshArticleList();
  } else {
    // 保存或更新草稿
    await saveOrUpdateDraft(currentDraftId.value, title, value);
    // 重新获取草稿列表
    await refreshDraftList();
  }
  saveStatus.value = 2;
}, 200);

// 新建文章
const newArticle = commonUtil.throttle(async function () {
  const now = DateUtil.getNowDate("YYYY-MM-DD");
  const markdownContent = "# " + now;
  const title = articleUtil.getTitleFromMarkdownContent(markdownContent) || now;
  saveStatus.value = 1;
  await saveOrUpdateDraft(null, title, markdownContent);
  saveStatus.value = 2;
  // 再请求一次列表
  await refreshDraftList();
}, 200);

// 处理草稿下拉列表
async function handleDraftDropdownCommand(command) {
  if (command === "delete") {
    try {
      await ElMessageBox.confirm("删除后无法恢复，确定删除该草稿吗？", "删除草稿", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      });
    } catch (e) {
      return;
    }
    const draftId = currentDraftId.value;
    // 删除该行
    await deleteDraft(draftId).then(() => {
      // 弹出删除成功的弹窗
      ElMessage.success("删除成功");
    });
    // 重新请求草稿列表
    await refreshDraftList();
  }
}

// 处理编辑器图片上传
async function onUploadImg(files, callback) {
  const urls = [];
  for (const file of files) {
    const data = new FormData();
    data.append("file", file);
    // 第一步.将图片上传到服务器.
    const res = await uploadFile(data);
    // 第二步.收集返回的url
    urls.push(res.data.data);
  }
  // 第三步.将返回的url替换到文本原位置
  callback(urls);
}

onMounted(async () => {
  // 获取草稿列表和已发布文章列表
  openPageLoading();
  // 重新拉取分类/标签列表，保证分类管理页增删改后下拉选项实时
  await Promise.all([
    refreshDraftList(),
    refreshArticleList(),
    commonStore.refreshCategoryList().catch(() => {}),
    commonStore.refreshTagList().catch(() => {})
  ]).catch(() => {
    // 错误消息已由响应拦截器弹出
  });
  closePageLoading();

  // 从文章管理列表跳转过来时，直接定位并加载对应文章
  const targetArticleId = route.query.articleId;
  if (targetArticleId) {
    try {
      await findArticleDetail(targetArticleId).then(r => {
        const detail = r.data.data;
        editingType.value = "article";
        currentArticleId.value = detail.id;
        currentArticleIndex.value = articleList.value.findIndex(a => a.id === detail.id);
        currentArticleDetail.value = detail;
        currentDraftMarkdownContent.value = detail.markdownContent;
        currentDraftTitle.value = detail.title;
        saveStatus.value = 2;
      });
    } catch (e) {
      // 加载失败时保持默认草稿编辑状态，错误消息已由响应拦截器弹出
      console.error("加载文章详情失败", e);
    }
  }
});

// 页面销毁之前保存当前内容
onBeforeUnmount(async () => {
  if (saveStatus.value === 0) {
    saveStatus.value = 1;
    await saveCurrentContent();
    saveStatus.value = 2;
  }
});

// 路由跳转之前保存当前内容
onBeforeRouteLeave(async (to, from, next) => {
  if (saveStatus.value === 0) {
    saveStatus.value = 1;
    await saveCurrentContent();
    saveStatus.value = 2;
  }
  next();
});
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

    // md-editor-v3 填满容器
    :deep(.md-editor) {
      height: 100%;
    }
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

// ========== 发布弹窗 ==========
:deep(.publish-dialog) {
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
