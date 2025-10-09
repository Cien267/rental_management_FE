<template>
  <DefaultLayout :selected-property="selectedProperty">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-0">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <div class="text-2xl font-semibold text-gray-900">Cài đặt chung</div>
          <div class="text-base text-gray-300">Cập nhật thông tin nhà trọ</div>
        </div>
        <Button label="Cập nhật" :loading="loading" @click="handleSubmit" />
      </div>
      <PageLoading v-if="loading" />
    </div>
    <div class="m-6 p-6 bg-white rounded-md gap-4 grid grid-cols-2">
      <!-- Property Image -->
      <div class="space-y-2 col-span-2">
        <label class="text-sm font-medium text-gray-700">Hình ảnh</label>
        <FileUpload
          mode="basic"
          accept="image/*"
          :max-file-size="5000000"
          choose-label="Chọn ảnh"
          cancel-label="Hủy"
          class="w-1/8"
          @select="onImageSelect"
          @remove="onImageRemove"
        />
        <div v-if="formData.image" class="mt-2">
          <img
            :src="formData.image"
            alt="Property preview"
            class="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
        </div>
      </div>

      <!-- Property Name -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700"
          >Tên nhà trọ <span class="text-red-500">*</span></label
        >
        <InputText
          v-model="formData.name"
          placeholder="Nhập tên nhà trọ"
          class="w-full"
          :class="{ 'border-red-500': errors.name }"
        />
        <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
      </div>

      <!-- Property Code -->
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700"
            >Mã nhà trọ <span class="text-red-500">*</span></label
          >
        </div>
        <InputText
          v-model="formData.code"
          placeholder="Nhập mã nhà trọ hoặc để trống để tự động tạo"
          class="w-full"
          @input="userEditedCode = true"
          :class="{ 'border-red-500': errors.code }"
        />
        <p v-if="errors.code" class="text-sm text-red-500">{{ errors.code }}</p>
      </div>

      <!-- Address -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700"
          >Địa chỉ <span class="text-red-500">*</span></label
        >
        <Textarea
          v-model="formData.address"
          placeholder="Nhập địa chỉ nhà trọ"
          rows="1"
          class="w-full"
          :class="{ 'border-red-500': errors.address }"
        />
        <p v-if="errors.address" class="text-sm text-red-500">{{ errors.address }}</p>
      </div>

      <!-- Property Type -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Phân loại</label>
        <Select
          v-model="formData.type"
          :options="propertyTypes"
          optionLabel="label"
          option-value="value"
          placeholder="Chọn phân loại"
          class="w-full"
        />
      </div>

      <!-- Floors -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Số tầng</label>
        <InputNumber
          v-model="formData.floors"
          placeholder="Nhập số tầng"
          :min="1"
          :max="50"
          class="w-full"
        />
      </div>

      <!-- Status -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Trạng thái</label>
        <Select
          v-model="formData.status"
          :options="statusOptions"
          option-label="label"
          option-value="value"
          placeholder="Chọn trạng thái"
          class="w-full"
        />
      </div>

      <!-- Contact Information -->
      <div class="space-y-4 col-span-2 grid grid-cols-2 gap-4">
        <div class="text-md font-bold text-gray-900 col-span-2">
          Thông tin liên hệ
          <span class="ml-1 text-sm text-gray-500 font-normal">(Bỏ qua nếu không cần thiết)</span>
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Tên người liên hệ</label>
          <InputText
            v-model="formData.contactName"
            placeholder="Nhập tên người liên hệ"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Số điện thoại</label>
          <InputText
            v-model="formData.contactPhone"
            placeholder="Nhập số điện thoại"
            class="w-full"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Email</label>
          <InputText
            v-model="formData.contactMail"
            placeholder="Nhập email liên hệ"
            class="w-full"
          />
        </div>
      </div>

      <!-- Utility Prices -->
      <div class="space-y-4 col-span-2">
        <h4 class="text-md font-bold text-gray-900">Giá tiện ích</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Giá điện (VNĐ/kWh)</label>
            <InputNumber
              v-model="formData.electricityPricePerKwh"
              placeholder="0"
              :min="0"
              :max="10000"
              :step="100"
              class="w-full"
            />
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Giá nước (VNĐ/m³)</label>
            <InputNumber
              v-model="formData.waterPricePerM3"
              placeholder="0"
              :min="0"
              :max="50000"
              :step="1000"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="space-y-2 col-span-2">
        <label class="text-sm font-medium text-gray-700">Ghi chú</label>
        <Textarea
          v-model="formData.note"
          placeholder="Nhập ghi chú (tùy chọn)"
          rows="3"
          class="w-full"
        />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import FileUpload from 'primevue/fileupload'
