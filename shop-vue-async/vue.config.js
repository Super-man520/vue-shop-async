module.exports = {
  devServer: {
    open: true,
    port: 3020,
    // 配置代理
    proxy: {
      '/aaa': {
        target: 'http://localhost:8888/api/private/v1/',
        pathRewrite: { '^/aaa': '' }
      }
    }
  }
}
