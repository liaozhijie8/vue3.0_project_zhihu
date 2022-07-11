<template>
  <teleport to="#message">
    <div class="message-container">
      <div class="alert alert-dismissible fixed-top mt-5 fade show w-50 mx-auto" :class="classObject" role="alert">
        <span>{{ message }}</span>
        <button type="button" class="btn-close" @click.prevent="hide"></button>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import useDOMCreate from '@/hooks/useDOMCreate'
// 定义类型
export type MessageType = 'success' | 'error' | 'default'
export default defineComponent({
  name: 'message-info',
  props: {
    message: String,
    type: {
      type: String as PropType<MessageType>,
      default: 'default'
    }
  },
  /* 子传父信息 */
  emits: ['close-message'],
  setup(props, context) {
    /* 主页节点控制 */
    useDOMCreate('message')
    /* 控制显示开关 */
    const isVisible = ref()
    /* 提示框颜色类型选择 */
    const classObject = {
      'alert-success': props.type === 'success',
      'alert-danger': props.type === 'error',
      'alert-primary': props.type === 'default'
    }
    /* 发送事件 */
    const hide = () => {
      isVisible.value = false
      context.emit('close-message', false)
    }
    return {
      isVisible,
      hide,
      classObject
    }
  }
})
</script>
