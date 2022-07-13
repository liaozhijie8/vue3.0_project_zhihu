<template>
  <div class="container">
    <GlobalHeader :user="headerData"></GlobalHeader>
    <!-- 加载框(需要才弹出来的) -->
    <Loader v-if="isLoading" text="拼命加载中" background="rgba(0,0,0,0.5)"></Loader>
    <!-- 错误消息提示框 -->
    <Message :message="error.message" type="error" v-if="error.status" @close-message="setError"></Message>
    <!-- 主体路由位置 -->
    <router-view></router-view>
    <FooterSet></FooterSet>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import axios from 'axios'
// 导入头部组件，并把接口类型也导入
import GlobalHeader from '@/components/header/GlobalHeader.vue'
// 底部设置
import FooterSet from '@/components/footer/FooterSet.vue'
// 加载组件
import Loader from '@/components/main/Loader.vue'
// 错误消息提示
import Message from '@/components/main/Message.vue'
// 导入头部数据
import { useStore } from 'vuex'
import { GlobalDataProps } from './interface/interface'
import { computed } from '@vue/reactivity'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    FooterSet,
    Loader,
    Message
  },
  setup() {
    /* 本地登录设置 */
    const store = useStore<GlobalDataProps>()
    // 获取头部数据
    const headerData = computed(() => store.state.user)
    // 获取加载的状态
    const isLoading = computed(() => store.state.loading)
    // 获取token
    const token = computed(() => store.state.token)
    // 挂载token到本地
    onMounted(() => {
      // 取得里面的属性需要加value
      if (!headerData.value.isLogin && token.value) {
        // 向服务器发送token，这里取到token需要加value
        axios.defaults.headers.common.Authorization = `Bearer ${token.value}`
        store.dispatch('fetchCurrentUser')
      }
    })
    /* 错误信息处理组件设置(全局代理触发的) */
    const error = computed(() => store.state.error)
    const setError = (val: boolean) => {
      // 把vuex中的状态重置为false
      store.commit('setErrorStatus', val)
    }
    // 暴露属性
    return {
      headerData,
      isLoading,
      error,
      setError
    }
  }
})
</script>

<style>
</style>
