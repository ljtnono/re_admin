class ArticleUtil {

  /**
   * 从markdown内容中获取标题，这里直接取第一个以#开头的行的内容作为标题
   *
   * @param markdownContent markdown内容
   * @returns {*}
   */
  static getTitleFromMarkdownContent(markdownContent) {
    let title;
    if (markdownContent) {
      // 首先使用正则表达式捕获所有标题行
      let nav = []
      markdownContent
        // 处理代码块中的注释，用\f这个字符对“```”进行占位，然后再把占位块一起用空串替换。
        .replace(/```/g, () => {
          return "\f";
        })
        .replace(/\f[^\f]*?\f/g, () => {
          return "";
        })
        // 将\r或者\n全部替换为\n处理
        .replace(/\r|\n+/g, () => {
          return "\n";
        })
        // 匹配所有以 # 开始的内容
        .replace(/#+\s+(.*)/g, (match, g1) => {
          title = g1;
          nav.push(title);
        });
      if (nav.length !== 0) {
        if (nav[0] !== "" && nav[0] !== "\n") {
          title = nav[0];
        }
      }
    }
    return title;
  }
}

export default ArticleUtil;
