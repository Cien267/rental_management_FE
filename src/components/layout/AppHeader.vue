<template>
  <header class="bg-white shadow-sm border-only-bottom border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Left side: Logo + App Name + Back Button -->
        <div class="flex items-center gap-4">
          <!-- Mobile menu button -->
          <Button
            v-if="selectedProperty"
            class="lg:!hidden"
            icon="pi pi-bars"
            severity="secondary"
            raised
            size="small"
            @click="toggleMobileSidebar"
            aria-label="Toggle sidebar"
          />
          <!-- Logo and App Name -->
          <div class="flex items-center gap-3 w-32 lg:w-56">
            <span
              class="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-600 font-extrabold font-Alex_Brush lg:pl-16"
            >
              Sổ trọ
            </span>
          </div>

          <!-- Back Button (conditional) -->
          <Button
            v-if="showBackButton"
            label="Quay lại danh sách nhà"
            icon="pi pi-arrow-left"
            text
            severity="secondary"
            size="small"
            @click="handleBackClick"
            class="ml-4 !hidden lg:!block"
          />
        </div>

        <!-- Right side: Profile Menu -->
        <div class="flex items-center">
          <Menu ref="profileMenu" :model="profileMenuItems" :popup="true" class="w-56" />
          <Button
            :label="userDisplayName"
            icon="pi pi-user"
            text
            severity="secondary"
            @click="toggleProfileMenu"
            class="flex items-center gap-2"
          />
        </div>
      </div>
    </div>
  </header>

  <!-- User Profile Modal -->
  <UserProfileModal ref="userProfileModal" :user="user" @profile-updated="handleProfileUpdated" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import { useAuth } from '@/composables/auth/useAuth'
import { useCustomToast } from '@/composables/base/useCustomToast'
import UserProfileModal from '@/components/user/UserProfileModal.vue'
import { useMainStore } from '@/stores/main'
const store = useMainStore()

interface Props {
  showBackButton?: boolean
}

withDefaults(defineProps<Props>(), {
  showBackButton: false,
})

const emit = defineEmits<{
  'back-to-properties': []
}>()

const router = useRouter()
const { handleLogout, user } = useAuth()
const { tSuccess, tError } = useCustomToast()
const profileMenu = ref()
const userProfileModal = ref<InstanceType<typeof UserProfileModal> | null>(null)

// Get user display name, default to "Chủ trọ" if no user data
const userDisplayName = computed(() => {
  return user.value?.name || 'Chủ trọ'
})

const profileMenuItems = [
  {
    label: 'Chỉnh sửa hồ sơ',
    icon: 'pi pi-user-edit',
    command: () => {
      userProfileModal.value?.open()
    },
  },
  {
    separator: true,
  },
  {
    label: 'Đăng xuất',
    icon: 'pi pi-sign-out',
    command: async () => {
      try {
        await handleLogout()
        tSuccess('Thành công', 'Đăng xuất thành công')
        store.setSelectedProperty(null)
        router.push({ name: 'login' })
      } catch (error) {
        tError('Lỗi', 'Có lỗi xảy ra khi đăng xuất')
        console.error('Logout error:', error)
      }
    },
  },
]

function toggleProfileMenu(event: Event) {
  profileMenu.value?.toggle(event)
}

function handleBackClick() {
  store.setSelectedProperty(null)
  emit('back-to-properties')
}

function handleProfileUpdated(updatedUser: any) {
  // The user data will be updated automatically through the auth composable
  console.log('Profile updated:', updatedUser)
}

// Sidebar controls
const selectedProperty = computed(() => store.getSelectedProperty)
function toggleMobileSidebar() {
  store.toggleMobileSidebar()
}
</script>

<style scoped></style>
