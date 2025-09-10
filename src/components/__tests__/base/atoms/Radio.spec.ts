import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Radio from '@/components/base/atoms/Radio.vue'

describe('Radio', () => {
  it('should renders radio with default classes and unselected state', () => {
    const wrapper = mount(Radio, {
      props: { radioValue: 'option1' },
    })
    const label = wrapper.find('label')
    const input = wrapper.find('input[type="radio"]') as any
    const icon = wrapper.find('i')

    expect(label.exists()).toBe(true)
    expect(label.classes()).toContain('flex')
    expect(label.classes()).toContain('cursor-pointer')

    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain('absolute')
    expect(input.classes()).toContain('opacity-0')
    expect(input.attributes('type')).toBe('radio')
    expect(input.element.checked).toBe(false)

    expect(icon.classes()).toContain('ikr')
    expect(icon.classes()).toContain('ik-radio-unselected')
    expect(icon.classes()).not.toContain('iks')
    expect(icon.classes()).not.toContain('ik-radio-selected')
  })

  it('should renders selected state when value matches radioValue', () => {
    const wrapper = mount(Radio, {
      props: { value: 'option1', radioValue: 'option1' },
    })
    const input = wrapper.find('input')
    const icon = wrapper.find('i')

    expect(input.element.checked).toBe(true)
    expect(icon.classes()).toContain('iks')
    expect(icon.classes()).toContain('ik-radio-selected')
    expect(icon.classes()).toContain('text-blue-500')
    expect(icon.classes()).not.toContain('ikr')
    expect(icon.classes()).not.toContain('ik-radio-unselected')
  })

  it('should applies disabled classes and attribute', () => {
    const wrapper = mount(Radio, {
      props: { disabled: true, radioValue: 'option1' },
    })
    const label = wrapper.find('label')
    const input = wrapper.find('input')
    const icon = wrapper.find('i')

    expect(label.classes()).toContain('cursor-not-allowed')
    expect(label.classes()).toContain('opacity-60')
    expect(input.attributes('disabled')).toBeDefined()
    expect(icon.classes()).toContain('text-gray-400')
  })

  it('should shows error state with message', () => {
    const wrapper = mount(Radio, {
      props: { error: true, errorMsg: 'Selection required', radioValue: 'option1' },
    })
    const icon = wrapper.find('i')
    const errorSpan = wrapper.find('span')

    expect(icon.classes()).toContain('text-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Selection required')
    expect(errorSpan.classes()).toContain('text-red-500')
  })

  it('should updates value with v-model', async () => {
    const wrapper = mount(Radio, {
      props: {
        value: 'option2',
        radioValue: 'option1',
        'onUpdate:value': (e: string) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')

    expect(input.element.checked).toBe(false)
    await input.setValue(true)
    expect(wrapper.props('value')).toBe('option1')
    expect(input.element.checked).toBe(true)
  })

  it('should emits change, focus, and blur events', async () => {
    const wrapper = mount(Radio, {
      props: { radioValue: 'option1' },
    })
    const input = wrapper.find('input')

    await input.trigger('change')
    expect(wrapper.emitted('change')).toBeTruthy()

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('should applies name attribute for radio group', () => {
    const wrapper = mount(Radio, {
      props: { name: 'group1', radioValue: 'option1' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('name')).toBe('group1')
  })

  it('should displays label prop', () => {
    const wrapper = mount(Radio, {
      props: { label: 'Option 1', radioValue: 'option1' },
    })
    const labelSpan = wrapper.find('span')
    expect(labelSpan.exists()).toBe(true)
    expect(labelSpan.text()).toBe('Option 1')
    expect(labelSpan.classes()).toContain('text-sm')
    expect(labelSpan.classes()).toContain('text-gray-900')
  })

  it('should renders label slot instead of label prop', () => {
    const wrapper = mount(Radio, {
      props: { label: 'Prop Label', radioValue: 'option1' },
      slots: { label: '<span>Slot Label</span>' },
    })
    const labelSpan = wrapper.find('span')
    expect(labelSpan.exists()).toBe(true)
    expect(labelSpan.text()).toBe('Slot Label')
    expect(labelSpan.html()).toContain('<span>Slot Label</span>')
    expect(wrapper.text()).not.toContain('Prop Label')
  })

  it('should applies custom container and input classes', () => {
    const wrapper = mount(Radio, {
      props: {
        containerClass: 'custom-container',
        inputClass: 'custom-input',
        radioValue: 'option1',
      },
    })
    const container = wrapper.find('div')
    const input = wrapper.find('input')
    expect(container.classes()).toContain('custom-container')
    expect(input.classes()).toContain('custom-input')
  })
})
