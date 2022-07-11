<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar && column.avatar.url" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
        <h4>{{ column.title }}</h4>
        <p class="text-muted">{{ column.description }}</p>
      </div>
    </div>
    <post-list :list="list"></post-list>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/interface/interface'
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostList from '@/components/article/PostList.vue'
export default defineComponent({
  components: {
    PostList
  },
  setup() {
    /* 路由设置 */
    const route = useRoute()
    // 获取从路由前点击的id
    const currentId = route.params.id
    /* 从vuex中获取数据 */
    const store = useStore<GlobalDataProps>()
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', currentId)
    })
    // 获取testData数据,找出当前id的专栏，处理好数据传给组件渲染
    const column = computed(() => store.getters.getColumnById(currentId))
    // 找出当前id的文章细节数据
    const list = computed(() => store.getters.getPostsByCid(currentId))
    return {
      column,
      list
    }
  }
})
</script>
