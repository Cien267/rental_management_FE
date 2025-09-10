import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputText from '@/components/base/atoms/InputText.vue'

describe('InputText', () => {
  it('should renders input with default classes', () => {
    const wrapper = mount(InputText)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain('block')
    expect(input.classes()).toContain('w-full')
    expect(input.classes()).toContain('rounded-lg')
    expect(input.classes()).toContain('border-gray-150')
    expect(input.classes()).toContain('bg-white')
  })

  it('should applies disabled classes and attribute', () => {
    const wrapper = mount(InputText, {
      props: { disabled: true },
    })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.classes()).toContain('bg-gray-50')
    expect(input.classes()).toContain('border-gray-50')
    expect(input.classes()).toContain('cursor-not-allowed')
    expect(input.classes()).not.toContain('border-gray-150')
  })

  it('should shows error state with message', () => {
    const wrapper = mount(InputText, {
      props: { error: true, errorMsg: 'Something went wrong.' },
    })
    const input = wrapper.find('input')
    const errorSpan = wrapper.find('span')
    expect(input.classes()).toContain('border-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Something went wrong.')
    expect(errorSpan.classes()).toContain('text-red-500')
  })

  it('should updates value with v-model', async () => {
    const wrapper = mount(InputText, {
      props: { value: 'initial', 'onUpdate:value': (e: string) => wrapper.setProps({ value: e }) },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('initial')

    await input.setValue('new value')
    expect(wrapper.props('value')).toBe('new value')
  })

  it('should emits input, focus, blur, keydown, keyup, and keypress events', async () => {
    const wrapper = mount(InputText)
    const input = wrapper.find('input')

    await input.trigger('input')
    expect(wrapper.emitted('input')).toBeTruthy()

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()

    await input.trigger('keydown')
    expect(wrapper.emitted('keydown')).toBeTruthy()

    await input.trigger('keyup')
    expect(wrapper.emitted('keyup')).toBeTruthy()

    await input.trigger('keypress')
    expect(wrapper.emitted('keypress')).toBeTruthy()
  })

  it('should shows clear icon and clears input on click', async () => {
    const wrapper = mount(InputText, {
      props: {
        value: 'test',
        useClearIcon: true,
        'onUpdate:value': (e: string) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')
    const clearIcon = wrapper.find('i')

    expect(input.element.value).toBe('test')
    expect(clearIcon.exists()).toBe(true)
    expect(clearIcon.classes()).toContain('iks')
    expect(clearIcon.classes()).toContain('ik-circle-xmark')

    await clearIcon.trigger('click')
    expect(wrapper.props('value')).toBe('')
    expect(input.element.value).toBe('')
    expect(wrapper.find('i').exists()).toBe(false)
  })

  it('should applies minLength and maxLength attributes', () => {
    const wrapper = mount(InputText, {
      props: { minLength: 3, maxLength: 10 },
    })
    const input = wrapper.find('input')
    expect(input.attributes('minlength')).toBe('3')
    expect(input.attributes('maxlength')).toBe('10')
  })

  it('should displays placeholder', () => {
    const wrapper = mount(InputText, {
      props: { placeholder: 'Enter text' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Enter text')
  })

  it('should applies custom container and input classes', () => {
    const wrapper = mount(InputText, {
      props: {
        containerClass: 'custom-container',
        inputClass: 'custom-input',
      },
    })
    const container = wrapper.find('div')
    const input = wrapper.find('input')
    expect(container.classes()).toContain('custom-container')
    expect(input.classes()).toContain('custom-input')
  })
})
