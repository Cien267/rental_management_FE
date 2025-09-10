<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/helpers/utils'

const {
  containerClass = '',
  inputClass = '',
  label = '',
  disabled = false,
  error = false,
  errorMsg = '',
  name = '',
  radioValue = '',
} = defineProps<{
  containerClass?: string
  inputClass?: string
  label?: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
  name?: string
  radioValue?: string | number
}>()

const emit = defineEmits(['change', 'focus', 'blur'])

const value = defineModel<boolean | number | string>('value', { default: false })

const isChecked = computed(() => value.value === radioValue)
</script>

<template>
  <div :class="cn('relative', containerClass)">
    <label
      :class="
        cn(
          'flex items-center gap-2 text-sm text-gray-900',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )
      "
    >
      <input
        type="radio"
        v-model="value"
        :class="cn('absolute opacity-0 w-0 h-0', inputClass)"
        :disabled="disabled"
        :name="name"
        :value="radioValue"
        :checked="isChecked"
        @change="emit('change', $event)"
        @focus="emit('focus', $event)"
        @blur="emit('blur', $event)"
      />
      <i
        :class="
          cn(
            'text-base',
            isChecked ? 'iks ik-radio-selected text-blue-500' : 'ikr ik-radio-unselected',
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
