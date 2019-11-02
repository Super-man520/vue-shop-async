import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入axios
import axios from 'axios'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入moment
import moment from 'moment'
// 引入富文本
import VueQuillEditor from 'vue-quill-editor'
// css样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入公共样式
// import './css/common.css'

// 处理时间戳
Vue.filter('timer', function (value, str = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value * 1000).format(str)
})

Vue.use(ElementUI)
Vue.use(VueQuillEditor /* { default global options } */)

Vue.config.productionTip = false

// 挂载axios
Vue.prototype.$axios = axios

// 配置基准url
// axios.defaults.baseURL = '/aaa'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  response = response.data
  // 判断按token是否过期
  if (response.meta.status === 401) {
    // 过期
    response.meta.msg = '尊敬的用户,你的登录已过期，请重新登录'
    // 本地销毁无效的token
    localStorage.removeItem('token')
    // 拦截到首页
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
