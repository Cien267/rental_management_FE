<script setup lang="ts">
import { cn } from '@/helpers/utils'
import { ref, computed, useSlots, nextTick } from 'vue'

const {
  containerClass = '',
  tooltipClass = '',
  arrowClass = '',
  position = 'top',
  disabled = false,
  content = '',
} = defineProps<{
  containerClass?: string
  tooltipClass?: string
  arrowClass?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  disabled?: boolean
  content?: string
}>()

const isVisible = ref(false)

const positionClasses = computed(() => {
  switch (position) {
    case 'top':
      return {
        tooltip: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
        arrow: 'bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45',
      }
    case 'bottom':
      return {
        tooltip: 'top-full mt-2 left-1/2 -translate-x-1/2',
        arrow: 'top-[-4px] left-1/2 -translate-x-1/2 rotate-45',
      }
    case 'left':
      return {
        tooltip: 'right-full mr-2 top-1/2 -translate-y-1/2',
        arrow: 'right-[-4px] top-1/2 -translate-y-1/2 rotate-45',
      }
    case 'right':
      return {
        tooltip: 'left-full ml-2 top-1/2 -translate-y-1/2',
        arrow: 'left-[-4px] top-1/2 -translate-y-1/2 rotate-45',
      }
    default:
      return {
        tooltip: 'bottom-full mb-2 left--1/2 -translate-x-1/2',
        arrow: 'bottom-[-4px] left-1/2 -translate-x-1/2 rotate-45',
      }
  }
})

const slots = useSlots()
const hasContent = computed(() => {
  return slots.content ? true : !!content?.trim()
})

const triggerRef = ref()
const tooltipRef = ref()
const contentStyle = ref()

const updatePosition = async () => {
  if (triggerRef.value) {
    await nextTick()
    const rect = triggerRef.value?.getBoundingClientRect()
    const tooltipRect = tooltipRef.value?.getBoundingClientRect() || { width: 0, height: 0 }

    const baseStyles = {
      position: 'absolute',
      zIndex: 1000001,
      maxWidth: '400px',
      height: 'fit-content',
    }

    let positionStyles = {}
    switch (position) {
      case 'top':
        positionStyles = {
          top: `${rect.top + window.scrollY - (tooltipRect.height + 8)}px`,
          left: '0px',
          insetInlineStart: `${rect.left + window.scrollX + rect.width / 2}px`,
        }
        break
      case 'bottom':
        positionStyles = {
          top: `${rect.top + window.scrollY + rect.height + 2}px`,
          left: '0px',
          insetInlineStart: `${rect.left + window.scrollX + rect.width / 2}px`,
        }
        break
      case 'left':
        positionStyles = {
          top: `${rect.top + window.scrollY + rect.height / 2 - 2}px`,
          left: '0px',
          insetInlineStart: `${rect.left + window.scrollX - tooltipRect.width}px`,
        }
        break
      case 'right':
      default:
        positionStyles = {
          top: `${rect.top + window.scrollY + rect.height / 2 - 2}px`,
          left: '0px',
          insetInlineStart: `${rect.right + window.scrollX}px`,
        }
        break
    }

    contentStyle.value = {
      ...baseStyles,
      ...positionStyles,
    }
  }
}
const showTooltip = async () => {
  if (!disabled && hasContent.value) {
    isVisible.value = true
    await nextTick()
    await updatePosition()
    await updatePosition()
  }
}

const hideTooltip = () => {
  isVisible.value = false
}
</script>

<template>
  <div
    :class="cn('relative inline-block', containerClass)"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <div ref="triggerRef">
      <slot name="trigger">
        <i class="ikr ik-circle-info cursor-pointer text-gray-400"></i>
      </slot>
    </div>

    <Teleport to="body">
      <div
        v-if="isVisible"
        ref="tooltipRef"
        :class="
          cn(
            'absolute z-9999999 bg-tooltip text-white text-xs font-medium rounded p-1.5 shadow-md max-w-64 break-words',
            positionClasses.tooltip,
            tooltipClass,
          )
        "
        :style="contentStyle"
      >
        <slot name="content">
          <span>{{ content }}</span>
        </slot>
        <div :class="cn('absolute w-2 h-2 bg-tooltip', positionClasses.arrow, arrowClass)"></div>
      </div>
    </Teleport>
  </div>
</template>
