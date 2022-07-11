import { createRouter, createWebHistory } from 'vue-router'
// 导入相应的组件
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import ColumnDetail from '@/components/article/ColumnDetail.vue'
import CreatePost from '@/components/article/CreatePost.vue'
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
  // 判断是否有已经登录用户
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    // 跳转登录
    next({ name: 'login' })
  } else if (to.meta.redirectAlreadyLogin && store.state.user.isLogin) {
    next({ name: '/' })
  } else {
    // 放行
    next()
  }
})

export default router
