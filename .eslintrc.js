module.exports = {
  // 根目录标识
  root: true,
  // 解析器
  parserOptions: {
    parser: "babel-eslint",
  },
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    // 关闭组件名必须多个单词的限制
    "vue/multi-word-component-names": "off",
    // 关闭注册组件未使用会报错的限制
    "vue/no-unused-components": "off",
    // 关闭未使用变量报错的限制
    "no-unused-vars": "off",
    "vue/no-unused-vars": "off",
    "vue/no-mutating-props": "off",
    quotes: [2, "double"],
    indent: [2, 2],
  },
};
