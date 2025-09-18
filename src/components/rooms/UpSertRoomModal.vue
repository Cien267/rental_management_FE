<template>
  <Modal
    v-model:show="isShow"
    :title="isEdit ? 'Chỉnh sửa phòng' : 'Thêm phòng mới'"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <template #body>
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Tên phòng <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="formData.name"
              placeholder="Nhập tên phòng"
              class="w-full"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tầng</label>
            <InputNumber v-model="formData.floor" :min="0" :max="100" class="w-full" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Diện tích (m²)</label>
            <InputNumber v-model="formData.area" :min="0" :max="1000" :step="1" class="w-full" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Giá (VNĐ) <span class="text-red-500">*</span></label
            >
            <InputNumber
              v-model="formData.price"
              :min="0"
              :step="10000"
              class="w-full"
              :class="{ 'border-red-500': errors.price }"
            />
            <p v-if="errors.price" class="text-sm text-red-500">{{ errors.price }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Trạng thái</label>
            <Select
              v-model="formData.status"
              :options="statusOptions"
              option-label="label"
              option-value="value"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Số người tối đa</label>
            <InputNumber v-model="formData.maxOccupants" :min="1" :max="10" class="w-full" />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Tiện nghi</label>
          <Textarea
            v-model="formData.amenities"
            rows="3"
            class="w-full"
            placeholder="Mô tả tiện nghi phòng"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Ghi chú</label>
          <Textarea v-model="formData.note" rows="3" class="w-full" />
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end p-4 border-t border-gray-200 gap-3">
        <Button label="Hủy" severity="secondary" @click="close" />
        <Button :label="isEdit ? 'Cập nhật' : 'Tạo mới'" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import type { Room, CreateRoomInput, UpdateRoomInput } from '@/types/room'
import { RoomStatusEnum } from '@/types/room'
import { createRoom, updateRoom } from '@/services/api/roomService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import { ROOM_STATUSES } from '@/constants/rooms'

const { tError } = useCustomToast()

interface Props {
  propertyId: number
  room?: Room | null
}

const props = withDefaults(defineProps<Props>(), {
  room: null,
})

const emit = defineEmits<{ 'room-saved': []; 'room-updated': [] }>()

const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const isEdit = computed(() => !!props.room)

const statusOptions = Object.entries(ROOM_STATUSES).map(([value, label]) => ({ label, value }))

const formData = ref<CreateRoomInput | UpdateRoomInput>({
  propertyId: props.propertyId,
  name: '',
  price: 0,
  status: RoomStatusEnum.Enum.available,
  floor: undefined,
  area: undefined,
  amenities: '',
  maxOccupants: 1,
  note: '',
})

watch(
  () => props.room,
  (room) => {
    if (room) {
      formData.value = { ...room, id: room.id }
    } else {
      formData.value = {
        propertyId: props.propertyId,
        name: '',
        price: 0,
        status: RoomStatusEnum.Enum.available,
        floor: undefined,
        area: undefined,
        amenities: '',
        maxOccupants: 1,
        note: '',
      }
    }
    errors.value = {}
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}
  if (!formData.value.name?.trim()) errors.value.name = 'Tên phòng không được để trống'
  if (formData.value.price === undefined || Number(formData.value.price) <= 0)
    errors.value.price = 'Giá phòng phải lớn hơn 0'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload: any = { ...formData.value }
    if (isEdit.value) {
      await updateRoom((formData.value as UpdateRoomInput).id!, payload, props.propertyId)
      emit('room-updated')
    } else {
      await createRoom(payload as CreateRoomInput, props.propertyId)
      emit('room-saved')
    }
    isShow.value = false
  } catch (e: any) {
    console.error('Save room error:', e)
    const eMsg = e?.response?.data?.message ?? 'Lỗi khi lưu phòng'
    tError('Lỗi', eMsg)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  isShow.value = false
  errors.value = {}
}

defineExpose({
  open: () => (isShow.value = true),
  close: () => (isShow.value = false),
})
</script>

<style scoped></style>
