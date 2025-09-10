<template>
  <button :class="cn(buttonClasses, customClass)">
    <template v-if="posIcon === 'left'">
      <slot name="icon">
        <i v-if="classIcon" :class="cn('mr-1', classIcon)"></i>
      </slot>
    </template>
    <span class="max-w-full truncate">
      <slot />
    </span>
    <template v-if="posIcon === 'right'">
      <slot name="icon">
        <i v-if="classIcon" :class="classIcon" class="ml-1"></i>
      </slot>
    </template>
    <template v-if="loading">
      <slot name="loading-icon">
        <i v-if="classLoadingIcon" :class="classLoadingIcon" class="ml-1"></i>
      </slot>
    </template>
  </button>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed } from 'vue'
import { cn } from '@/helpers/utils'

const props = defineProps({
  type: {
    type: String as PropType<'primary' | 'success' | 'warning' | 'danger' | 'info'>,
    default: 'info',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  classLoadingIcon: {
    type: String,
    default: null,
  },
  outline: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<'s' | 'm' | 'l' | 'xl'>,
    default: 'm',
  },
  classIcon: {
    type: String,
    default: null,
  },
  posIcon: {
    type: String as PropType<'left' | 'right'>,
    default: 'right',
  },
})
const BASE_CLASSES =
  'inline-flex items-center border border-solid justify-center font-bold transition-all duration-200 outline-none box-border'

const SIZE_STYLES = {
  s: {
    default: 'px-2.5 py-1 text-xs  h-6',
    rounded: 'rounded-md',
  },
  m: {
    default: 'px-3 py-1.5  text-sm h-8',
    rounded: 'rounded-lg',
  },
  l: {
    default: 'px-3.5 py-2 text-base h-10',
    rounded: 'rounded-lg',
  },
  xl: {
    default: 'px-4 py-2.5 text-lg h-12',
    rounded: 'rounded-lg',
  },
}

const TYPE_STYLES = {
  primary: {
    solid: 'bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 text-white border-none',
    outline: 'bg-white hover:bg-blue-50 focus:bg-blue-100 text-blue-500 border-blue-500',
    disabled: {
      solid: 'bg-blue-200 text-white border-none',
      outline: 'bg-white border-blue-200 text-blue-200',
    },
  },
  success: {
    solid: 'bg-green-500 hover:bg-green-600 focus:bg-green-700 text-white border-none',
    outline: 'bg-white hover:bg-green-50 focus:bg-green-100 text-green-500 border-green-500',
    disabled: {
      solid: 'bg-green-200 text-white border-none',
      outline: 'bg-white border-green-200 text-green-200',
    },
  },
  warning: {
    solid: 'bg-orange-500 hover:bg-orange-600 focus:bg-orange-700 text-white border-none',
    outline: 'bg-white hover:bg-orange-50 focus:bg-orange-100 text-orange-500 border-orange-500',
    disabled: {
      solid: 'bg-orange-200 text-white border-none',
      outline: 'bg-white border-orange-200 text-orange-200',
    },
  },
  danger: {
    solid: 'bg-red-500 hover:bg-red-600 focus:bg-red-700 text-white border-none',
    outline: 'bg-white hover:bg-red-50 focus:bg-red-100 text-red-500 border-red-500',
    disabled: {
      solid: 'bg-red-200 text-white border-none',
      outline: 'bg-white border-red-200 text-red-200',
    },
  },
  info: {
    solid: 'bg-white text-gray-700 border-gray-150 hover:bg-gray-50 focus:bg-gray-100',
    outline: '',
    disabled: {
      solid: 'bg-white border-gray-150 text-gray-200',
      outline: '',
    },
  },
}

const buttonClasses = computed(() => {
  const typeConfig = TYPE_STYLES?.[props.type] || TYPE_STYLES.info

  const variant = props.outline ? 'outline' : 'solid'

  const typeClass = props.disabled ? typeConfig.disabled[variant] : typeConfig[variant]

  const sizeStyle = SIZE_STYLES?.[props.size] || SIZE_STYLES.m

  const rounded = props.rounded ? 'rounded-full' : sizeStyle.rounded

  return [BASE_CLASSES, typeClass, sizeStyle.default, rounded]
})
</script>
