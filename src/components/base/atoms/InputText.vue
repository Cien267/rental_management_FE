<script setup lang="ts">
import { cn } from '@/helpers/utils'

const {
  containerClass = '',
  inputClass = '',
  placeholder = '',
  disabled = false,
  error = false,
  errorMsg = '',
  useClearIcon = false,
  minLength = undefined,
  maxLength = undefined,
} = defineProps<{
  containerClass?: string
  inputClass?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
  useClearIcon?: boolean
  minLength?: number
  maxLength?: number
}>()

const emit = defineEmits(['input', 'focus', 'blur', 'keydown', 'keyup', 'keypress'])

const value = defineModel('value')

const handleClearInput = () => {
  value.value = ''
}
</script>

<template>
  <div :class="cn('relative', containerClass)">
    <input
      type="text"
      :class="
        cn(
          'block w-full min-h-8 rounded-lg border outline-none border-solid p-1 pl-2 text-sm text-gray-900 focus:outline-none focus:border-blue-500',
          disabled ? 'bg-gray-50 border-gray-50 cursor-not-allowed' : 'border-gray-150 bg-white',
          error ? 'border-red-500 focus:border-red-500' : '',
          inputClass,
        )
      "
      v-model="value"
      :disabled="disabled"
      :placeholder="placeholder"
      :minlength="minLength"
      :maxlength="maxLength"
      @input="emit('input', $event)"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @keydown="emit('keydown', $event)"
      @keyup="emit('keyup', $event)"
      @keypress="emit('keypress', $event)"
    />
    <i
      v-if="useClearIcon && value"
      class="iks ik-circle-xmark text-gray-400 absolute top-1/2 -translate-y-1/2 right-2 cursor-pointer"
      @click="handleClearInput"
    ></i>
    <span class="absolute left-0 top-full text-red-500 text-xs" v-if="error && errorMsg">{{
      errorMsg
    }}</span>
  </div>
</template>
