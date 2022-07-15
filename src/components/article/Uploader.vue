<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload">
      <slot v-if="fileStatus === 'loading'" name="loading">
        <button class="btn btn-primary" disabled>正在上传</button>
      </slot>
      <slot v-else-if="fileStatus === 'success'" name="uploaded">
        <button class="btn btn-primary" disabled>上传成功</button>
      </slot>
      <slot v-else name="default">
        <button class="btn btn-primary">点击上传</button>
      </slot>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
  </div>
</template>
<script lang="ts">
import axios from 'axios'
import { defineComponent, PropType, ref } from 'vue'
// 上传状态
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
  name: 'uploader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    }
  },
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup(props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>('ready')
    // 点击上传触发隐藏的上传input
    const triggerUpload = () => {
      if (fileInput.value) {
        // 点击input
        fileInput.value.click()
      }
    }
    // 处理上传文件
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        // 把files转换为数组类型
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            // 清空数据，解决触发change引起的bug,可以一直上传同一张错误信息报错
            if (fileInput.value) {
              fileInput.value.value = ''
            }
            return
          }
        }
        fileStatus.value = 'loading'
        // 新建一个FormData类型
        const formData = new FormData()
        // 将数据存进去
        formData.append('file', files[0])
        /*  发送请求服务器 */
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((resp: any) => {
          fileStatus.value = 'success'
          context.emit('file-uploaded', resp.data)
          console.log(resp)
        }).catch((error) => {
          fileStatus.value = 'error'
          context.emit('file-uploaded-error', { error })
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange
    }
  }
})
</script>
