<template>
  <Modal
    v-model:show="isShow"
    title="Xác nhận xóa phòng"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
  >
    <template #body>
      <div class="p-6">
        <p class="text-sm text-gray-700">
          Bạn có chắc chắn muốn xóa phòng <span class="font-semibold">{{ room?.name }}</span
          >?
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end p-4 border-t border-gray-200 gap-3">
        <Button label="Hủy" severity="secondary" @click="close" />
        <Button label="Xóa" severity="danger" :loading="loading" @click="confirm" />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import type { Room } from '@/types/room'

interface Props {
  room?: Room | null
}
const props = withDefaults(defineProps<Props>(), { room: null })

const emit = defineEmits<{ 'confirm-delete': [room: Room]; 'cancel-delete': [] }>()

const isShow = ref(false)
const loading = ref(false)

watch(
  () => props.room,
  (val) => {
    if (val) isShow.value = true
  },
)

function confirm() {
  if (props.room) emit('confirm-delete', props.room)
}
function close() {
  isShow.value = false
  emit('cancel-delete')
}

defineExpose({
  open: () => (isShow.value = true),
  close: () => (isShow.value = false),
  setLoading: (v: boolean) => (loading.value = v),
})
</script>

<style scoped></style>
