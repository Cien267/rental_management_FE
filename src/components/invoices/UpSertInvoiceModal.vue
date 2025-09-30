<template>
  <Modal
    v-model:show="isShow"
    :title="isEdit ? 'Chỉnh sửa số đo' : 'Thêm số đo mới'"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
    :modalClass="selectedModeTab === 'multiple' ? 'max-w-3/4' : ''"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <template #body>
      <div class="p-6 space-y-4">
        <Tabs v-model:value="selectedModeTab">
          <TabList>
            <Tab value="single">Từng phòng</Tab>
            <Tab value="multiple" :disabled="isEdit">Hàng loạt</Tab>
          </TabList>
          <TabPanels>
            <TabPanel value="single">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Phòng <span class="text-red-500">*</span></label
                  >
                  <Select
                    v-model="formData.roomId"
                    :options="roomOptions"
                    option-label="name"
                    option-value="id"
                    placeholder="Chọn phòng"
                    class="w-full"
                    :class="{ 'border-red-500': errors.roomId }"
                  />
                  <p v-if="errors.roomId" class="text-sm text-red-500">{{ errors.roomId }}</p>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Loại công tơ</label>
                  <Select
                    v-model="formData.utilityMeterId"
                    :options="utilityMeterOptions"
                    option-label="label"
                    option-value="value"
                    :disabled="!formData.roomId"
                    placeholder="Chọn loại công tơ"
                    class="w-full"
                  />
                  <p v-if="errors.utilityMeterId" class="text-sm text-red-500">
                    {{ errors.utilityMeterId }}
                  </p>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Ngày nhập số đo</label>
                  <DatePicker
                    dateFormat="dd/mm/yy"
                    v-model="formData.readingDate as Date"
                    placeholder="Ngày nhập số đo"
                    class="w-full"
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Giá trị</label>
                  <InputNumber v-model="formData.value" :min="0" class="w-full" />
                </div>
              </div>
            </TabPanel>
            <TabPanel value="multiple">
              <DataTable :value="formDataTable" scrollable scrollHeight="500px">
                <Column field="" header="Phòng">
                  <template #body="{ data }">{{ data.room.name }} </template>
                </Column>
                <Column field="" header="Số đo">
                  <template #body="{ data }">
                    <div class="mb-2" v-for="(value, index) in data.values" :key="index">
                      <div class="flex gap-2 items-center justify-start">
                        <span class="inline mr-2 w-1/3">{{
                          getMeterName(data.utilityMeters, value.utilityMeterId)
                        }}</span
                        ><InputNumber v-model="value.value" :min="0" />
                      </div>
                    </div>
                  </template>
                </Column>
                <Column field="" header="Ngày nhập">
                  <template #body="{ data }">
                    <DatePicker
                      dateFormat="dd/mm/yy"
                      v-model="data.readingDate as Date"
                      placeholder="Ngày nhập số đo"
                      class="w-full"
                    />
                  </template>
                </Column>
              </DataTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
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
import { ref, computed, watch, onUpdated } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import type {
  UtilityMeterReading,
  CreateUtilityMeterReadingInput,
  UpdateUtilityMeterReadingInput,
} from '@/types/utilityMeterReading'
import type { Room } from '@/types/room'
import {
  createUtilityMeterReading,
  updateUtilityMeterReading,
  createMultipleUtilityMeterReading,
} from '@/services/api/utilityMeterReadingService'
import { useCustomToast } from '@/composables/base/useCustomToast'
import type { UtilityMeter } from '@/types/utilityMeter'
import type { MeterType } from '@/types/utilityMeter'
import { UTILITY_METER_TYPES } from '@/constants/utilityMeters'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const { tError } = useCustomToast()

interface Props {
  propertyId: number
  utilityMeterReading?: UtilityMeterReading | null
  rooms?: Room[] | null
  utilityMeterSettings?: UtilityMeter[] | null
}

const props = withDefaults(defineProps<Props>(), {
  utilityMeterReading: null,
  rooms: null,
})