import type { Property, CreatePropertyInput, UpdatePropertyInput } from '@/types/property'
import { useCustomToast } from '@/composables/base/useCustomToast'
import { useAuth } from '@/composables/auth/useAuth'
import { generatePropertyCode } from '@/helpers/propertyCodeGenerator'
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS_OPTIONS,
  DEFAULT_PROPERTY_VALUES,
} from '@/constants/property'
import { updateProperty } from '@/services/api/propertyService'
import { uploadImage, getImageUrl } from '@/services/api/uploadService'
import { useMainStore } from '@/stores/main'
import { getProperty } from '@/services/api/propertyService'
import { transformPropertyToUI } from '@/transformers/properties'
import { useRoute } from 'vue-router'

const store = useMainStore()
const route = useRoute()

const selectedProperty = ref<Property | null>(null)
const propertyId = computed(() => Number(route.params.id))
const { tSuccess, tError } = useCustomToast()
const { user } = useAuth()
const loading = ref(false)
const errors = ref<Record<string, string>>({})
const userEditedCode = ref(false) // Track if user manually edited the code

// Form data
const formData = ref<CreatePropertyInput | UpdatePropertyInput>({
  userId: user.value?.id || 1, // Get from auth, fallback to 1
  name: '',
  code: '',
  address: '',
  type: DEFAULT_PROPERTY_VALUES.type,
  floors: DEFAULT_PROPERTY_VALUES.floors,
  image: '',
  status: DEFAULT_PROPERTY_VALUES.status,
  note: '',
  contactName: '',
  contactPhone: '',
  contactMail: '',
  electricityPricePerKwh: DEFAULT_PROPERTY_VALUES.electricityPricePerKwh,
  waterPricePerM3: DEFAULT_PROPERTY_VALUES.waterPricePerM3,
})

// Options for selects (using constants)
const propertyTypes = ref([...PROPERTY_TYPES])
const statusOptions = ref([...PROPERTY_STATUS_OPTIONS])

// Watch for property changes to populate form
watch(
  selectedProperty,
  (newProperty) => {
    formData.value = {
      ...newProperty,
      id: newProperty?.id || 0,
    }
    errors.value = {}
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}

  if (!formData.value.name?.trim()) {
    errors.value.name = 'Tên nhà trọ không được để trống'
  }

  if (!formData.value.code?.trim()) {
    errors.value.code = 'Mã nhà trọ không được để trống'
  }

  if (!formData.value.address?.trim()) {
    errors.value.address = 'Địa chỉ nhà trọ không được để trống'
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const updateData = formData.value as UpdatePropertyInput
    await updateProperty(updateData.id!, updateData)
    tSuccess('Thành công', 'Cập nhật nhà trọ thành công')
    loadProperty()
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Có lỗi xảy ra khi lưu nhà trọ'
    tError('Lỗi', msg)
    console.error('Property save error:', error)
  } finally {
    loading.value = false
  }
}

// Image handling functions
async function onImageSelect(event: any) {
  const file = event.files[0]
  if (file) {
    try {
      // Show loading state
      loading.value = true

      // Upload image to server
      const uploadResponse = await uploadImage(file)

      // Get the full image URL
      const imageUrl = getImageUrl(uploadResponse.data.path)

      // Update form data with the uploaded image URL
      formData.value.image = imageUrl

      tSuccess('Thành công', 'Tải ảnh lên thành công')
    } catch (error) {
      tError('Lỗi', 'Không thể tải ảnh lên')
      console.error('Image upload error:', error)
    } finally {
      loading.value = false
    }
  }
}

function onImageRemove() {
  formData.value.image = ''
}
watch(
  () => formData.value.name,
  (newName) => {
    if (newName?.trim() && !userEditedCode.value) {
      const generatedCode = generatePropertyCode(newName)
      formData.value.code = generatedCode
    }
  },
)

const loadProperty = async () => {
  try {
    const prop: Property = await getProperty(propertyId.value)
    const ui = transformPropertyToUI(prop)
    selectedProperty.value = ui
    store.setSelectedProperty(prop)
  } catch {
    selectedProperty.value = null
    store.setSelectedProperty(null)
  }
}

onMounted(async () => {
  await loadProperty()
})
</script>

<style scoped></style>
