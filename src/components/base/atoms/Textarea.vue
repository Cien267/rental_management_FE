<script setup lang="ts">
import { cn } from '@/helpers/utils'
import { ref, watch, nextTick } from 'vue'

const {
  containerClass = '',
  textareaClass = '',
  placeholder = '',
  disabled = false,
  error = false,
  errorMsg = '',
  rows = 3,
  resize = 'none',
  enableAutoResize = false,
} = defineProps<{
  containerClass?: string
  textareaClass?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
  rows?: number
  resize?: '' | 'none' | 'x' | 'y'
  enableAutoResize?: boolean
}>()

const emit = defineEmits(['input', 'focus', 'blur', 'keydown', 'keyup', 'keypress'])

const value = defineModel<string>('value', { default: '' })

// handle auto resize if enabled
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  if (enableAutoResize && textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight + 10}px`
  }
}

watch(value, () => {
  nextTick(() => autoResize())
})

watch(
  () => enableAutoResize,
  (newVal) => {
    if (newVal) {
      nextTick(() => autoResize())
    }
  },
  { immediate: true },
)
</script>

<template>
  <div :class="cn('relative', containerClass)">
    <textarea
      ref="textareaRef"
      :class="
        cn(
          'block w-full min-h-8 rounded-lg border outline-none border-solid p-1 pl-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500',
          disabled ? 'bg-gray-50 border-gray-50 cursor-not-allowed' : 'border-gray-150 bg-white',
          error ? 'border-red-500 focus:border-red-500' : '',
          resize ? `resize-${resize}` : 'resize',
          textareaClass,
        )
      "
      v-model="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="rows"
      @input="emit('input', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @keydown="emit('keydown', $event)"
      @keyup="emit('keyup', $event)"
      @keypress="emit('keypress', $event)"
    />
    <span class="absolute left-0 top-full text-red-500 text-xs" v-if="error && errorMsg">{{
      errorMsg
    }}</span>
  </div>
</template>
