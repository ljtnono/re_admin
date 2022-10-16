module.exports = {
  // 根目录标识
  root: true,
  // 解析器
  parserOptions: {
    parser: "babel-eslint"
  },
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "indent": [2, 2],
    "vue/multi-word-component-names": "off",
    "vue/no-unused-components": "off",
    "no-unused-vars": "off"
  }
};
