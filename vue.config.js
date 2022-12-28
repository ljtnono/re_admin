const path = require("path");

const resolve = (dir) => {
  return path.join(__dirname, dir);
};

// vue-cli 配置项
const BASE_URL = process.env.NODE_ENV === "production" ? "/" : "/";

module.exports = {
  publicPath: BASE_URL,
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@s", resolve("src"))
      .set("@c", resolve("src/components"))
      .set("@a", resolve("src/assets"))
      .set("@v", resolve("src/view"));
  },
  devServer: {
    disableHostCheck: true
  }
};
