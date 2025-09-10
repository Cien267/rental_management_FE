<script setup lang="ts">
import { cn } from '@/helpers/utils'
import { ref, useId, computed, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from '@/helpers/utils'

const {
  containerClass = '',
  menuClass = '',
  items = [],
  position = 'bottom-left',
  itemLabel = '',
} = defineProps<{
  containerClass?: string
  menuClass?: string
  items?: Array<any>
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  itemLabel?: string
}>()

const isOpen = ref(false)
const menuRef = ref()
const triggerRef = ref()
const menuStyle = ref()

const updatePosition = () => {
  if (triggerRef.value) {
    const rect = triggerRef.value.getBoundingClientRect()
    menuStyle.value = {
      top: `${rect.bottom + window.scrollY}px`,
      left: `0px`,
      insetInlineStart: `${rect.left + window.scrollX}px`,
      minWidth: `${rect.width}px`,
      position: 'absolute',
      zIndex: 1000001,
      transformOrigin: 'center top',
    }
  }
}

const debounceUpdaterPosition = debounce(updatePosition, 200)
onMounted(() => {
  window.addEventListener('resize', debounceUpdaterPosition)
  window.addEventListener('scroll', debounceUpdaterPosition)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', debounceUpdaterPosition)
  window.removeEventListener('scroll', debounceUpdaterPosition)
})
const toggleMenu = () => {
  isOpen.value = !isOpen.value
  updatePosition()
}

const handleItemClick = (item: any) => {
  if (item.action) {
    item.action()
    isOpen.value = false
  }
}

const clickOutside = () => {
  isOpen.value = false
}

const positionClasses = computed(() => {
  switch (position) {
    case 'top-left':
      return 'bottom-full mb-2 left-0'
    case 'top-right':
      return 'bottom-full mb-2 right-0'
    case 'bottom-left':
      return 'top-full mt-2 left-0'
    case 'bottom-right':
      return 'top-full mt-2 right-0'
    default:
      return 'top-full mt-2 left-0'
  }
})

const componentId = computed(() => {
  return `${useId()}-menu`
})
</script>

<template>
  <div
    :class="cn('relative inline-block', containerClass)"
    v-click-outside="clickOutside"
    :data-teleport-id="componentId"
  >
    <div ref="triggerRef" @click="toggleMenu">
      <slot name="trigger" :isOpen="isOpen">
        <button>Menu</button>
      </slot>
    </div>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        :data-teleport-from="componentId"
        :class="
          cn(
            'absolute z-999999 bg-white shadow-block rounded-lg py-2 overflow-x-hidden overflow-y-auto max-h-60',
            positionClasses,
            menuClass,
          )
        "
        :style="menuStyle"
      >
        <template v-if="!$slots.item && items.length">
          <div
            v-for="(item, index) in items"
            :key="index"
            :class="[
              'bg-gray-0 hover:bg-gray-50 relative py-2 px-4 min-h-9 cursor-pointer pr-8 break-words',
            ]"
            @click="handleItemClick(item)"
          >
            {{ item && itemLabel ? (item[itemLabel] ?? '') : '' }}
          </div>
        </template>
        <template v-else>
          <slot name="item" :items="items" :close="() => (isOpen = false)"></slot>
        </template>
      </div>
    </Teleport>
  </div>
</template>
