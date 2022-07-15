import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'
// 引入vuex store
import store from './store'
/* axios配置 */
// 替换 baseURL
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
// 下面的 icode 值是从慕课网获取的 token 值，可以在课程右侧的项目接口校验码找到
axios.interceptors.request.use(config => {
  // 设置消息状态
  store.commit('setError', { status: false, message: '' })
  // get 请求，添加到 url 中
  config.params = { ...config.params, icode: '6A3213C684DA78CA' }
  // 其他请求，添加到 body 中
  // 如果是上传文件，添加到 FormData 中
  if (config.data instanceof FormData) {
    config.data.append('icode', '6A3213C684DA78CA')
  } else {
    // 普通的 body 对象，添加到 data 中
    config.data = { ...config.data, icode: '6A3213C684DA78CA' }
  }
  // 设置加载状态
  store.commit('setLoading', true)
  return config
})
// 拦截响应
axios.interceptors.response.use(config => {
  // 设置加载关闭状态
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
