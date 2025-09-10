import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Checkbox from '@/components/base/atoms/Checkbox.vue'

describe('Checkbox', () => {
  it('should renders checkbox with default classes and unselected state', () => {
    const wrapper = mount(Checkbox)
    const label = wrapper.find('label')
    const input = wrapper.find('input[type="checkbox"]') as any
    const icon = wrapper.find('i')

    expect(label.exists()).toBe(true)
    expect(label.classes()).toContain('inline-flex')
    expect(label.classes()).toContain('cursor-pointer')

    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain('absolute')
    expect(input.classes()).toContain('opacity-0')
    expect(input.attributes('type')).toBe('checkbox')
    expect(input.element.checked).toBe(false)

    expect(icon.classes()).toContain('ikr')
    expect(icon.classes()).toContain('ik-checkbox-unselected')
    expect(icon.classes()).not.toContain('iks')
    expect(icon.classes()).not.toContain('ik-checkbox-selected')
  })

  it('should renders checked state with correct icon', () => {
    const wrapper = mount(Checkbox, {
      props: { value: true },
    })
    const input = wrapper.find('input')
    const icon = wrapper.find('i')

    expect(input.element.checked).toBe(true)
    expect(icon.classes()).toContain('iks')
    expect(icon.classes()).toContain('ik-checkbox-selected')
    expect(icon.classes()).toContain('text-blue-500')
    expect(icon.classes()).not.toContain('ikr')
    expect(icon.classes()).not.toContain('ik-checkbox-unselected')
  })

  it('should applies disabled classes and attribute', () => {
    const wrapper = mount(Checkbox, {
      props: { disabled: true },
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
    const wrapper = mount(Checkbox, {
      props: { error: true, errorMsg: 'Required field' },
    })
    const icon = wrapper.find('i')
    const errorSpan = wrapper.find('span')

    expect(icon.classes()).toContain('text-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Required field')
    expect(errorSpan.classes()).toContain('text-red-500')
  })

  it('should updates value with v-model', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        value: false,
        'onUpdate:value': (e: boolean) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')

    expect(input.element.checked).toBe(false)
    await input.setValue(true)
    expect(wrapper.props('value')).toBe(true)
    expect(input.element.checked).toBe(true)

    await input.setValue(false)
    expect(wrapper.props('value')).toBe(false)
    expect(input.element.checked).toBe(false)
  })

  it('should emits change, focus, and blur events', async () => {
    const wrapper = mount(Checkbox)
    const input = wrapper.find('input')

    await input.trigger('change')
    expect(wrapper.emitted('change')).toBeTruthy()

    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()

    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('should handles custom trueValue and falseValue', async () => {
    const wrapper = mount(Checkbox, {
      props: {
        trueValue: 'yes',
        falseValue: 'no',
        value: 'no',
        'onUpdate:value': (e: string) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')
    const icon = wrapper.find('i')

    expect(input.element.checked).toBe(false)
    expect(icon.classes()).toContain('ikr')
    expect(icon.classes()).toContain('ik-checkbox-unselected')

    await input.setValue(true)
    expect(wrapper.props('value')).toBe('yes')
    expect(input.element.checked).toBe(true)
    expect(icon.classes()).toContain('iks')
    expect(icon.classes()).toContain('ik-checkbox-selected')

    await input.setValue(false)
    expect(wrapper.props('value')).toBe('no')
    expect(input.element.checked).toBe(false)
  })

  it('should displays label prop', () => {
    const wrapper = mount(Checkbox, {
      props: { label: 'Agree to terms' },
    })
    const labelSpan = wrapper.find('span')
    expect(labelSpan.exists()).toBe(true)
    expect(labelSpan.text()).toBe('Agree to terms')
    expect(labelSpan.classes()).toContain('text-sm')
    expect(labelSpan.classes()).toContain('text-gray-900')
  })

  it('should renders label slot instead of label prop', () => {
    const wrapper = mount(Checkbox, {
      props: { label: 'Prop Label' },
      slots: { label: '<span>Slot Label</span>' },
    })
    const labelSpan = wrapper.find('span')
    expect(labelSpan.exists()).toBe(true)
    expect(labelSpan.text()).toBe('Slot Label')
    expect(labelSpan.html()).toContain('<span>Slot Label</span>')
    expect(wrapper.text()).not.toContain('Prop Label')
  })

  it('should applies custom container and checkbox classes', () => {
    const wrapper = mount(Checkbox, {
      props: {
        containerClass: 'custom-container',
        checkboxClass: 'custom-checkbox',
      },
    })
    const container = wrapper.find('div')
    const input = wrapper.find('input')
    expect(container.classes()).toContain('custom-container')
    expect(input.classes()).toContain('custom-checkbox')
  })
})
