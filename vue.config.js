const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888/api',
        changeOrigin: true, // 解决跨域
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};
