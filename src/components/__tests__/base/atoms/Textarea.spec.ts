import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Textarea from '@/components/base/atoms/Textarea.vue'

describe('Textarea', () => {
  it('should renders textarea with default classes', () => {
    const wrapper = mount(Textarea)
    const textarea = wrapper.find('textarea')
    expect(textarea.exists()).toBe(true)
    expect(textarea.classes()).toContain('block')
    expect(textarea.classes()).toContain('w-full')
    expect(textarea.classes()).toContain('rounded-lg')
    expect(textarea.classes()).toContain('border-gray-150')
    expect(textarea.classes()).toContain('bg-white')
    expect(textarea.classes()).toContain('resize-none')
    expect(textarea.attributes('rows')).toBe('3')
  })

  it('should applies disabled classes and attribute', () => {
    const wrapper = mount(Textarea, {
      props: { disabled: true },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('disabled')).toBeDefined()
    expect(textarea.classes()).toContain('bg-gray-50')
    expect(textarea.classes()).toContain('border-gray-50')
    expect(textarea.classes()).toContain('cursor-not-allowed')
    expect(textarea.classes()).not.toContain('border-gray-150')
  })

  it('should shows error state with message', () => {
    const wrapper = mount(Textarea, {
      props: { error: true, errorMsg: 'Input required' },
    })
    const textarea = wrapper.find('textarea')
    const errorSpan = wrapper.find('span')
    expect(textarea.classes()).toContain('border-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Input required')
    expect(errorSpan.classes()).toContain('text-red-500')
  })

  it('should updates value with v-model', async () => {
    const wrapper = mount(Textarea, {
      props: {
        value: 'initial',
        'onUpdate:value': (e: string) => wrapper.setProps({ value: e }),
      },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.element.value).toBe('initial')

    await textarea.setValue('new value')
    expect(wrapper.props('value')).toBe('new value')
    expect(textarea.element.value).toBe('new value')
  })

  it('should emits input, focus, blur, keydown, keyup, and keypress events', async () => {
    const wrapper = mount(Textarea)
    const textarea = wrapper.find('textarea')

    await textarea.trigger('input')
    expect(wrapper.emitted('input')).toBeTruthy()

    await textarea.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await textarea.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()

    await textarea.trigger('keydown')
    expect(wrapper.emitted('keydown')).toBeTruthy()

    await textarea.trigger('keyup')
    expect(wrapper.emitted('keyup')).toBeTruthy()

    await textarea.trigger('keypress')
    expect(wrapper.emitted('keypress')).toBeTruthy()
  })

  it('should applies rows prop', () => {
    const wrapper = mount(Textarea, {
      props: { rows: 5 },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('rows')).toBe('5')
  })

  it('should applies resize prop', () => {
    const wrapper = mount(Textarea, {
      props: { resize: 'y' },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.classes()).toContain('resize-y')
    expect(textarea.classes()).not.toContain('resize-none')
  })

  it('should auto-resizes height when enableAutoResize is true', async () => {
    const wrapper = mount(Textarea, {
      props: {
        value: 'Line 1\nLine 2\nLine 3',
        enableAutoResize: true,
        'onUpdate:value': (e: string) => wrapper.setProps({ value: e }),
      },
    })
    const textarea = wrapper.find('textarea')

    Object.defineProperty(textarea.element, 'scrollHeight', {
      value: 60,
      writable: true,
    })

    await wrapper.setProps({ value: 'Line 1\nLine 2\nLine 3\nLine 4' })
    await wrapper.vm.$nextTick()
    expect(textarea.element.style.height).toBe('70px')

    expect(textarea.element.style.height).toBe('70px')
  })

  it('should does not auto-resize when enableAutoResize is false', async () => {
    const wrapper = mount(Textarea, {
      props: {
        value: 'Line 1\nLine 2',
        enableAutoResize: false,
        'onUpdate:value': (e: string) => wrapper.setProps({ value: e }),
      },
    })
    const textarea = wrapper.find('textarea')

    Object.defineProperty(textarea.element, 'scrollHeight', {
      value: 60,
      writable: true,
    })

    await wrapper.setProps({ value: 'Line 1\nLine 2\nLine 3' })
    await wrapper.vm.$nextTick()
    expect(textarea.element.style.height).toBe('')
  })

  it('should displays placeholder', () => {
    const wrapper = mount(Textarea, {
      props: { placeholder: 'Enter text here' },
    })
    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('placeholder')).toBe('Enter text here')
  })

  it('should applies custom container and textarea classes', () => {
    const wrapper = mount(Textarea, {
      props: {
        containerClass: 'custom-container',
        textareaClass: 'custom-textarea',
      },
    })
    const container = wrapper.find('div')
    const textarea = wrapper.find('textarea')
    expect(container.classes()).toContain('custom-container')
    expect(textarea.classes()).toContain('custom-textarea')
  })
})
