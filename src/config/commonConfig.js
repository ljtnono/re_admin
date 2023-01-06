// #################### 常用配置项 #################### //

// element的全局加载中的配置
export const ELEMENT_PAGE_LOADING_CONFIG = {
  target: "document.body",
  fullscreen: true,
  text: "等待服务器响应中...",
  spinner: "el-icon-loading",
  background: "rgba(0, 0, 0, 0.8)",
};

// 全局操作成功消息配置
export const ELEMENT_SUCCESS_MESSAGE_CONFIG = {
  type: "success",
  message: "操作成功",
  duration: 2000,
  center: false,
};

// 全局操作失败消息配置
export const ELEMENT_FAILED_MESSAGE_CONFIG = {
  message: "操作失败",
  type: "error",
  duration: 2000,
  center: false,
};

// markdown编辑器配置
export const EDITOR_CONFIG = {
  // 初始值
  value: "",
  // zh-CN	语言选择，暂支持 zh-CN: 简体中文, zh-TW: 正体中文 ， en: 英文 ， fr: 法语， pt-BR: 葡萄牙语， ru: 俄语， de: 德语， ja: 日语
  language: "zh-CN",
  // 14px	编辑区域文字大小
  fontSize: "20px",
  // 开启滚动条样式(暂时仅支持chrome)
  scrollStyle: true,
  // 开启边框阴影
  boxShadow: true,
  // 边框阴影样式
  boxShadowStyle: "0 2px 12px 0 rgba(0, 0, 0, 0.1)",
  // 是否开启过渡动画
  transition: true,
  // 工具栏背景颜色
  toolbarsBackground: "#ffffff",
  // 预览框背景颜色
  previewBackground: "#fbfbfb",
  // true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏)
  subfield: false,
  // 在单栏（subfield=false）时默认展示区域 edit： 默认展示编辑区域，preview： 默认展示预览区域 其他 = edit
  defaultOpen: "",
  // 输入框为空时默认提示文本
  placeholder: "还没有内容哦！快来写点什么吧...",
  // 是否允许编辑
  editable: true,
  // code-github	markdown样式： 默认github, 可选配色方案
  codeStyle: "atom-one-dark-reasonable",
  // 工具栏是否显示
  toolbarsFlag: true,
  // 默认展示目录
  navigation: false,
  // 是否启用快捷键
  shortCut: true,
  // 自动聚焦到文本框
  autofocus: true,
  // 代码高亮
  ishljs: true,
  // 	图片过滤函数，参数为一个File Object，要求返回一个Boolean, true表示文件合法，false表示文件不合法
  imageFilter: null,
  // 图片点击事件，默认为预览，可覆盖
  imageClick: null,
  // \t	tab转化为几个空格，默认为\t
  tabSize: 4,
  // 启用HTML标签，因为历史原因这个标记一直默认为true，但建议不使用HTML标签就关闭它，它能彻底杜绝安全问题。
  html: true,
  // xss规则配置, 默认开启，设置false可以关闭，开启后会对HTML标签进行过滤，默认过滤所有HTML标签属性，建议按需配置白名单减少被攻击的可能。
  // - 自定义规则参考: https://jsxss.com/zh/options.html
  // - 参考DEMO: dev-demo
  xssOptions: {},
  // 如下例	工具栏
  toolbars: {
    // bold: true, // 粗体
    // italic: true, // 斜体
    // header: true, // 标题
    // underline: true, // 下划线
    // strikethrough: true, // 中划线
    // mark: true, // 标记
    // superscript: true, // 上角标
    // subscript: true, // 下角标
    // quote: true, // 引用
    // ol: true, // 有序列表
    // ul: true, // 无序列表
    // link: true, // 链接
    imagelink: true, // 图片链接
    code: true, // code
    table: true, // 表格
    fullscreen: true, // 全屏编辑
    // readmodel: true, // 沉浸式阅读
    // htmlcode: true, // 展示html源码
    // help: true, // 帮助
    /* 1.3.5 */
    undo: true, // 上一步
    redo: true, // 下一步
    trash: true, // 清空
    save: true, // 保存（触发events中的save事件）
    /* 1.4.2 */
    navigation: true, // 导航目录
    /* 2.1.8 */
    // alignleft: true, // 左对齐
    // aligncenter: true, // 居中
    // alignright: true, // 右对齐
    /* 2.2.1 */
    subfield: true, // 单双栏模式
    preview: true, // 预览
  }
};
