<template>
  <Modal
    v-model:show="isShow"
    :title="`Xác nhận xóa ${props.prefix}`"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
    modalClass="w-110"
  >
    <template #body>
      <div class="p-6 text-gray-700">
        Bạn có chắc chắn muốn xóa {{ props.prefix }}
        <span class="font-semibold">{{ props.data?.[props.nameKey] }}</span
        >?
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

interface Props {
  data?: any | null
  nameKey?: string
  prefix?: string
}
const props = withDefaults(defineProps<Props>(), { data: null, nameKey: 'name', prefix: '' })
const emit = defineEmits<{ 'confirm-delete': any; 'cancel-delete': [] }>()

const isShow = ref(false)
const loading = ref(false)

watch(
  () => props.data,
  (val) => {
    if (val) isShow.value = true
  },
)

function confirm() {
  if (props.data) emit('confirm-delete', props.data)
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
