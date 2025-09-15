<template>
  <DefaultLayout :selected-property="selectedProperty" @back-to-properties="handleBackToProperties">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Property Header -->
      <div class="mb-8">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
            <i class="pi pi-building text-blue-600 text-2xl"></i>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ selectedProperty?.name }}</h1>
            <p class="text-gray-500">{{ selectedProperty?.address }}</p>
            <div class="flex items-center gap-4 mt-2">
              <Tag
                :value="selectedProperty?.statusLabel"
                :severity="selectedProperty?.statusSeverity"
                rounded
              />
              <span class="text-sm text-gray-500">Mã: {{ selectedProperty?.code }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Tổng phòng</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ selectedProperty?.totalRooms || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-home text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Đã thuê</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ selectedProperty?.occupiedRooms || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-users text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Tỷ lệ lấp đầy</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ selectedProperty?.occupancyPercent || 0 }}%
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-chart-pie text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Còn trống</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ (selectedProperty?.totalRooms || 0) - (selectedProperty?.occupiedRooms || 0) }}
              </p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <i class="pi pi-home text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Area -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Tổng quan bất động sản</h2>
          <p class="text-gray-500 mt-1">Thông tin chi tiết và quản lý bất động sản</p>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Property Details -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thông tin chi tiết</h3>
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-500">Tên bất động sản:</span>
                  <span class="font-medium">{{ selectedProperty?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Địa chỉ:</span>
                  <span class="font-medium">{{ selectedProperty?.address }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Mã bất động sản:</span>
                  <span class="font-medium">{{ selectedProperty?.code }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">Trạng thái:</span>
                  <Tag
                    :value="selectedProperty?.statusLabel"
                    :severity="selectedProperty?.statusSeverity"
                    size="small"
                  />
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Thao tác nhanh</h3>
              <div class="space-y-3">
                <Button
                  label="Quản lý phòng"
                  icon="pi pi-home"
                  class="w-full justify-start"
                  severity="secondary"
                  text
                />
                <Button
                  label="Thêm khách thuê"
                  icon="pi pi-user-plus"
                  class="w-full justify-start"
                  severity="secondary"
                  text
                />
                <Button
                  label="Tạo hóa đơn"
                  icon="pi pi-receipt"
                  class="w-full justify-start"
                  severity="secondary"
                  text
                />
                <Button
                  label="Cài đặt bất động sản"
                  icon="pi pi-cog"
                  class="w-full justify-start"
                  severity="secondary"
                  text
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import type { PropertyUI } from '@/types/property'
import { transformPropertyToUI } from '@/transformers/properties'

const selectedProperty = ref<PropertyUI | null>(null)

function handleBackToProperties() {
  // This would typically navigate back to the properties list
  console.log('Navigate back to properties list')
}

// Async setup - this will be awaited by Suspense
async function loadPropertyData() {
  // Simulate loading a selected property
  const mockProperty = {
    id: 1,
    userId: 1,
    name: 'Chung cư Sunset',
    code: 'SA001',
    image:
      'https://images.unsplash.com/photo-1501183638710-841dd1904471?q=80&w=2069&auto=format&fit=crop',
    address: '123 Đường Chính, Quận 1',
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  selectedProperty.value = transformPropertyToUI(mockProperty, 24, 18)
}

// Start loading data
loadPropertyData()
</script>

<style scoped></style>
