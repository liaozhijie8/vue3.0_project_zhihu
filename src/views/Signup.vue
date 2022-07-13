<template>
  <Message type="success" message="注册成功,2秒后跳转主页" v-if="isVisible"></Message>
  <form>
    <div class="mb-3">
      <label for="signEmail" class="form-label">邮箱地址</label>
      <!-- 因为子组件中定义了modelValue属性值，所以这里采用了v-model属性即可实现双向绑定 -->
      <ValidateInput type='text' ref="formRef" placeholder="请输入邮箱地址" :rules="emailRules" v-model="emailVal"
        lable-form="signEmail">
      </ValidateInput>
    </div>
    <div class="mb-3">
      <label for="signUser" class="form-label">昵称</label>
      <ValidateInput type='text' ref="userRef" placeholder="请输入昵称" :rules="userRules" v-model="signUserVal"
        lable-form="signUser">
      </ValidateInput>
    </div>
    <div class="mb-3">
      <label for="signPassword" class="form-label">密码</label>
      <ValidateInput type="password" ref="passwordRef" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal"
        lable-form="signPassword"></ValidateInput>
    </div>
    <div class="mb-3">
      <label for="againPassword" class="form-label">重复密码</label>
      <ValidateInput type="password" ref="againPasswordRef" placeholder="请再次输入密码" :rules="passwordAgainRules"
        v-model="againPasswordVal" lable-form="againPassword"></ValidateInput>
    </div>
    <div class="d-grid gap-2">
      <button type="submit" class="btn btn-primary text-center" @click.prevent="onSignup">注册新用户</button>
    </div>
  </form>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue'
// 导入验证组件
import ValidateInput, { RulesProp } from '@/components/form/ValidateInput.vue'
// 登录提示
import Message from '@/components/main/Message.vue'
import axios from 'axios'
import router from '@/router/router'
export default defineComponent({
  name: 'signup',
  // 注册组件
  components: {
    ValidateInput,
    Message
  },
  setup(props, context) {
    // 消息提示开关
    const isVisible = ref(false)
    /* 双向数据绑定 */
    //  邮箱地址
    const emailVal = ref()
    // 昵称
    const signUserVal = ref()
    // 密码
    const passwordVal = ref()
    // 重复密码
    const againPasswordVal = ref()
    /* 传入验证规则的子组件接受的数据 */
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    // 定义密码的验证
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      { type: 'range', message: '请输入密码在6-12位' }
    ]
    // 定义昵称的验证
    const userRules: RulesProp = [
      { type: 'required', message: '昵称不能为空' }
    ]
    // 定义重复密码的验证
    const passwordAgainRules: RulesProp = [
      { type: 'required', message: '密码不能为空' },
      {
        type: 'custom',
        validator: () => {
          return passwordVal.value === againPasswordVal.value
        },
        message: '密码不相同'
      }
    ]
    // ref组件的dom
    const formRef = ref()
    const userRef = ref()
    const passwordRef = ref()
    const againPasswordRef = ref()
    // 发送数据的函数
    const onSignup = () => {
      // 验证是否全部输入通过
      const temp = formRef.value.validateInput() && userRef.value.validateInput() && passwordRef.value.validateInput() && againPasswordRef.value.validateInput()
      if (temp) {
        // 定义要发送给服务器的数据
        const payload = {
          email: emailVal.value,
          password: passwordVal.value,
          nickName: signUserVal.value
        }
        // 请求服务器的数据,注册新用户
        axios.post('/users', payload).then(data => {
          isVisible.value = temp
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRules,
      emailVal,
      passwordRules,
      passwordVal,
      onSignup,
      formRef,
      userRules,
      signUserVal,
      againPasswordVal,
      passwordAgainRules,
      userRef,
      passwordRef,
      againPasswordRef,
      isVisible
    }
  }
})
</script>

<style lang="less" scoped>
</style>
