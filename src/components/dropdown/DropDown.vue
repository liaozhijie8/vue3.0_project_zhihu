<template>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
      你好 {{user.nickName}}
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
      <slot></slot>
    </ul>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'DropDown',
  props: {
    user: {
      type: Object,
      required: true
    }
  }
})
</script>

<style>
</style>
