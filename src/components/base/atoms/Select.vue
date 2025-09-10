<script setup lang="ts" generic="T, K extends keyof T">
import { cn } from '@/helpers/utils'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { debounce } from '@/helpers/utils'

const {
  containerClass = '',
  inputClass = '',
  dropdownClass = '',
  placeholder = '',
  disabled = false,
  error = false,
  errorMsg = '',
  optionLabel,
  options = [],
  loading = false,
} = defineProps<{
  containerClass?: string
  inputClass?: string
  dropdownClass?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  errorMsg?: string
  optionLabel: K
  options?: T[]
  loading?: boolean
}>()

const emit = defineEmits(['select-option', 'focus', 'blur'])

const selectedOption = defineModel<T>('selectedOption')
const shownSelectedOption = computed(() => {
  return selectedOption.value && optionLabel ? selectedOption.value[optionLabel] : ''
})

// handle dropdown toggle
const showDropdown = ref(false)
const dropdownStyle = ref()
const inputRef = ref()

const openDropdown = () => {
  showDropdown.value = true
  inputRef.value.focus()
}
const onFocus = (event: any) => {
  openDropdown()
  updatePosition()
  emit('focus', event)
}
const onBlur = (event: any) => {
  showDropdown.value = false
  emit('blur', event)
}
const updatePosition = () => {
  if (inputRef.value) {
    const rect = inputRef.value.getBoundingClientRect()
    dropdownStyle.value = {
      top: `${rect.bottom + window.scrollY + 4}px`,
      left: `0px`,
      insetInlineStart: `${rect.left + window.scrollX}px`,
      minWidth: `${rect.width}px`,
      maxWidth: `${rect.width + 10}px`,
      position: 'absolute',
      zIndex: 1000001,
      transformOrigin: 'center top',
    }
  }
}

const debounceUpdaterPosition = debounce(updatePosition, 200)
onMounted(() => {
  window.addEventListener('resize', debounceUpdaterPosition)
  window.addEventListener('scroll', debounceUpdaterPosition)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', debounceUpdaterPosition)
  window.removeEventListener('scroll', debounceUpdaterPosition)
})

// handle select
const handleSelectOption = (option: T) => {
  selectedOption.value = option
  emit('select-option', option)
}
const checkSelectedOption = (option: T) => {
  if (!selectedOption.value || !option || !optionLabel) return false
  return (
    (option[optionLabel] ?? option) === (selectedOption.value[optionLabel] ?? selectedOption.value)
  )
}
</script>

<template>
  <div :class="cn('relative cursor-pointer', containerClass)" @click="openDropdown">
    <input
      ref="inputRef"
      type="text"
      :class="
        cn(
          'block w-full min-h-8 rounded-lg border outline-none border-solid p-1 pl-2 truncate pr-8 text-sm text-gray-900 focus:outline-none focus:border-blue-500 cursor-pointer',
          disabled ? 'bg-gray-50 border-gray-50 cursor-not-allowed' : 'border-gray-150 bg-white',
          error ? 'border-red-500 focus:border-red-500' : '',
          inputClass,
        )
      "
      :value="shownSelectedOption"
      :disabled="disabled"
      :placeholder="placeholder"
      readonly
      @focus="onFocus"
      @blur="onBlur"
    />
    <Teleport to="body">
      <Transition name="dropdown-slide-down-fade">
        <div
          v-if="showDropdown && !loading"
          ref="dropdownRef"
          :class="cn('bg-gray-0 shadow-block rounded-lg max-h-72', dropdownClass)"
          :style="dropdownStyle"
        >
          <div class="overflow-x-hidden overflow-y-auto max-h-60 py-2">
            <!-- dropdown header -->
            <slot v-if="$slots.header" name="header"></slot>
            <!-- end dropdown header -->

            <!-- dropdown options -->
            <template v-if="$slots.option">
              <div
                v-for="(option, index) in options"
                :key="index"
                :class="[
                  checkSelectedOption(option)
                    ? 'bg-blue-25 hover:bg-blue-50'
                    : 'bg-gray-0 hover:bg-gray-50',
                  'relative py-2 px-4 min-h-9 cursor-pointer pr-8 break-words',
                ]"
                @click="handleSelectOption(option)"
              >
                <slot
                  name="option"
                  :option="option"
                  :index="index"
                  :selected="checkSelectedOption(option)"
                ></slot>
                <i
                  v-if="checkSelectedOption(option)"
                  class="iks ik-check text-blue-500 absolute top-1/2 -translate-y-1/2 right-2"
                ></i>
              </div>
            </template>
            <template v-else>
              <div
                v-for="(option, index) in options"
                :key="index"
                :class="[
                  checkSelectedOption(option)
                    ? 'bg-blue-25 hover:bg-blue-50'
                    : 'bg-gray-0 hover:bg-gray-50',
                  'relative py-2 px-4 min-h-9 cursor-pointer pr-8 break-words',
                ]"
                @click="handleSelectOption(option)"
              >
                {{ option && optionLabel ? (option[optionLabel] ?? '') : '' }}
                <i
                  v-if="checkSelectedOption(option)"
                  class="iks ik-check text-blue-500 absolute top-1/2 -translate-y-1/2 right-2"
                ></i>
              </div>
            </template>
            <!-- end dropdown options -->

            <!-- dropdown footer -->
            <slot v-if="$slots.footer" name="footer"></slot>
            <!-- end dropdown footer -->
          </div>
        </div>
      </Transition>
    </Teleport>
    <i
      v-if="loading"
      class="ikr ik-loading animate-spin text-gray-400 absolute top-2.5 right-2"
    ></i>
    <i
      v-else
      class="iks ik-angle-small-down text-gray-600 absolute top-1/2 -translate-y-1/2 right-2"
    ></i>
    <span class="absolute left-0 top-full text-red-500 text-xs" v-if="error && errorMsg">{{
      errorMsg
    }}</span>
  </div>
</template>
