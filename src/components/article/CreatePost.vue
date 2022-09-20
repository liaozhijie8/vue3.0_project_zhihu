<template>
  <div class="create-post-page">
    <h4 class="text-center">新建文章</h4>
    <Uploader action="/upload"
      class="bg-light text-secondary w-100 my-4 d-flex align-items-center justify-content-center"
      @file-uploaded="handleFileUploaded" :before-upload="uploadCheck">
      <!-- 默认的slot -->
      <h2>点击上传头图</h2>
      <!-- 正在上传的slot -->
      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <h2>正在上传</h2>
        </div>
      </template>
      <!-- 上传完成的slot -->
      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url">
      </template>
    </Uploader>
    <div class="mb-3">
      <label class="form-label" for="titleForm">文章标题：</label>
      <ValidateInput :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" lable-form="titleForm">
      </ValidateInput>
    </div>
    <div class="mb-3">
      <label class="form-label" for="detailForm">文章详情：</label>
      <validate-input rows="10" type="text" tag="textarea" placeholder="请输入文章详情" :rules="contentRules"
        v-model="contentVal" lable-form="detailForm" />
    </div>
    <button class="btn btn-primary btn-large" @click.prevent="onFormSubmit">发表文章</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { GlobalDataProps, ImageProps, PostProps, ResponseType } from '@/interface/interface'
import ValidateInput, { RulesProp } from '@/components/form/ValidateInput.vue'
import Uploader from '@/components/article/Uploader.vue'
// 消息提示组件函数
import createMessage from '@/hooks/createMessage'
// 上传检查条件
import { beforeUploadCheck } from '@/helper'
import axios from 'axios'

export default defineComponent({
  name: 'createpost',
  components: {
    ValidateInput,
    Uploader
  },
  setup() {
    // 响应式获取当前输入框的数值
    const titleVal = ref('')
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    // 判断规则
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    /* 发送数据给服务器 */
    let imageId = ''
    const handleFileUploaded = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }
    const onFormSubmit = () => {
      // 判断输入是否为空
      if (titleVal.value.trim() !== '' && contentVal.value.trim() !== '') {
        // 获取指定的id
        const { column, _id } = store.state.user
        if (column) {
          // 填写改id下的参数对象
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column: column,
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }
          // 填入数据
          store.dispatch('createPost', newPost).then(() => {
            createMessage('发表成功,2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const handleFileChange = (e: Event) => {
      // as 断言
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((resp: any) => {
          console.log(resp)
        })
      }
    }
    /*  上传文件检测函数 */
    // 子组件的成功的emit函数
    const onFileUploaded = (val: ResponseType) => {
      createMessage(`上传图片id ${val.data._id}`, 'success', 2000)
    }
    /* 上传检查 */
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是JPG/PNG格式！', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不超过1Mb', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      handleFileChange,
      onFileUploaded,
      uploadCheck,
      handleFileUploaded
    }
  }
})
</script>
<style lang="less">
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
