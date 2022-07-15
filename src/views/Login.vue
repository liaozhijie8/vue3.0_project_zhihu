<template>
  <div class="login">
    <LoginForms @form-submit="formData"></LoginForms>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LoginForms from '@/components/form/ValidateForm.vue'
// 登录提示
import createMessage from '@/hooks/createMessage'
// 路由钩子函数
import { useRouter } from 'vue-router'
/* vuex代理状态 */
import { useStore } from 'vuex'
export default defineComponent({
  name: 'login',
  components: {
    LoginForms
  },
  setup() {
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
          createMessage('登录成功!2秒后跳转主页', 'success', 2000)
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    // 暴露属性
    return {
      formData
    }
  }
})
</script>

<style>
</style>
