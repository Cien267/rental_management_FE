``
<script setup lang="ts">
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import type { Room } from '@/types/room'
import type { UtilityMeter, MeterType } from '@/types/utilityMeter'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import { computed } from 'vue'

const { rooms, selectedRoom, selectedUtilityMeter, utilityMeterSettings } = defineProps<{
  selectedRoom: any
  rooms: Room[]
  selectedUtilityMeter: UtilityMeter | null
  utilityMeterSettings?: UtilityMeter[] | null
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

const meterTypeOptions = computed(() => {
  if (!selectedRoom || !selectedRoom.id) return []
  return utilityMeterSettings
    ?.filter((u) => u.roomId === selectedRoom.id)
    ?.map((item) => {
      return {
        value: item.id,
        label: UTILITY_METER_TYPES[item.meterType as MeterType],
      }
    })
})

const getSeverityRoom = (room: any) => {
  if (selectedRoom.id === room.id) return ''
  return 'secondary'
}

const getSeverityMeterType = (meterType: { value: number; label: string }) => {
  if (selectedUtilityMeter?.id === meterType.value) return ''
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
      @click="emit('select-room')"
    />
  </div>
  <div class="font-bold text-xl text-gray-600">Chọn loại:</div>
  <div v-if="!selectedRoom || !selectedRoom.id" class="text-base text-gray-200 font-normal">
    Vui lòng chọn phòng
  </div>
  <div v-else>
    <template v-for="option in meterTypeOptions" :key="option.value">
      <Button
        icon="pi pi-home"
        :label="option.label"
        raised
        rounded
        size="large"
        class="w-full"
        :severity="getSeverityMeterType(option)"
        @click="emit('select-meter-type')"
      />
    </template>
  </div>
  <Divider />
</template>
