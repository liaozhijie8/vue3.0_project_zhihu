<template>
  <li class="dropdown-option" :class="{'is-disabled':disabled}">
    <slot></slot>
  </li>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style lang='less'>
.dropdown-option.is-disabled * {
  color:red;
  pointer-events: none;
  background-color: transparent;
}
</style>
