<template>
  <h1>{{display}}</h1>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'postdetail',
  setup() {
    const display = ref()
    /* 路由设置 */
    const route = useRoute()
    // 获取从路由前点击的id
    const currentId = route.params.id
    onMounted(() => {
      axios.get(`/posts/${currentId}`).then((resp) => {
        console.log(resp.data.data)
        display.value = resp.data.data.content
      })
    })
    return {
      currentId,
      display
    }
  }
})
</script>
