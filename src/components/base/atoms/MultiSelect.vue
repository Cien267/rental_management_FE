<template>
  <div
    :class="cn('w-full flex relative', containerClass)"
    v-click-outside="clickOutSide"
    ref="selectWrapper"
    :data-teleport-id="componentId"
  >
    <div
      @click="onShowDropDown"
      :class="[
        { 'border-red-500': !showDropdown && error },
        { 'bg-gray-50 !border-gray-50 cursor-not-allowed': disabled },
        { 'bg-white cursor-pointer': !disabled },
        { 'border-blue-500': showDropdown },
        showDropdown ? 'border-blue-500' : 'border-gray-150',
      ]"
      class="w-full flex border border-solid rounded-lg overflow-hidden px-1 pt-1 flex-wrap relative"
    >
      <div
        v-for="(selected, index) in selectedOptions"
        :key="index"
        class="inline-flex flex-none mb-1 mr-1 max-w-full"
      >
        <slot name="tag" :tag="selected" :index="index" :onRemove="onOptionRemove">
          <div :class="cn(tagClass, 'flex bg-blue-500 px-1.5 py-0.5 items-center rounded ')">
            <span class="text-white font-medium leading-5">{{ selected.label }}</span>
            <i
              class="ikr pi-times text-blue-300 ml-1.5 cursor-pointer"
              @click="onOptionRemove(index)"
            />
          </div>
        </slot>
      </div>

      <div class="flex-1">
        <input
          type="text"
          class="border-none outline-0 w-full grow text-gray-900 leading-5 mb-1 placeholder:text-gray-900"
          :class="{
            'bg-gray-50 border-gray-50 cursor-not-allowed placeholder:text-gray-200': disabled,
          }"
          :disabled="disabled"
          ref="inputRef"
          v-model="keywordSearch"
          :placeholder="selectedOptions.length === 0 ? placeholder : ''"
          @input="changeInput"
        />
        <span
          ref="inputTagCalculator"
          class="absolute top-0 left-0 max-w-full overflow-hidden whitespace-pre invisible"
        >
          {{ keywordSearch }}
        </span>
      </div>
    </div>
    <Teleport to="body">
      <div
        v-if="showDropdown"
        :style="dropdownStyle"
        :data-teleport-from="componentId"
        ref="dropdown"
        class="absolute top-full left-0 w-full z-50 mt-1 rounded-lg shadow-block bg-white overflow-hidden"
      >
        <div class="max-h-60 overflow-y-auto">
          <template v-if="searchOptions.length > 0">
            <div
              v-for="(option, index) in searchOptions"
              :key="index"
              :class="
                cn(
                  labelClass,
                  checkSelectedOption(option) ? 'bg-blue-25 hover:bg-blue-50' : 'hover:bg-gray-50',
                )
              "
              @click="onOptionSelect(option)"
              class="flex px-4 py-2 cursor-pointer"
            >
              <slot
                name="option"
                :option="option"
                :index="index"
                :selected="checkSelectedOption(option)"
              >
                <span class="grow overflow-hidden leading-5">{{ option.label }}</span>
                <div class="w-5 flex-none">
                  <i v-if="checkSelectedOption(option)" class="ikr ik-check text-blue-500"></i>
                </div>
              </slot>
            </div>
          </template>
          <div v-else class="flex p-4 cursor-pointer text-gray-200">
            {{ emptyMsg }}
          </div>
        </div>
      </div>
    </Teleport>
    <span class="absolute left-0 top-full text-red-500 text-xs" v-if="error && errorMsg">{{
      errorMsg
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, ref, watch, useId, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { cn, debounce } from '@/helpers/utils'

export interface OptionType {
  key?: string
  value: string | number
  label?: any
}

const componentId = useId()
const emit = defineEmits(['change', 'remove-tag', 'update:value', 'blur', 'focus'])
const props = defineProps({
  containerClass: {
    type: String,
    default: '',
  },
  tagClass: {
    type: String,
    default: '',
  },
  value: {
    type: Array,
    default: () => [],
  },
  options: {
    type: Array as PropType<OptionType[]>,
    default: () => [],
  },
  labelClass: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: Boolean,
    default: false,
  },
  errorMsg: {
    type: String,
    default: null,
  },
  placeholder: {
    type: String,
    default: '',
  },
  emptyMsg: {
    type: String,
    default: 'Không tìm thấy kết quả',
  },
})

const showDropdown = ref(false)
const selectedOptions = ref([] as OptionType[])
const keywordSearch = ref('')

const inputRef = ref<HTMLElement | null>(null)
const inputTagCalculator = ref<HTMLElement | null>(null)
const selectWrapper = ref<HTMLElement | null>(null)
const dropdown = ref<HTMLElement | null>(null)

const dropdownStyle = ref({})

const searchOptions = computed(() => {
  if (!keywordSearch.value || keywordSearch.value.trim().length == 0) {
    return props.options
  }
  return props.options.filter((option: any) => {
    return option.label.toLowerCase().includes(keywordSearch.value.toLowerCase())
  })
})

watch(
  () => props.value,
  (value) => {
    selectedOptions.value = value as OptionType[]
  },
  { immediate: true, deep: true },
)

const updatePosition = () => {
  if (!selectWrapper.value || !showDropdown.value) return {}

  const rect = selectWrapper.value.getBoundingClientRect()

  dropdownStyle.value = {
    position: 'absolute',
    top: `${rect.bottom + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
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

function indexSelectedOption(option: any) {
  return selectedOptions.value.findIndex((selected) => {
    if (!option || !selected) return false
    return selected.value == option.value && selected.label == option.label
  })
}

function checkSelectedOption(option: any) {
  return indexSelectedOption(option) > -1
}

function onShowDropDown() {
  if (props.disabled) {
    return
  }
  emit('focus')

  showDropdown.value = true

  if (inputRef.value) {
    inputRef.value.focus()
  }
  updatePosition()
}

function onOptionSelect(option: OptionType) {
  const index = indexSelectedOption(option)

  if (index > -1) {
    onOptionRemove(index)
    return
  }
  keywordSearch.value = ''
  selectedOptions.value.push(option)
  updateModel(selectedOptions.value)
}

function onOptionRemove(index: number) {
  if (index < 0) {
    return
  }
  const option = selectedOptions.value?.[index] || {}
  selectedOptions.value.splice(index, 1)
  emit('remove-tag', option)
  updateModel(selectedOptions.value)
}

function updateModel(value: any) {
  emit('change', value)
  emit('update:value', value)
  nextTick(() => {
    updatePosition()
  })
}

function clickOutSide() {
  showDropdown.value = false
  emit('blur')
}

function changeInput() {
  if (!inputTagCalculator.value || !inputRef.value) {
    return
  }
  const inputWidth = inputTagCalculator.value.clientWidth

  if (inputWidth < 40) {
    inputRef.value.style.minWidth = '40px'
  }
  inputRef.value.style.minWidth = inputTagCalculator.value.clientWidth + 'px'
}
</script>
