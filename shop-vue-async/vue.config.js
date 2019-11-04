module.exports = {
  devServer: {
    open: true,
    port: 3020
    // 配置代理
    // proxy: {
    //   '/aaa': {
    //     target: 'http://localhost:8888/api/private/v1/',
    //     pathRewrite: { '^/aaa': '' }
    //   }
    // },
  },
  // 配置webpack
  configureWebpack: {
    // 配置打包的排除项,从外部引入
    externals: {
      vue: 'Vue',
      vuex: 'Vuex',
      'vue-router': 'VueRouter',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      moment: 'moment'
    }
  }
}