const emit = defineEmits<{
  'utility-meter-reading-saved': []
  'utility-meter-reading-updated': []
}>()

const selectedModeTab = ref('single')
const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const isEdit = computed(() => !!props.utilityMeterReading)

const roomOptions = computed(() => props.rooms || [])
const utilityMeterOptions = computed(() => {
  if (formData.value.roomId) {
    return props.utilityMeterSettings
      ?.filter((u) => u.roomId === formData.value.roomId)
      ?.map((item) => {
        return {
          value: item.id,
          label: UTILITY_METER_TYPES[item.meterType as MeterType],
        }
      })
  }
  return []
})

const formData = ref<CreateUtilityMeterReadingInput | UpdateUtilityMeterReadingInput>({
  propertyId: props.propertyId,
  roomId: 0,
  utilityMeterId: 0,
  readingDate: new Date(),
  value: 0,
})

const formDataTable = ref<any>([])
onUpdated(() => {
  formDataTable.value = props.rooms
    ?.filter((r) => r.id)
    .map((room) => {
      const utilityMeters = props.utilityMeterSettings?.filter((u) => u.roomId === room.id) ?? []
      return {
        propertyId: props.propertyId,
        roomId: room.id,
        room,
        utilityMeters,
        readingDate: new Date(),
        values: utilityMeters.map((u) => {
          return {
            value: 0,
            utilityMeterId: u.id,
          }
        }),
      }
    })
})

const getMeterName = (utilityMeterSetting: UtilityMeter[], utilityMeterId: number) => {
  return UTILITY_METER_TYPES[
    utilityMeterSetting.find((u) => u.id === utilityMeterId)?.meterType as MeterType
  ]
}

const resetFormData = () => {
  formData.value = {
    propertyId: props.propertyId,
    roomId: 0,
    utilityMeterId: 0,
    readingDate: new Date(),
    value: 0,
  }
}

watch(
  () => props.utilityMeterReading,
  (utilityMeterReading) => {
    if (utilityMeterReading) {
      formData.value = { ...utilityMeterReading, id: utilityMeterReading.id }
    } else {
      resetFormData()
    }
    errors.value = {}
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}
  if (!formData.value.roomId) errors.value.roomId = 'Phòng không được để trống'
  if (!formData.value.utilityMeterId)
    errors.value.utilityMeterId = 'Loại công tơ không được để trống'
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (selectedModeTab.value === 'single') {
    if (!validateForm()) return
    loading.value = true
    try {
      const payload: any = { ...formData.value }
      if (isEdit.value) {
        await updateUtilityMeterReading(
          (formData.value as UpdateUtilityMeterReadingInput).id!,
          payload,
          payload.utilityMeterId,
          props.propertyId,
        )
        emit('utility-meter-reading-updated')
      } else {
        await createUtilityMeterReading(
          payload as CreateUtilityMeterReadingInput,
          payload.utilityMeterId,
          props.propertyId,
        )
        emit('utility-meter-reading-saved')
      }
      isShow.value = false
      resetFormData()
    } catch (e: any) {
      console.error('Save utilityMeterReading error:', e)
      const eMsg = e?.response?.data?.message ?? 'Lỗi khi lưu số đo'
      tError('Lỗi', eMsg)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = true
    try {
      const payload = [...formDataTable.value]
        .flatMap((item) =>
          item.values.map((v: any) => ({
            propertyId: props.propertyId,
            roomId: item.roomId,
            utilityMeterId: v.utilityMeterId,
            readingDate: item.readingDate,
            value: v.value,
          })),
        )
        .filter((pay) => pay.value)
      await createMultipleUtilityMeterReading(payload, props.propertyId)
      emit('utility-meter-reading-saved')
      isShow.value = false
      resetFormData()
    } catch (e: any) {
      console.error('Save utilityMeterReading error:', e)
      const eMsg = e?.response?.data?.message ?? 'Lỗi khi lưu số đo'
      tError('Lỗi', eMsg)
    } finally {
      loading.value = false
    }
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
