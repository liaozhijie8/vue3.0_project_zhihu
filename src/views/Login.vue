<template>
  <div class="login">
    <Message type="success" message="登录成功,2秒后跳转主页" v-if="isVisible"></Message>
    <LoginForms @form-submit="formData"></LoginForms>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import LoginForms from '@/components/form/ValidateForm.vue'
// 登录提示
import Message from '@/components/main/Message.vue'
// 路由钩子函数
import { useRouter } from 'vue-router'
/* vuex代理状态 */
import { useStore } from 'vuex'
export default defineComponent({
  name: 'login',
  components: {
    LoginForms,
    Message
  },
  setup() {
    const isVisible = ref(false)
    const store = useStore()
    const router = useRouter()
    // 处理form发送过来的参数
    const formData = (val: boolean, email: string, password: number) => {
      /* 修改store数据 */
      // 调用mutations名为login的store更改属性 本地数据
      // store.commit('login')
      if (val) {
        const payload = {
          email: email,
          password: password
        }
        store.dispatch('loginAndFetch', payload).then(() => {
          isVisible.value = val
          setTimeout(() => {
            isVisible.value = false
            router.push('/')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    // 暴露属性
    return {
      formData,
      isVisible
    }
  }
})
</script>

<style>
</style>
