<template>
  <div class="container">
    <GlobalHeader :user="headerData"></GlobalHeader>
    <!-- 加载框(需要才弹出来的) -->
    <Loader v-if="isLoading" text="拼命加载中" background="rgba(0,0,0,0.5)"></Loader>
    <!-- 主体路由位置 -->
    <router-view></router-view>
    <FooterSet></FooterSet>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
// 导入头部组件，并把接口类型也导入
import GlobalHeader from '@/components/header/GlobalHeader.vue'
// 底部设置
import FooterSet from '@/components/footer/FooterSet.vue'
// 加载组件
import Loader from '@/components/main/Loader.vue'
// 导入头部数据
import { useStore } from 'vuex'
import { GlobalDataProps } from './interface/interface'
import { computed } from '@vue/reactivity'
// 消息提示组件函数
import createMessage from './hooks/createMessage'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    FooterSet,
    Loader
  },
  setup() {
    /* 本地登录设置 */
    const store = useStore<GlobalDataProps>()
    // 获取头部数据
    const headerData = computed(() => store.state.user)
    // 获取加载的状态
    const isLoading = computed(() => store.state.loading)
    /* 错误信息处理组件设置(全局代理触发的) */
    const error = computed(() => store.state.error)
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error', 2000)
      }
    })
    // 暴露属性
    return {
      headerData,
      isLoading,
      error,
      createMessage
    }
  }
})
</script>

<style>
</style>
