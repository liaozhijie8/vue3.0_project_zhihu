<template>
  <div class="row">
    <div v-for="column in columnlist" :key="column._id" class="col-12 col-sm-6 col-xl-3 mb-4 text-center mt-2">
      <div class="card h-100 shadow-sm">
        <div class="card-body text-center">
          <!-- src 当url存在的时候替换 -->
          <img :src="column.avatar && column.avatar.url" class="card-img-top img-fluid" :alt="column.title" >
          <h5 class="card-title">{{ column.title }}</h5>
          <p class="card-text text-start">{{ column.description }}</p>
          <router-link :to="`/column/${column._id}`" class="btn btn-outline-primary">进入专栏</router-link>
        </div>
        <div class="card-footer">
          <small class="text-muted">Last updated 3 mins ago</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue'
// 导入定义props的接口
import { ColumnProps } from '@/interface/interface'
export default defineComponent({
  name: 'ColumnList',
  props: {
    // 接收一个父组件的传参
    list: {
      // 定义为一个数组类型，并断言，应用了一个接口
      type: Array as PropType<ColumnProps[]>,
      required: true
    }
  },
  // 传入props属性，重组数据
  setup(props) {
    // 计算属性是否有自带的头像图片
    const columnlist = computed(() => {
      // 取到list属性，进行处理
      return props.list.map(column => {
        if (!column.avatar) {
          column.avatar = {
            url: require('@/assets/logo.png')
          }
        }
        // 返回list中的处理属性
        return column
      })
    })
    // 向外返回一个setup属性，即list处理后的属性
    return {
      columnlist
    }
  }
})
</script>

<style scoped>
  .card-body img{
    height: 50px;
    width: 50px;
  }
</style>
