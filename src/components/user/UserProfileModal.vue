<template>
  <Modal
    v-model:show="isShow"
    title="Chỉnh sửa hồ sơ"
    :enable-backdrop-close="true"
    :enable-escape-close="true"
    @submit="handleSubmit"
    @close="handleClose"
  >
    <template #body>
      <div class="p-6 space-y-6">
        <!-- User Information Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>

          <!-- Name -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Tên <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="formData.name"
              placeholder="Nhập họ và tên"
              class="w-full"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700"
              >Email <span class="text-red-500">*</span></label
            >
            <InputText
              v-model="formData.email"
              placeholder="Nhập email"
              type="email"
              class="w-full"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
          </div>
        </div>

        <!-- Change Password Section -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
          <p class="text-sm text-gray-500">Để trống nếu không muốn thay đổi mật khẩu</p>

          <!-- Current Password -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
            <Password
              v-model="passwordData.currentPassword"
              placeholder="Nhập mật khẩu hiện tại"
              class="w-full"
              :class="{ 'border-red-500': errors.currentPassword }"
              :feedback="false"
              toggle-mask
            />
            <p v-if="errors.currentPassword" class="text-sm text-red-500">
              {{ errors.currentPassword }}
            </p>
          </div>

          <!-- New Password -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <Password
              v-model="passwordData.newPassword"
              placeholder="Nhập mật khẩu mới"
              class="w-full"
              :class="{ 'border-red-500': errors.newPassword }"
              :feedback="true"
              toggle-mask
            />
            <p v-if="errors.newPassword" class="text-sm text-red-500">{{ errors.newPassword }}</p>
          </div>

          <!-- Confirm New Password -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
            <Password
              v-model="passwordData.confirmPassword"
              placeholder="Nhập lại mật khẩu mới"
              class="w-full"
              :class="{ 'border-red-500': errors.confirmPassword }"
              :feedback="false"
              toggle-mask
            />
            <p v-if="errors.confirmPassword" class="text-sm text-red-500">
              {{ errors.confirmPassword }}
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex justify-end p-4 border-t border-gray-200 gap-3">
        <Button label="Hủy" severity="secondary" @click="close" />
        <Button label="Cập nhật" :loading="loading" @click="handleSubmit" />
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Modal from '@/components/base/molecules/Modal.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import type { User, UpdateUserInput } from '@/types/user'
import { useCustomToast } from '@/composables/base/useCustomToast'
import { useAuth } from '@/composables/auth/useAuth'
import { updateUser } from '@/services/api/userService'
import { useRouter } from 'vue-router'

interface Props {
  user?: User | null
}

const props = withDefaults(defineProps<Props>(), {
  user: null,
})

const emit = defineEmits<{
  'profile-updated': [user: User]
}>()

const { tSuccess, tError } = useCustomToast()
const { user: currentUser, handleLogout } = useAuth()
const router = useRouter()
const isShow = ref(false)
const loading = ref(false)
const errors = ref<Record<string, string>>({})

// Form data for user information
const formData = ref<UpdateUserInput>({
  id: 0,
  name: '',
  email: '',
})

// Password change data
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})
// Watch for user changes to populate form
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      formData.value = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      }
    } else if (currentUser.value) {
      // Use current user data if no user prop provided
      formData.value = {
        id: currentUser.value.id,
        name: currentUser.value.name,
        email: currentUser.value.email,
      }
    }

    // Reset password data
    passwordData.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }

    errors.value = {}
  },
  { immediate: true },
)

function validateForm(): boolean {
  errors.value = {}

  // Validate user information
  if (!formData.value.name?.trim()) {
    errors.value.name = 'Họ và tên không được để trống'
  }

  if (!formData.value.email?.trim()) {
    errors.value.email = 'Email không được để trống'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = 'Email không hợp lệ'
  }

  // Validate password change if any password field is filled
  const hasPasswordChange =
    passwordData.value.currentPassword ||
    passwordData.value.newPassword ||
    passwordData.value.confirmPassword

  if (hasPasswordChange) {
    // Current password is required when changing password
    if (!passwordData.value.currentPassword?.trim()) {
      errors.value.currentPassword = 'Vui lòng nhập mật khẩu hiện tại'
    }

    // New password is required when changing password
    if (!passwordData.value.newPassword?.trim()) {
      errors.value.newPassword = 'Vui lòng nhập mật khẩu mới'
    } else if (passwordData.value.newPassword.length < 6) {
      errors.value.newPassword = 'Mật khẩu mới tối thiểu 6 ký tự'
    }

    // Confirm password is required when changing password
    if (!passwordData.value.confirmPassword?.trim()) {
      errors.value.confirmPassword = 'Vui lòng xác nhận mật khẩu mới'
    } else if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
      errors.value.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    // Additional validation: current password and new password should be different
    if (
      passwordData.value.currentPassword &&
      passwordData.value.newPassword &&
      passwordData.value.currentPassword === passwordData.value.newPassword
    ) {
      errors.value.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại'
    }
  }

  return Object.keys(errors.value).length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const updateData: UpdateUserInput = {
      id: formData.value.id,
      name: formData.value.name,
      email: formData.value.email,
    }

    // Only include password if user wants to change it
    const hasPasswordChange =
      passwordData.value.currentPassword ||
      passwordData.value.newPassword ||
      passwordData.value.confirmPassword

    if (hasPasswordChange) {
      // Pass both current and new password to backend for validation
      updateData.currentPassword = passwordData.value.currentPassword
      updateData.newPassword = passwordData.value.newPassword
    }

    const updatedUser = await updateUser(formData.value.id, updateData)

    // Check if password was changed
    if (hasPasswordChange) {
      // Password was changed - logout user and redirect to login
      tSuccess(
        'Mật khẩu đã được thay đổi',
        'Vui lòng đăng nhập lại với mật khẩu mới để bảo mật tài khoản',
      )

      // Close modal first
      isShow.value = false

      // Small delay to ensure toast is visible
      setTimeout(async () => {
        // Logout user
        await handleLogout()

        // Redirect to login page
        router.push({ name: 'login' })
      }, 1500) // 1.5 second delay
    } else {
      // Only profile info was updated - no logout needed
      tSuccess('Thành công', 'Cập nhật hồ sơ thành công')
      emit('profile-updated', updatedUser)

      // Clear password fields after successful update
      passwordData.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }

      isShow.value = false
    }
  } catch (error: any) {
    const msg = error?.response?.data?.message ?? 'Có lỗi xảy ra khi cập nhật hồ sơ'
    tError('Lỗi', msg)
    console.error('Profile update error:', error)
  } finally {
    loading.value = false
  }
}

function handleClose() {
  isShow.value = false
  errors.value = {}
}

// Expose methods for parent components
defineExpose({
  open: () => {
    isShow.value = true
  },
  close: () => {
    isShow.value = false
  },
})
</script>

<style scoped></style>
