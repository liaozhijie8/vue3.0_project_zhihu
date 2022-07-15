import { Commit, createStore } from 'vuex'
import { arrToObj, objToArr } from './helper'
// 导入数据
import { headerData } from './testData'
// 管理数据类型接口
import { GlobalDataProps, GlobalErrorProps } from '@/interface/interface'
import axios from 'axios'
// 封装一个get请求函数
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url)
  commit(mutationName, data)
  return data
}
// 封装一个post请求函数
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
  const { data } = await axios.post(url, payload)
  commit(mutationName, data)
  return data
}

const store = createStore<GlobalDataProps>({
  // 存数据
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || '',
    loading: false,
    columns: [],
    posts: [],
    user: headerData
  },
  // 更改数据(同步操作)
  mutations: {
    // 改变登录数据
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, name: 'liaozhije' }
    // },
    /* post请求的登录 */
    login(state, rawData) {
      const { token } = rawData.data
      // 存到vuex中
      state.token = token
      // 将服务器token存在本地
      localStorage.setItem('token', token)
      // 添加头部认证
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
    },
    // 添加文章
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    // 从接口中获取主页渲染专栏数据
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    /* 获取专栏 */
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    // 加载的效果，其实就是一个Boolean控制开关
    setLoading(state, status) {
      state.loading = status
    },
    /* 设置登录错误信息提示 */
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    /* 获取当前用户信息 */
    fetchCurrentUser(state, rawData) {
      state.user = { isLogin: true, ...rawData.data }
    },
    /* 改变错误信息状态 */
    setErrorStatus(state, rawData) {
      state.error.status = rawData
    },
    // 退出的函数
    logOut(state) {
      state.token = ''
      localStorage.removeItem('token')
      state.user = { isLogin: false }
      delete axios.defaults.headers.common.Authorization
    },
    /* 获取文章详情页面数据 */
    fetchPostDetail(state, rawData) {
      state.posts = rawData.data
    }
  },
  // 更改数据
  actions: {
    /*    async fetchColumns({ commit }) {
         const { data } = await axios.get('/columns')
         // 发送数据
         commit('fetchColumns', data)
       }, */
    fetchColumns({ commit }) {
      return getAndCommit('/columns', 'fetchColumns', commit)
    },
    // 获取专栏文章
    fetchColumn({ commit }, cid) {
      return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
    },
    // 获取指定id专栏
    fetchPosts({ commit }, cid) {
      return getAndCommit(`/columns/${cid}/posts`, 'fetchPosts', commit)
    },
    /* 登录的函数 */
    login({ commit }, payload) {
      return postAndCommit('/user/login', 'login', commit, payload)
    },
    /* 新建文章的函数 */
    createPost({ commit }, payload) {
      return postAndCommit('/posts', 'cretatPost', commit, payload)
    },
    /* 获取当前用户信息 */
    fetchCurrentUser({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    /* 组合actions */
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    /* 获取文章详情页面 */
    fetchPostDetail({ commit }, cid) {
      return getAndCommit(`/posts/${cid}`, 'fetchPostDetail', commit)
    }

  },
  // 计算函数
  getters: {
    // 返回一个id值
    // find筛选出唯一一个符合条件的
    getColumnById: (state) => (id: string) => {
      return state.columns.find(c => c._id === id)
    },
    getPostsByCid: (state) => (cid: string) => {
      return state.posts.filter(post => post.column === cid)
    }
  }
})
export default store
