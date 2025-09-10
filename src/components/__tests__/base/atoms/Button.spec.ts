import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@/components/base/atoms/Button.vue'

describe('Button', () => {
  it('should render button with default props', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.classes()).toContain('inline-flex')
    expect(button.classes()).toContain('bg-white')
    expect(button.classes()).toContain('text-gray-700')
    expect(button.classes()).toContain('px-3')
    expect(button.classes()).toContain('h-8')
    expect(button.classes()).toContain('rounded-lg')
    expect(button.text()).toBe('Click me')
  })

  it('should apply primary type styles', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-blue-500')
    expect(button.classes()).toContain('text-white')
    expect(button.classes()).toContain('border-none')
  })

  it('should apply outline styles', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary', outline: true },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-white')
    expect(button.classes()).toContain('text-blue-500')
    expect(button.classes()).toContain('border-blue-500')
  })

  it('should apply disabled styles', () => {
    const wrapper = mount(Button, {
      props: { type: 'primary', disabled: true },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('bg-blue-200')
    expect(button.classes()).toContain('text-white')
    expect(button.classes()).toContain('border-none')
  })

  it('should apply rounded styles', () => {
    const wrapper = mount(Button, {
      props: { rounded: true },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('rounded-full')
    expect(button.classes()).not.toContain('rounded-lg')
  })

  it('should apply size xl styles', () => {
    const wrapper = mount(Button, {
      props: { size: 'xl' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('px-4')
    expect(button.classes()).toContain('py-2.5')
    expect(button.classes()).toContain('text-lg')
    expect(button.classes()).toContain('h-12')
  })

  it('should render icon on left', () => {
    const wrapper = mount(Button, {
      props: { classIcon: 'ik-test-icon', posIcon: 'left' },
      slots: { default: 'Click me' },
    })
    const button = wrapper.find('button')
    const icon = button.find('i')
    const span = button.find('span')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('ik-test-icon')
    expect(icon.classes()).toContain('mr-1')
    const children = Array.from(button.element.children)
    expect(children[0]).toBe(icon.element)
    expect(children[1]).toBe(span.element)
  })

  it('should render icon on right', () => {
    const wrapper = mount(Button, {
      props: { classIcon: 'ik-test-icon', posIcon: 'right' },
      slots: { default: 'Click me' },
    })
    const button = wrapper.find('button')
    const icon = button.find('i')
    const span = button.find('span')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('ik-test-icon')
    expect(icon.classes()).toContain('ml-1')
    const children = Array.from(button.element.children)
    expect(children[0]).toBe(span.element)
    expect(children[1]).toBe(icon.element)
  })

  it('should render custom icon slot', () => {
    const wrapper = mount(Button, {
      props: { posIcon: 'left' },
      slots: { default: 'Click me', icon: '<i class="custom-icon"></i>' },
    })
    const button = wrapper.find('button')
    const icon = button.find('.custom-icon')
    expect(icon.exists()).toBe(true)
    expect(button.find('i.mr-1').exists()).toBe(false)
  })

  it('should render loading icon when loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true, classLoadingIcon: 'ik-loading' },
      slots: { default: 'Click me' },
    })
    const button = wrapper.find('button')
    const loadingIcon = button.find('i')
    expect(loadingIcon.exists()).toBe(true)
    expect(loadingIcon.classes()).toContain('ik-loading')
    expect(loadingIcon.classes()).toContain('ml-1')
  })

  it('should render custom loading-icon slot', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: 'Click me', 'loading-icon': '<i class="custom-loading"></i>' },
    })
    const button = wrapper.find('button')
    const loadingIcon = button.find('.custom-loading')
    expect(loadingIcon.exists()).toBe(true)
    expect(button.find('i.ml-1').exists()).toBe(false)
  })

  it('should apply custom class', () => {
    const wrapper = mount(Button, {
      props: { customClass: 'custom-btn' },
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('custom-btn')
  })

  it('should truncate long text', () => {
    const wrapper = mount(Button, {
      slots: { default: 'This is a very long button text that should truncate' },
    })
    const span = wrapper.find('span')
    expect(span.classes()).toContain('max-w-full')
    expect(span.classes()).toContain('truncate')
  })
})
