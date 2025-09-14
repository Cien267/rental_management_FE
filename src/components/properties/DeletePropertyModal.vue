<template>
  <Modal
    v-model:show="isShow"
    title="Xóa nhà trọ"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
    @submit="handleConfirm"
    @close="handleCancel"
  >
    <template #body>
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <i class="pi pi-exclamation-triangle text-red-600 text-xl"></i>
          </div>
          <div>
            <div class="text-lg font-semibold text-gray-900">Xác nhận xóa nhà trọ</div>
            <div class="text-sm text-gray-500">Hành động này không thể hoàn tác</div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-4">
          <div class="flex items-start gap-3">
            <div v-if="property?.image" class="w-16 h-16 rounded-lg overflow-hidden">
              <img :src="property.image" :alt="property.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
              <i class="pi pi-image text-gray-400 text-xl"></i>
            </div>
            <div class="flex-1">
              <span class="font-bold text-gray-900">{{ property?.name }}</span>
              <p class="text-sm text-gray-500">{{ property?.address }}</p>
              <p class="text-xs text-gray-400">Mã: {{ property?.code }}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">
            <strong>Bạn có chắc chắn muốn xóa nhà trọ "{{ property?.name }}" không?</strong>
          </p>
          <p class="text-xs text-red-600 mt-1">
            Tất cả dữ liệu liên quan đến nhà trọ này như phòng, người thuê, hợp đồng,... sẽ bị xóa
            vĩnh viễn và không thể khôi phục.
          </p>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end p-4 border-t border-gray-200 gap-3">
        <Button label="Hủy" severity="secondary" @click="close" />
        <Button label="Xóa nhà trọ" severity="danger" :loading="loading" @click="handleConfirm" />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import type { PropertyUI } from '@/types/property'

interface Props {
  property?: PropertyUI | null
}

const props = withDefaults(defineProps<Props>(), {
  property: null,
})

const emit = defineEmits<{
  'confirm-delete': [property: PropertyUI]
  'cancel-delete': []
}>()

const isShow = ref(false)
const loading = ref(false)

function handleConfirm() {
  if (props.property) {
    emit('confirm-delete', props.property)
  }
}

function handleCancel() {
  emit('cancel-delete')
  isShow.value = false
}

// Expose methods for parent components
defineExpose({
  open: () => {
    isShow.value = true
  },
  close: () => {
    isShow.value = false
  },
  setLoading: (value: boolean) => {
    loading.value = value
  },
})
</script>

<style scoped></style>
