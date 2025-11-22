<template>
  <Modal
    v-model:show="isShow"
    :title="isEdit ? 'Chỉnh sửa người thuê' : 'Thêm người thuê mới'"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <template #body>
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Họ và tên <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="formData.fullName"
              placeholder="Nhập họ và tên"
              class="w-full"
              :class="{ 'border-red-500': errors.fullName }"
            />
            <p v-if="errors.fullName" class="text-sm text-red-500">{{ errors.fullName }}</p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Số điện thoại</label>
            <InputText v-model="formData.phone" placeholder="Nhập số điện thoại" class="w-full" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Email</label>
            <InputText
              v-model="formData.email"
              placeholder="Nhập email"
              class="w-full"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>
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
            <label class="text-sm font-medium text-gray-700">Giới tính</label>
            <Select
              v-model="formData.gender"
              :options="genderOptions"
              option-label="label"
              option-value="value"
              placeholder="Chọn giới tính"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Ngày sinh</label>
            <DatePicker
              v-model="formData.dateOfBirth as Date"
              dateFormat="dd/mm/yy"
              placeholder="Chọn ngày sinh"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Số CMND/CCCD</label>
            <InputText
              v-model="formData.nationalIdNumber"
              placeholder="Nhập số CMND/CCCD"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Nghề nghiệp</label>
            <InputText
              v-model="formData.occupation"
              placeholder="Nhập nghề nghiệp"
              class="w-full"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Địa chỉ thường trú</label>
          <Textarea
            v-model="formData.permanentAddress"
            rows="2"
            class="w-full"
            placeholder="Nhập địa chỉ thường trú"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Tên người liên hệ khẩn cấp</label>
            <InputText
              v-model="formData.emergencyContactName"
              placeholder="Nhập tên người liên hệ"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">SĐT người liên hệ khẩn cấp</label>
            <InputText
              v-model="formData.emergencyContactPhone"
              placeholder="Nhập số điện thoại"
              class="w-full"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Mối quan hệ</label>
            <InputText
              v-model="formData.emergencyContactRelation"
              placeholder="VD: Cha, Mẹ, Anh, Chị..."
              class="w-full"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Ghi chú</label>
          <Textarea
            v-model="formData.note"
            rows="3"
            class="w-full"
            placeholder="Nhập ghi chú (nếu có)"
          />
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
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import DatePicker from 'primevue/datepicker'
import type { Tenant, CreateTenantInput, UpdateTenantInput } from '@/types/tenant'
import type { Room } from '@/types/room'
import { TENANT_GENDERS } from '@/constants/tenants'
import { createTenant, updateTenant } from '@/services/api/tenantService'
import { useCustomToast } from '@/composables/base/useCustomToast'

const { tError } = useCustomToast()

interface Props {
  propertyId: number
  tenant?: Tenant | null
  rooms?: Room[] | null
}

const props = withDefaults(defineProps<Props>(), {
  tenant: null,
  rooms: null,
})

const emit = defineEmits<{ 'tenant-saved': []; 'tenant-updated': [] }>()

const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const isEdit = computed(() => !!props.tenant)

const genderOptions = Object.entries(TENANT_GENDERS).map(([value, label]) => ({ label, value }))

const roomOptions = computed(() => props.rooms || [])

const formData = ref<CreateTenantInput | UpdateTenantInput>({
  fullName: '',
  phone: '',
  email: undefined,
  roomId: 0,
  permanentAddress: '',
  nationalIdNumber: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelation: '',
  occupation: '',
  note: '',
  gender: 'male',
  dateOfBirth: undefined,
})

const resetFormData = () => {
  formData.value = {
    fullName: '',
    phone: '',
    email: undefined,
    roomId: 0,
    permanentAddress: '',
    nationalIdNumber: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    occupation: '',
    note: '',
    gender: 'male',
    dateOfBirth: undefined,
  }
}

watch(
  () => props.tenant,
  (tenant) => {
    if (tenant) {
      formData.value = { ...tenant, id: tenant.id }
    } else {
      resetFormData()
    }
    errors.value = {}
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}
  if (!formData.value.fullName?.trim()) errors.value.fullName = 'Họ tên không được để trống'
  if (!formData.value.roomId) errors.value.roomId = 'Vui lòng chọn phòng'
  if (formData.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email không hợp lệ'
  }
  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) return
  loading.value = true
  try {
    const payload: any = { ...formData.value }
    payload.dateOfBirth = formData.value.dateOfBirth
      ? new Date(formData.value.dateOfBirth).toISOString().split('T')[0]
      : null
    console.log('debug', { payload })
    if (isEdit.value) {
      await updateTenant((formData.value as UpdateTenantInput).id!, payload, props.propertyId)
      emit('tenant-updated')
    } else {
      await createTenant(payload as CreateTenantInput, props.propertyId)
      emit('tenant-saved')
    }
    isShow.value = false
    resetFormData()
  } catch (e: any) {
    console.error('Save tenant error:', e)
    const eMsg = e?.response?.data?.message ?? 'Lỗi khi lưu người thuê'
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
