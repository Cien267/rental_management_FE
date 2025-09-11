<script setup lang="ts">
import { computed } from 'vue'
defineOptions({
  inheritAttrs: false,
})

const {
  title = '',
  content = '',
  type = 'success',
} = defineProps<{
  title?: string
  content?: string
  type?: 'success' | 'error' | 'warning' | 'info'
}>()

const MAPPING_COLOR: { [key: string]: string } = {
  ['success']: 'green',
  ['error']: 'red',
  ['warning']: 'orange',
  ['info']: 'blue',
}
const customColorClass = computed(() => {
  return MAPPING_COLOR[type]
})
</script>

<template>
  <div class="w-full relative max-w-84 break-words">
    <div :class="`text-sm font-semibold text-${customColorClass}-800`" v-html="title"></div>
    <div :class="`text-sm text-${customColorClass}-700`" v-html="content"></div>
    <i
      @click="$emit('close-toast')"
      :class="`pi pi-times absolute cursor-pointer right-0 top-0 text-${customColorClass}-700`"
    ></i>
  </div>
</template>
