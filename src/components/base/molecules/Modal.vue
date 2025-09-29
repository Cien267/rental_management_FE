<script setup lang="ts">
import { cn } from '@/helpers/utils'
import { onMounted, onUnmounted, computed } from 'vue'
import Button from '@/components/base/atoms/Button.vue'

const {
  containerClass = '',
  modalClass = '',
  backdropClass = '',
  enableBackdropClose = false,
  enableEscapeClose = false,
  title = '',
  position = 'center',
} = defineProps<{
  containerClass?: string
  modalClass?: string
  backdropClass?: string
  enableBackdropClose?: boolean
  enableEscapeClose?: boolean
  title?: string
  position?: 'center' | 'top'
}>()
const emit = defineEmits(['submit', 'close'])

const isShow = defineModel('show')
const positionClass = computed(() => {
  if (position === 'center') return 'flex-center p-4'
  return 'flex flex-col items-center py-10 px-4'
})
const closeModal = () => {
  isShow.value = false
  emit('close')
}

const submitModal = () => {
  emit('submit')
}

const handleBackdropClick = (event: MouseEvent) => {
  if (enableBackdropClose && event.target === event.currentTarget) {
    closeModal()
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (enableEscapeClose && event.key === 'Escape' && isShow.value) {
    closeModal()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isShow" :class="cn('fixed inset-0 z-1000', positionClass, containerClass)">
      <!-- backdrop -->
      <div
        :class="cn('fixed inset-0 bg-gray-1000 opacity-40', backdropClass)"
        @click="handleBackdropClick"
      ></div>
      <!-- end backdrop -->
      <Transition name="modal-transition" appear mode="out-in">
        <div
          :class="
            cn(
              'relative bg-white rounded-2xl shadow-lg w-full max-w-200 max-h-[calc(100vh-80px)] flex flex-col transition-all ease-in-out',
              modalClass,
            )
          "
        >
          <!-- header -->
          <div class="shrink-0">
            <slot name="header">
              <div class="flex items-start justify-between p-4 pl-6 border-b border-gray-200">
                <span class="text-lg font-semibold text-gray-900">
                  {{ title || 'Title' }}
                </span>
                <i
                  class="pi pi-times p-1.5 text-gray-700 cursor-pointer rounded-lg hover:bg-gray-50"
                  @click="closeModal"
                ></i>
              </div>
            </slot>
          </div>
          <!-- end header -->
          <div class="flex-1 overflow-y-auto">
            <slot name="body"> </slot>
          </div>

          <!-- footer -->
          <div class="shrink-0">
            <slot name="footer" :close="closeModal">
              <div class="flex justify-end p-4 border-only-top border-gray-75 gap-2">
                <Button type="info" @click="closeModal" size="m">Bỏ qua</Button>
                <Button type="primary" @click="submitModal" size="m">Lưu</Button>
              </div>
            </slot>
          </div>
          <!-- end footer -->
        </div>
      </Transition>
    </div>
  </Teleport>
</template>
