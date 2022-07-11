<template>
  <div class="home-page">
    <section class="py-5 text-center container">
      <div class="row py-lg-5">
        <div class="col-lg-6 col-md-8 mx-auto">
          <img src="../assets/callout.svg" alt="callout" class="w-50" />
          <h2 class="font-weight-light">随心写作，自由表达</h2>
          <p>
            <router-link to="/create" class="btn btn-primary my-2">开始写文章</router-link>
          </p>
        </div>
      </div>
    </section>
    <h4 class="font-weight-bold text-center">发现精彩</h4>
    <column-list :list="list"></column-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import ColumnList from '@/components/article/ColumnList.vue'
// store钩子函数
import { useStore } from 'vuex'
// 全局接口
import { GlobalDataProps } from '@/interface/interface'
import { computed } from '@vue/reactivity'
export default defineComponent({
  name: 'Home',
  components: {
    ColumnList
  },
  setup() {
    /* 从接口中读取数据 */
    onMounted(() => {
      store.dispatch('fetchColumns')
    })
    /* vuex读取数据 */
    const store = useStore<GlobalDataProps>()
    // 文章数据
    const list = computed(() => store.state.columns)
    return {
      list
    }
  }
})
</script>
