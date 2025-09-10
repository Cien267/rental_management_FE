import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InputNumber from '@/components/base/atoms/InputNumber.vue'
import { preventInputNotNumber } from '@/helpers/utils'

vi.mock('@/helpers/utils', () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(' '),
  preventInputNotNumber: vi.fn(),
}))

describe('InputNumber', () => {
  it('should renders input with default classes', () => {
    const wrapper = mount(InputNumber)
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')
    expect(input.classes()).toContain('block')
    expect(input.classes()).toContain('w-full')
    expect(input.classes()).toContain('rounded-lg')
    expect(input.classes()).toContain('border-gray-150')
    expect(input.classes()).toContain('bg-white')
  })

  it('should applies disabled classes and attribute', () => {
    const wrapper = mount(InputNumber, {
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
    const wrapper = mount(InputNumber, {
      props: { error: true, errorMsg: 'Invalid number' },
    })
    const input = wrapper.find('input')
    const errorSpan = wrapper.find('span')
    expect(input.classes()).toContain('border-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Invalid number')
    expect(errorSpan.classes()).toContain('text-red-500')
  })

  it('should updates value with v-model and formats number', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        value: 1234,
        'onUpdate:value': (e: number | null) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('1,234')

    await input.setValue('5678')
    expect(wrapper.props('value')).toBe(5678)
    expect(input.element.value).toBe('5,678')

    await input.setValue('')
    expect(wrapper.props('value')).toBe(null)
    expect(input.element.value).toBe('')
  })

  it('should emits input, focus, blur, keydown, keyup, and keypress events', async () => {
    const wrapper = mount(InputNumber)
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
    const wrapper = mount(InputNumber, {
      props: {
        value: 123,
        useClearIcon: true,
        'onUpdate:value': (e: number | null) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')
    const clearIcon = wrapper.find('i')

    expect(input.element.value).toBe('123')
    expect(clearIcon.exists()).toBe(true)
    expect(clearIcon.classes()).toContain('iks')
    expect(clearIcon.classes()).toContain('ik-circle-xmark')

    await clearIcon.trigger('click')
    expect(wrapper.props('value')).toBe(null)
    expect(input.element.value).toBe('')
    expect(wrapper.find('i').exists()).toBe(false)
  })

  it('should converts non-numeric input to numeric value', async () => {
    const wrapper = mount(InputNumber, {
      props: {
        value: null,
        'onUpdate:value': (e: number | null) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')

    await input.setValue('12ab34')
    expect(wrapper.props('value')).toBe(1234)
    expect(input.element.value).toBe('1,234')
  })

  it('should displays placeholder', () => {
    const wrapper = mount(InputNumber, {
      props: { placeholder: 'Enter a number' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Enter a number')
  })

  it('should applies custom container and input classes', () => {
    const wrapper = mount(InputNumber, {
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

  it('should calls preventInputNotNumber on keypress', async () => {
    const wrapper = mount(InputNumber)
    const input = wrapper.find('input')

    vi.mocked(preventInputNotNumber).mockClear()

    await input.trigger('keypress', { key: 'a' })
    expect(vi.mocked(preventInputNotNumber)).toHaveBeenCalled()
    expect(wrapper.emitted('keypress')).toBeTruthy()
  })
})
