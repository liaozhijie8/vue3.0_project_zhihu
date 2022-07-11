<template>
  <form>
    <div class="mb-3">
      <label for="exampleInputEmail1" class="form-label">用户名</label>
      <!-- 因为子组件中定义了modelValue属性值，所以这里采用了v-model属性即可实现双向绑定 -->
      <ValidateInput type='text' ref="formRef" placeholder="请输入邮箱地址" :rules="emailRules" v-model="emailVal" lable-form="exampleInputEmail1">
      </ValidateInput>
    </div>
    <div class="mb-3">
      <label for="exampleInputPassword1" class="form-label">密码</label>
      <ValidateInput type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" lable-form="exampleInputPassword1"></ValidateInput>
    </div>
    <button type="submit" class="btn btn-primary" @click.prevent="submitData">Submit</button>
  </form>
</template>

<script lang='ts'>
import { defineComponent, ref, onUnmounted } from 'vue'
// 导入验证组件
import ValidateInput, { RulesProp } from '@/components/form/ValidateInput.vue'
// 导入mitt监听事件
import mitt from 'mitt'
// 定义events类型
type Events = {
  'form-item-created': boolean
}
export const emitter = mitt<Events>()
export default defineComponent({
  name: 'validateForms',
  // 注册组件
  components: {
    ValidateInput
  },
  emits: ['form-submit'],
  setup(props, context) {
    /* 双向数据绑定 */
    //  邮箱地址
    const emailVal = ref()
    // 密码
    const passwordVal = ref()
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
    // ref组件的dom
    const formRef = ref()
    // 发送数据的函数
    const submitData = () => {
      context.emit('form-submit', formRef.value.validateInput(), emailVal.value, passwordVal.value)
    }
    /* mitt监听事件 */
    // 接收监听返回的数据处理函数
    const callback = (test: boolean) => {
      console.log(test)
    }
    // 创建on事件
    emitter.on('form-item-created', callback)
    // 清除监听
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
    })
    return {
      emailRules,
      emailVal,
      passwordRules,
      passwordVal,
      submitData,
      formRef
    }
  }
})
</script>

<style>
</style>
