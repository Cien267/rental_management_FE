<script setup lang="ts">
import { Drawer } from 'primevue'
import Tag from 'primevue/tag'
import { formatDate, formatCurrency } from '@/helpers/utils'
import type { Tenant } from '@/types/tenant'
import { getTenantGenderValue, getTenantGenderSeverity } from '@/transformers/tenants'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'

const { selectedTenant } = defineProps<{ selectedTenant: Tenant | null }>()
const isDrawerOpen = defineModel('visible', { type: Boolean, default: false })
const router = useRouter()

function goToRoomsList() {
  if (!selectedTenant?.room) return
  router.push({
    name: ROUTER_NAME_LIST.PROPERTY.ROOMS,
    params: { id: selectedTenant.room.propertyId },
  })
}

function getAge(dateOfBirth: Date | string | null | undefined): string {
  if (!dateOfBirth) return '---'
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  return `${age} tuổi`
}
</script>

<template>
  <Drawer
    v-model:visible="isDrawerOpen"
    :header="`Chi tiết ${selectedTenant?.fullName || ''}`"
    position="right"
    class="!w-full md:!w-1/2"
  >
    <div v-if="selectedTenant" class="p-4 space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-blue-100 flex-center !hidden lg:!flex">
                <i class="pi pi-user text-blue-600"></i>
              </div>
              <p class="text-gray-400 font-semibold">Giới tính</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              <Tag
                :value="getTenantGenderValue(selectedTenant.gender || '')"
                :severity="getTenantGenderSeverity(selectedTenant.gender || '')"
              />
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-green-100 flex-center !hidden lg:!flex">
                <i class="pi pi-phone text-green-600"></i>
              </div>
              <p class="text-gray-400 font-semibold">Số điện thoại</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ selectedTenant.phone || '---' }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border-2 border-solid border-gray-100">
          <div class="flex flex-col items-center justify-between">
            <div class="flex justify-between items-center w-full">
              <div class="w-10 h-10 rounded-xl bg-purple-100 flex-center !hidden lg:!flex">
                <i class="pi pi-calendar text-purple-600"></i>
              </div>
              <p class="text-gray-400 font-semibold">Tuổi</p>
            </div>
            <p class="text-2xl font-bold text-gray-700">
              {{ getAge(selectedTenant.dateOfBirth) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Detailed Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Personal Information -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Thông tin cá nhân
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Họ và tên</span>
              <span class="font-medium text-gray-800">{{ selectedTenant.fullName }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Email</span>
              <span class="font-medium text-gray-800">{{ selectedTenant.email || '---' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Ngày sinh</span>
              <span class="font-medium text-gray-800">
                {{
                  selectedTenant.dateOfBirth
                    ? formatDate(selectedTenant.dateOfBirth, 'DD/MM/YYYY')
                    : '---'
                }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Số CMND/CCCD</span>
              <span class="font-medium text-gray-800">{{
                selectedTenant.nationalIdNumber || '---'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Nghề nghiệp</span>
              <span class="font-medium text-gray-800">{{
                selectedTenant.occupation || '---'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Room Information -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Thông tin phòng
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Phòng thuê</span>
              <span
                v-if="selectedTenant.room"
                class="font-medium text-blue-600 cursor-pointer hover:underline"
                @click="goToRoomsList"
              >
                {{ selectedTenant.room.name }}
              </span>
              <span v-else class="font-medium text-gray-800">-</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Tầng</span>
              <span class="font-medium text-gray-800">
                {{ selectedTenant.room?.floor ? `Tầng ${selectedTenant.room.floor}` : '---' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Diện tích</span>
              <span class="font-medium text-gray-800">
                {{ selectedTenant.room?.area ? `${selectedTenant.room.area} m²` : '---' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Giá thuê</span>
              <span class="font-medium text-gray-800">
                {{ selectedTenant.room?.price ? formatCurrency(selectedTenant.room.price) : '---' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Address Information -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Địa chỉ thường trú
          </div>
          <div class="text-sm text-gray-700">
            {{ selectedTenant.permanentAddress || '---' }}
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
            Liên hệ khẩn cấp
          </div>
          <div class="grid grid-cols-1 gap-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Tên</span>
              <span class="font-medium text-gray-800">{{
                selectedTenant.emergencyContactName || '---'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Số điện thoại</span>
              <span class="font-medium text-gray-800">{{
                selectedTenant.emergencyContactPhone || '---'
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Mối quan hệ</span>
              <span class="font-medium text-gray-800">{{
                selectedTenant.emergencyContactRelation || '---'
              }}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="bg-gray-50 rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Ghi chú</div>
          <div class="text-sm text-gray-700">{{ selectedTenant.note || '---' }}</div>
        </div>

        <!-- History -->
        <div class="bg-white rounded-xl p-4 border border-gray-200 md:col-span-2">
          <div class="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">Lịch sử</div>
          <div class="grid grid-cols-1 gap-3 text-sm w-1/2">
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Tạo lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedTenant.createdAt)
              }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-500">Cập nhật lúc</span>
              <span class="font-medium text-gray-800">{{
                formatDate(selectedTenant.updatedAt)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
