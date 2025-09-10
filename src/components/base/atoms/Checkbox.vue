<script setup lang="ts">
import { cn } from '@/helpers/utils'

const {
  containerClass = '',
  checkboxClass = '',
  label = '',
  disabled = false,
  error = false,
  errorMsg = '',
  trueValue = true,
  falseValue = false,
} = defineProps<{
  containerClass?: string
  checkboxClass?: string
  label?: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
  trueValue?: boolean | number | string
  falseValue?: boolean | number | string
}>()

const emit = defineEmits(['change', 'focus', 'blur'])

const value = defineModel<boolean | number | string>('value', { default: false })
</script>

<template>
  <div :class="cn('relative', containerClass)">
    <label
      :class="
        cn(
          'inline-flex items-center gap-2 text-sm text-gray-900',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )
      "
    >
      <input
        type="checkbox"
        v-model="value"
        :class="cn('absolute opacity-0 w-0 h-0', checkboxClass)"
        :disabled="disabled"
        :true-value="trueValue"
        :false-value="falseValue"
        @change="emit('change', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <i
        :class="
          cn(
            'text-base',
            value && value === trueValue
              ? 'iks ik-checkbox-selected text-blue-500'
              : 'ikr ik-checkbox-unselected',
            disabled ? 'text-gray-400' : '',
            error ? 'text-red-500' : '',
          )
        "
      ></i>
      <slot name="label" v-if="$slots.label"></slot>
      <span
        v-else-if="label"
        :class="[error && errorMsg ? 'text-red-500' : '', 'text-sm text-gray-900']"
        >{{ label }}</span
      >
    </label>
    <span class="block mt-1 text-red-500 text-xs" v-if="error && errorMsg">{{ errorMsg }}</span>
  </div>
</template>
