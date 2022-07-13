<template>
  <Message type="success" message="退出成功,2秒后跳转主页" v-if="isVisible"></Message>
  <!-- 导航栏 -->
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <!-- 图标 -->
    <router-link to="/" class="navbar-brand" href="#">知乎</router-link>
    <!-- 显示按钮选项 -->
    <!-- 未登录 -->
    <ul v-if="!user.isLogin" class="list-inline mb-0">
      <li class="list-inline-item">
        <router-link to="/login" class="btn btn-outline-light my-2">登录</router-link>
      </li>
      <li class="list-inline-item">
        <router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link>
      </li>
    </ul>
    <!-- 已登录 -->
    <div v-else>
      <DropDown :user="user">
        <DropDownItem>
          <router-link to="/create" class="dropdown-item">新建文章</router-link>
        </DropDownItem>
        <DropDownItem disabled><a class="dropdown-item">管理文章</a></DropDownItem>
        <DropDownItem>
          <a class="dropdown-item" @click.prevent="logOut">退出登录</a>
        </DropDownItem>
      </DropDown>
    </div>
  </nav>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref } from 'vue'
// 导入一个接口类型
import { UserProps } from '@/interface/interface'
// 导入下拉组件
import DropDown from '@/components/dropdown/DropDown.vue'
import DropDownItem from '@/components/dropdown/DropDownItem.vue'
// 登录提示
import Message from '@/components/main/Message.vue'
import store from '@/store'
import router from '@/router/router'
export default defineComponent({
  name: 'GlobalHeader',
  /* 组件注册区域 */
  components: {
    DropDown,
    DropDownItem,
    Message
  },
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup() {
    const isVisible = ref(false)
    const logOut = () => {
      isVisible.value = true
      setTimeout(() => {
        store.commit('logOut')
        isVisible.value = false
        router.push('/')
      }, 2000)
    }
    return {
      logOut,
      isVisible
    }
  }
})
</script>

<style>
</style>
