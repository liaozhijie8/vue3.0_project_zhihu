<template>
  <div class="post-list">
    <article v-for="post in list" :key="post._id" class="card mb-3 shadow-sm">
      <!-- 为每张卡片绑定一个点击事件路由 -->
      <div class="card-body" @click="toPostDetail(post._id)">
        <h4>{{ post.title }}</h4>
        <span>{{ post._id }}</span>
        <div class="row my-3 align-items-center">
          <div v-if="post.image && typeof post.image !== 'string'" class="col-3">
            <img :src="post.image.url" :alt="post.title" class="rounded-lg w-100">
          </div>
          <p :class="{ 'col-9': post.image }">{{ post.excerpt }}</p>
        </div>
        <span class="text-muted">{{ post.createdAt }}</span>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { PostProps } from '@/interface/interface'
import router from '@/router/router'

export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  },
  setup() {
    const toPostDetail = (id:any) => {
      router.push(`/postdetail/${id}`)
    }
    return {
      toPostDetail
    }
  }
})
</script>
<style lang="less" scoped>
.card-body{
  cursor: pointer;
}
</style>
