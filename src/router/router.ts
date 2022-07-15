import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
// 导入相应的组件
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import ColumnDetail from '@/components/article/ColumnDetail.vue'
import CreatePost from '@/components/article/CreatePost.vue'
import PostDetail from '@/views/PostDetail.vue'
import store from '@/store'
const routerHistory = createWebHistory()
const router = createRouter({
  // 设置地址类型
  history: routerHistory,
  // 路径映射
  routes: [
    // 主页面路由
    {
      path: '/',
      name: 'home',
      component: Home
    },
    // 登录页面路由
    {
      path: '/login',
      name: 'login',
      component: Login,
      // 登录状态
      meta: { redirectAlreadyLogin: true }
    },
    // 注册页面路由
    {
      path: '/signup',
      name: 'signup',
      component: Signup
    },
    // 动态路由跳转到相应的页面
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    // 动态路由跳转到文章细节的页面
    {
      path: '/postdetail/:id',
      name: 'postdetail',
      component: PostDetail
    },
    // 写文章路由
    {
      path: '/create',
      name: 'createpost',
      component: CreatePost,
      // 需要登录权限才可以访问
      meta: { requiredLogin: true }
    }
  ]
})
// 路由前置守卫
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { requiredLogin, redirectAlreadyLogin } = to.meta
  // 判断已经登录
  if (!user.isLogin) {
    if (token) {
      // 登录
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(e => {
        console.error(e)
        store.commit('logOut')
        next('login')
      })
    } else {
      if (requiredLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
