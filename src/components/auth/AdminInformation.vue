<script setup lang="ts">
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import { ADMIN_INFO } from '@/constants/main'

const isShow = defineModel<boolean>('show', { default: false })
</script>

<template>
  <Modal
    v-model:show="isShow"
    :enableBackdropClose="true"
    :enableEscapeClose="true"
    title="Liên hệ quản trị viên"
  >
    <template #body>
      <div class="p-6">
        <div class="flex flex-col items-center text-center">
          <div
            class="h-14 w-14 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center shadow-sm"
          >
            <i class="pi pi-user text-4xl"></i>
          </div>
          <h3 class="mt-3 text-xl font-semibold text-gray-900">{{ ADMIN_INFO.name }}</h3>
          <p class="text-sm text-gray-500">Liên hệ khi cần hỗ trợ hệ thống quản lý cho thuê</p>

          <div class="mt-3 w-full grid grid-cols-1 gap-4">
            <div
              class="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 shadow-sm"
            >
              <span
                class="h-9 w-9 rounded-lg flex items-center justify-center bg-white text-indigo-600 border border-gray-100"
              >
                <i class="pi pi-phone"></i>
              </span>
              <div class="flex-1 text-left">
                <div class="text-gray-700 text-sm font-medium">Số điện thoại / Zalo</div>
                <a
                  :href="`tel:${ADMIN_INFO.phone}`"
                  class="text-blue-600 hover:text-blue-700 no-underline text-sm font-bold"
                  >{{ ADMIN_INFO.phone }}</a
                >
              </div>
              <div class="flex gap-2">
                <a :href="`tel:${ADMIN_INFO.phone}`" class="no-underline">
                  <Button type="button" label="Gọi" severity="contrast" />
                </a>
                <a
                  :href="`https://zalo.me/${ADMIN_INFO.zalo}`"
                  target="_blank"
                  rel="noopener"
                  class="no-underline"
                >
                  <Button type="button" label="Zalo" severity="info" />
                </a>
              </div>
            </div>

            <div
              class="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 shadow-sm"
            >
              <span
                class="h-9 w-9 rounded-lg flex items-center justify-center bg-white text-indigo-600 border border-gray-100"
              >
                <i class="pi pi-envelope"></i>
              </span>
              <div class="flex-1 text-left">
                <div class="text-gray-700 text-sm font-medium">Email</div>
                <a
                  :href="`mailto:${ADMIN_INFO.email}`"
                  class="text-blue-600 hover:text-blue-700 no-underline text-sm font-bold"
                  >{{ ADMIN_INFO.email }}</a
                >
              </div>
              <a :href="`mailto:${ADMIN_INFO.email}`" class="no-underline">
                <Button type="button" label="Gửi mail" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #footer="{ close }">
      <div class="flex justify-end p-4 border-only-top border-gray-75 gap-2">
        <Button type="button" label="Đóng" severity="secondary" @click="close" />
      </div>
    </template>
  </Modal>
</template>
