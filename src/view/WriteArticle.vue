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
          <el-dropdown class="flex" v-if="currentDraftIndex === index" @command="handleDraftDropdownCommand" trigger="click">
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
        :visible.sync="publishFormVisible">
        <template slot="footer">
          <span class="dialog-footer">
            <el-button @click="publishFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="commitPublishForm">确 定</el-button>
          </span>
        </template>
        <el-form ref="publishForm" :model="publishForm" label-width="120px">
          <el-form-item label="文章标题：" prop="title">
            <el-input v-model="publishForm.title" clearable placeholder="请输入文章标题"/>
          </el-form-item>
          <el-form-item label="文章简介：" prop="summary">
            <el-input type="textarea" v-model="publishForm.summary" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" show-word-limit placeholder="请输入文章简介，如果不填会根据文章内容自动生成" />
          </el-form-item>
          <el-form-item label="文章引用：" prop="quoteInfo">
            <el-input type="textarea" v-model="publishForm.quoteInfo" :autosize="{ minRows: 4, maxRows: 4}" maxlength="200" show-word-limit placeholder="请输入文章引文信息" />
          </el-form-item>
          <el-form-item label="文章类型：" prop="categoryId">
            <el-select style="width: 100%" v-model="publishForm.categoryId" clearable filterable placeholder="请选择文章类型">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
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
            </el-select>
          </el-form-item>
          <el-form-item label="文章设定：">
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
          <el-form-item label="文章封面：">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false">
              <i slot="default" class="el-icon-plus" />
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
                    <i class="el-icon-download"></i>
                  </span>
                  <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" :alt="dialogImageUrl">
            </el-dialog>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import {EDITOR_CONFIG} from "../config/commonConfig";
import DateUtil from "@/util/dateUtil";
import {deleteDraft, getDraftDetail, getDraftList, saveOrUpdateDraft} from "../api/article";
import articleUtil from "@/util/articleUtil";
import commonUtil from "@/util/commonUtil";
import {uploadFile} from "@/api/common";

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
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      options: [{
        value: "选项1",
        label: "黄金糕"
      }, {
        value: "选项2",
        label: "双皮奶"
      }, {
        value: "选项3",
        label: "蚵仔煎"
      }, {
        value: "选项4",
        label: "龙须面"
      }, {
        value: "选项5",
        label: "北京烤鸭"
      }],
      // 文章发布表单
      publishForm: {
        title: null,
        draftId: null,
        markdownContent: null,
        summary: null,
        categoryId: null,
        tagList: ["a", "b"],
        recommend: 0,
        top: 0,
        creationType: 1,
        coverUrl: null,
        transportInfo: null,
        quoteInfo: null
      }
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
  methods: {
    // TODO 当发布文章表单打开时进行处理
    publishFormOpen() {
      let that = this;
      that.publishForm = {
        title: that.currentDraftTitle,
        draftId: that.currentDraftId,
        markdownContent: that.currentDraftMarkdownContent,
        summary: that.title,
        categoryId: null,
        tagList: ["a", "b"],
        recommend: 0,
        top: 0,
        creationType: 1,
        coverUrl: "",
        transportInfo: null,
        quoteInfo: null
      }
    },
    // TODO 提交发布文章表单
    commitPublishForm() {
      let that = this;
      that.publishFormVisible = false;
    },
    // TODO 获取文章标签列表
    getArticleTagList() {
      let that = this;
      that.publishForm.tagList = ["fdasfs"]
    },
    handleRemove(file) {
      console.log(file);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleDownload(file) {
      console.log(file);
    },
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
        if (that.saveStatus === 0) {
          let currentDraftMarkdownContent = that.currentDraftMarkdownContent;
          let currentDraftTitle = articleUtil.getTitleFromMarkdownContent(currentDraftMarkdownContent) || DateUtil.getNowDate("yyyy-MM-D");
          let currentDraftId = that.currentDraftId;
          await saveOrUpdateDraft(currentDraftId, currentDraftTitle, currentDraftMarkdownContent);
        }
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
    // 获取标签列表
    that.getArticleTagList();
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

}
</style>
