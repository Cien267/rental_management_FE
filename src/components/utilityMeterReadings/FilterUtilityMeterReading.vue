<script setup lang="ts">
import Carousel from 'primevue/carousel'
import Button from 'primevue/button'
import type { Room } from '@/types/room'
import type { UtilityMeter, MeterType } from '@/types/utilityMeter'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import { ref, computed } from 'vue'

const { rooms, selectedRoom, selectedUtilityMeter, utilityMeterSettings } = defineProps<{
  selectedRoom: any
  rooms: Room[]
  selectedUtilityMeter: UtilityMeter | null
  utilityMeterSettings?: UtilityMeter[] | null
}>()
const emit = defineEmits(['select-room', 'select-meter-type'])

const responsiveOptions = ref([
  {
    breakpoint: '1400px',
    numVisible: 6,
    numScroll: 3,
  },
  {
    breakpoint: '1199px',
    numVisible: 5,
    numScroll: 3,
  },
  {
    breakpoint: '767px',
    numVisible: 4,
    numScroll: 2,
  },
  {
    breakpoint: '575px',
    numVisible: 3,
    numScroll: 1,
  },
])

const roomOptions = computed(() => {
  const options = rooms
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
  <Carousel
    :value="roomOptions"
    :numVisible="6"
    :numScroll="3"
    :responsiveOptions="responsiveOptions"
  >
    <template #item="{ data }">
      <div class="m-6">
        <Button
          icon="pi pi-home"
          :label="data.name"
          raised
          rounded
          size="large"
          class="w-full"
          :severity="getSeverityRoom(data)"
          @click="emit('select-room')"
        />
      </div>
    </template>
  </Carousel>
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
</template>
