``
<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import type { Room } from '@/types/room'
import { computed } from 'vue'

const { rooms, selectedRoom } = defineProps<{
  selectedRoom: any
  rooms: Room[]
}>()
const emit = defineEmits(['select-room', 'select-meter-type'])

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
  <Divider />
</template>
