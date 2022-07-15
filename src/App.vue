<template>
  <div class="container">
    <GlobalHeader :user="headerData"></GlobalHeader>
    <Uploader action="/upload" @file-uploaded="onFileUploaded" :before-upload="beforeUpload">
      <template #loading>
        <p>正在上传</p>
      </template>
    </Uploader>
    <!-- 加载框(需要才弹出来的) -->
    <Loader v-if="isLoading" text="拼命加载中" background="rgba(0,0,0,0.5)"></Loader>
    <!-- 主体路由位置 -->
    <router-view></router-view>
    <FooterSet></FooterSet>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import axios from 'axios'
// 导入头部组件，并把接口类型也导入
import GlobalHeader from '@/components/header/GlobalHeader.vue'
// 底部设置
import FooterSet from '@/components/footer/FooterSet.vue'
// 加载组件
import Loader from '@/components/main/Loader.vue'
// 导入头部数据
import { useStore } from 'vuex'
import Uploader from '@/components/article/Uploader.vue'
import { GlobalDataProps, ResponseType } from './interface/interface'
import { computed } from '@vue/reactivity'
// 消息提示组件函数
import createMessage from './hooks/createMessage'
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,
    FooterSet,
    Loader,
    Uploader
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
    watch(() => error.value.status, () => {
      const { status, message } = error.value
      if (status && message) {
        createMessage(message, 'error')
      }
    })
    /*  上传文件检测函数 */
    // 上传的检测函数
    const beforeUpload = (file: File) => {
      const isJPG = file.type === 'image/jpeg'
      // console.log(isJPG)
      if (!isJPG) {
        createMessage('只能上传jpg格式的图片', 'error', 2000)
      }
      return isJPG
    }
    // 子组件的成功的emit函数
    const onFileUploaded = (val: ResponseType) => {
      createMessage(`上传图片id ${val.data._id}`, 'success', 2000)
    }
    // 暴露属性
    return {
      headerData,
      isLoading,
      error,
      beforeUpload,
      onFileUploaded,
      createMessage
    }
  }
})
</script>

<style>
</style>
