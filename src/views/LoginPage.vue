<script setup lang="ts">
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import { z } from 'zod'
import { DataLoginSchema } from '@/types/auth'
import { useAuth } from '@/composables/auth/useAuth'
import { useRouter } from 'vue-router'
import { ROUTER_NAME_LIST } from '@/constants/routers'
import { useCustomToast } from '@/composables/base/useCustomToast'
import AdminInformation from '@/components/auth/AdminInformation.vue'

const email = ref('')
const password = ref('')
const remember = ref(false)
const submitting = ref(false)
const errors = ref<{ email?: string; password?: string }>({})
const showAdminModal = ref(false)

const schema = DataLoginSchema

const { handleLogin } = useAuth()
const router = useRouter()
const { tError, tSuccess } = useCustomToast()

async function onSubmit() {
  errors.value = {}
  const result = schema.safeParse({ username: email.value, password: password.value })
  if (!result.success) {
    for (const issue of result.error.issues) {
      if (issue.path[0] === 'username') errors.value.email = String(issue.message)
      if (issue.path[0] === 'password') errors.value.password = String(issue.message)
    }
    return
  }

  submitting.value = true
  try {
    const ok = await handleLogin({ email: email.value, password: password.value })
    if (ok) {
      tSuccess('Thành công', 'Đăng nhập thành công')
      await router.push({ name: ROUTER_NAME_LIST.HOME_PAGE })
    } else {
      tError('Lỗi', 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.')
    }
  } catch (e) {
    tError('Lỗi', 'Không thể đăng nhập. Vui lòng thử lại sau.')
  } finally {
    submitting.value = false
  }
}
</script>
<template>
  <div class="h-screen bg-white flex items-center justify-center px-4">
    <div class="w-120">
      <div class="flex flex-col items-center text-center mb-8">
        <h1
          class="mt-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-600 font-extrabold text-8xl font-shadows_into_light"
        >
          Sổ Trọ
        </h1>
      </div>

      <div class="bg-white shadow-2xl rounded-2xl border border-gray-100 mx-auto">
        <div class="p-6 sm:p-8">
          <div class="text-center">
            <h2 class="text-2xl font-semibold text-gray-800">Đăng nhập</h2>
          </div>

          <form class="mt-6 space-y-5" @submit.prevent="onSubmit">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-bold text-gray-700">Email</label>
              <InputText
                id="email"
                v-model="email"
                type="email"
                placeholder="Nhập email"
                autocomplete="email"
                :invalid="!!errors.email"
                class="w-full"
              />
              <p v-if="errors.email" class="text-xs text-red-500 mt-1">{{ errors.email }}</p>
            </div>

            <div class="space-y-2">
              <label for="password" class="block text-sm font-bold text-gray-700">Mật khẩu</label>
              <Password
                id="password"
                v-model="password"
                toggleMask
                :feedback="false"
                placeholder="Nhập mật khẩu"
                autocomplete="current-password"
                class="w-full"
              />
              <p v-if="errors.password" class="text-xs text-red-500 mt-1">{{ errors.password }}</p>
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Checkbox v-model="remember" inputId="remember" :binary="true" />
                <label for="remember" class="text-sm text-gray-700">Ghi nhớ đăng nhập</label>
              </div>
              <a
                href="#"
                class="text-sm font-medium text-sky-600 hover:text-sky-700 no-underline"
                @click.prevent="showAdminModal = true"
                >Quên mật khẩu?</a
              >
            </div>

            <Button
              type="submit"
              label="Đăng nhập"
              :loading="submitting"
              class="w-full justify-center !bg-sky-600 hover:!bg-sky-700 border-0"
            />
          </form>
        </div>
      </div>

      <p class="text-center text-sm text-gray-500 mt-6">
        Chưa có tài khoản?
        <a
          href="#"
          class="!text-sky-600 hover:!text-sky-700 no-underline"
          @click.prevent="showAdminModal = true"
        >
          Liên hệ quản trị viên</a
        >
      </p>

      <AdminInformation v-model:show="showAdminModal" />
    </div>
  </div>
</template>
