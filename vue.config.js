const path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir)
};

const BASE_URL = process.env.NODE_ENV === 'production'
  ? '/admin/'
  : '/';

module.exports = {
  publicPath: BASE_URL,
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('_c', resolve('src/components'))
  },
  devServer: {
    port: 8888,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8080/',
        ws: true,
        changeOrigin: true,
        pathRewrite:{
          '^/api':''
        }
      }
    }
  }
};
