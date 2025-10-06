``
<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import type { Room } from '@/types/room'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import { computed, ref, watch } from 'vue'
import { INVOICE_STATUSES } from '@/constants/invoices'

const { rooms, selectedRoom, selectedDate, selectedStatus } = defineProps<{
  selectedRoom: any
  rooms: Room[]
  selectedDate: Date | null
  selectedStatus: string | null
}>()
const emit = defineEmits(['select-room', 'select-date', 'select-status'])

const roomOptions = computed(() => {
  const options = rooms
  const idxTotal = options.findIndex((o) => o.id === 0)
  if (idxTotal === -1)
    options.unshift({
      id: 0,
      name: 'Tất cả',
    } as any)
  return options
})

const getSeverityRoom = (room: any) => {
  if (selectedRoom && selectedRoom.id === room.id) return ''
  return 'secondary'
}

const filterStatus = ref<string | null>(selectedStatus)
const statuses = ref(
  Object.entries(INVOICE_STATUSES).map(([value, label]) => ({
    label,
    value,
  })),
)

const filterDate = ref(selectedDate)

watch(filterStatus, (newStatus) => {
  emit('select-status', newStatus)
})

watch(filterDate, (newDate) => {
  emit('select-date', newDate)
})
</script>

<template>
  <div class="font-bold text-xl text-gray-600">Chọn phòng:</div>
  <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
    <Button
      v-for="room in roomOptions"
      :key="room.id"
      icon="pi pi-home"
      :label="room.name"
      raised
      rounded
      size="large"
      class="w-full"
      :severity="getSeverityRoom(room)"
      @click="emit('select-room', room)"
    />
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="grid grid-cols-1 gap-4">
      <div class="font-bold text-xl text-gray-600">Ngày tháng:</div>
      <DatePicker
        v-model="filterDate"
        view="month"
        dateFormat="mm/yy"
        placeholder="Toàn thời gian"
        class="w-full"
        showClear
      />
    </div>
    <div class="grid grid-cols-1 gap-4">
      <div class="font-bold text-xl text-gray-600">Trạng thái:</div>
      <Select
        v-model="filterStatus"
        showClear
        :options="statuses"
        optionLabel="label"
        optionValue="value"
        placeholder="Tất cả trạng thái"
        class="w-full"
      />
    </div>
  </div>
  <Divider />
</template>
