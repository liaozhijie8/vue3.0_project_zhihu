<template>
  <div class="create-post-page">
    <h4>新建文章</h4>
    <input type="file" name="file" @change.prevent="handleFileChange">
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
import { GlobalDataProps, PostProps } from '@/interface/interface'
import ValidateInput, { RulesProp } from '@/components/form/ValidateInput.vue'
import axios from 'axios'

export default defineComponent({
  name: 'createpost',
  components: {
    ValidateInput
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
    const onFormSubmit = () => {
      // 判断输入是否为空
      if (titleVal.value.trim() !== '' && contentVal.value.trim() !== '') {
        // 获取指定的id
        const { column } = store.state.user
        if (column) {
          // 填写改id下的参数对象
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column: column,
            createdAt: new Date().toLocaleString()
          }
          // vuex填入数据
          store.commit('createPost', newPost)
          // 跳转页面
          router.push({ name: 'column', params: { id: column } })
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
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      handleFileChange
    }
  }
})
</script>
