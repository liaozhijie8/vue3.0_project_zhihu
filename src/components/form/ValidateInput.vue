<template>
  <div class="validate-input-container pd-3">
    <!-- 用户输入input或者textarea -->
    <input v-if="tag != 'textarea'" class="form-control" :class="{ 'is-invalid': inputRef.error }" :value="inputRef.val"
      @blur="validateInput" v-bind="$attrs" @input="updateValue" :id="lableForm">
    <textarea v-else class="form-control" :class="{ 'is-invalid': inputRef.error }" :value="inputRef.val"
      @blur="validateInput" v-bind="$attrs" @input="updateValue" :id="lableForm">
    </textarea>
    <!-- 输入提示框 -->
    <div class="invalid-feedback" v-if="inputRef.error">{{ inputRef.message }}</div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, reactive, onMounted } from 'vue'
// 验证的接口
import { RuleProps } from '@/interface/interface'
/* 监听事件 */
import { emitter } from '@/components/form/ValidateForm.vue'
// 验证邮箱的正则表达式
const emailReg = /^[a-zA-Z0-9._%+-]+@(?!.*\.\..*)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
// 导出一个rule类型数组
export type RulesProp = RuleProps[]
// 定义输入标签的类型
export type TagType = 'input' | 'textarea'
export default defineComponent({
  // 定义一个要接收父组件的值类型
  props: {
    rules: Array as PropType<RulesProp>,
    // modeValue是一个固定属性,用来接收父组件传来的v-model值
    modelValue: String,
    // 标签属性
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    },
    // 和lable绑定的id属性
    lableForm: {
      type: String,
      default: ''
    }
  },
  inheritAttrs: false,
  setup(props, context) {
    // 定义处理数据
    const inputRef = reactive({
      val: props.modelValue || '',
      error: false,
      message: ''
    })
    // 创建一个更新函数
    const updateValue = (e: Event) => {
      // 拿到input键盘输入的事件的值
      const targetValue = (e.target as HTMLInputElement).value
      // 赋给props参数，从而让：value数据变化
      inputRef.val = targetValue
      // 发送给父组件，名称名字也是一个固定属性
      context.emit('update:modelValue', targetValue)
    }
    // 定义处理函数
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = inputRef.val.trim() !== ''
              break
            case 'email':
              // 测试是否通过正则表达式
              passed = emailReg.test(inputRef.val)
              break
            case 'range':
              // 测试是否通过正则表达式
              passed = inputRef.val.trim().length >= 6 && inputRef.val.trim().length <= 12
              break
            default:
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    // 监听器发起数据
    onMounted(() => {
      emitter.emit('form-item-created', validateInput())
    })
    return {
      inputRef,
      validateInput,
      updateValue
    }
  }
})
</script>

<style>
</style>
