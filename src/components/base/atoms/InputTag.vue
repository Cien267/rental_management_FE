<template>
  <div
    :class="
      cn(
        [
          { '!border-red-500': !focusInput && error },
          { 'bg-gray-50 !border-gray-50 cursor-not-allowed': disabled },
          { 'bg-white cursor-pointer': !disabled },
          { '!border-blue-500': focusInput },
          focusInput ? 'border-blue-500' : 'border-gray-150',
        ],
        containerClass,
        'w-full flex border border-solid rounded-lg p-1 relative',
      )
    "
  >
    <div class="flex flex-wrap items-center relative w-full overflow-hidden">
      <div
        v-for="(tag, index) in tags"
        :key="index"
        class="inline-flex mb-1 mr-1 max-w-full overflow-hidden"
      >
        <slot name="tag" :tag="tag" :index="index" :onRemove="removeTag">
          <div :class="cn(itemClass, 'flex bg-blue-500 px-1.5 py-0.5  items-center rounded')">
            <span class="text-white overflow-hidden text-ellipsis font-medium leading-5 grow">
              {{ tag }}
            </span>
            <i
              class="ikr pi-times text-blue-300 ml-1.5 cursor-pointer flex-none"
              @click="removeTag(index)"
            />
          </div>
        </slot>
      </div>

      <div class="flex-1">
        <input
          ref="tagInputRef"
          type="text"
          v-model="newTag"
          :placeholder="tags.length === 0 ? placeholder : ''"
          :disabled="disabled"
          @keydown.enter.prevent="addTag"
          @keydown="handleKeydown"
          @blur="blur"
          @focus="focus"
          @input="changeInput"
          class="border-none outline-none min-w-10 w-full py-0.25 text-sm"
        />
        <span
          ref="inputTagCalculator"
          class="absolute top-0 left-0 max-w-full overflow-hidden whitespace-pre invisible"
          >{{ newTag }}</span
        >
      </div>
    </div>

    <span class="absolute left-0 top-full text-red-500 text-xs" v-if="error && errorMsg">{{
      errorMsg
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue'
import { cn } from '@/helpers/utils'

const emit = defineEmits(['update:value', 'blur', 'focus', 'add-tag', 'remove-tag'])

const props = defineProps({
  containerClass: {
    type: String,
    default: '',
  },
  itemClass: {
    type: String,
    default: '',
  },
  value: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Add a tag...',
  },
  required: {
    type: Boolean,
    default: false,
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
  separator: {
    type: String,
    default: ',',
  },
})

const newTag = ref('')
const tags = ref([] as string[])
const tagInputRef = ref<HTMLElement | null>(null)
const inputTagCalculator = ref<HTMLElement | null>(null)
const focusInput = ref(false)

watch(
  () => props.value,
  (value: string[]) => {
    tags.value = value as string[]
  },
  { immediate: true, deep: true },
)

function addTag() {
  const tag = newTag.value.trim()
  if (tag && !tags.value.includes(tag)) {
    tags.value.push(tag)
    newTag.value = ''
    if (tagInputRef.value) tagInputRef.value.focus()
  }
}

function removeTag(index: any) {
  tags.value.splice(index, 1)
  if (tagInputRef.value) tagInputRef.value.focus()
}

function handleKeydown(event: any) {
  if (event.key === props.separator) {
    event.preventDefault()
    addTag()
  }

  if (event.key === 'Backspace' && !newTag.value && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
}

function focus() {
  focusInput.value = true
  emit('focus')
  if (tagInputRef.value) tagInputRef.value.focus()
}

function blur() {
  focusInput.value = false
  emit('blur')
}

function changeInput() {
  if (!inputTagCalculator.value || !tagInputRef.value) {
    return
  }
  const inputWidth = inputTagCalculator.value.clientWidth

  if (inputWidth < 40) {
    tagInputRef.value.style.minWidth = '40px'
  }
  tagInputRef.value.style.minWidth = inputTagCalculator.value.clientWidth + 'px'
}
</script>

<style scoped></style>
