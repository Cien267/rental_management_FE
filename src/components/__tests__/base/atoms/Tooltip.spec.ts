import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from '@/components/base/atoms/Tooltip.vue'

describe('Tooltip', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should render trigger with default icon', () => {
    const wrapper = mount(Tooltip)
    const trigger = wrapper.find('i')
    expect(trigger.exists()).toBe(true)
    expect(trigger.classes()).toContain('ikr')
    expect(trigger.classes()).toContain('ik-circle-info')
    expect(trigger.classes()).toContain('cursor-pointer')
    expect(trigger.classes()).toContain('text-gray-400')
  })

  it('should not show tooltip by default', () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip text' },
    })
    const tooltip = wrapper.find('.bg-tooltip')
    expect(tooltip.exists()).toBe(false)
  })

  it('should show tooltip on mouseenter', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip text' },
    })
    const container = wrapper.find('.relative')

    await container.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    const tooltip = document.querySelector('.bg-tooltip') as any

    expect(tooltip).not.toBeNull()
    expect(tooltip.textContent).toBe('Tooltip text')
  })

  it('should hide tooltip on mouseleave', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip text' },
    })
    await wrapper.trigger('mouseenter')
    await wrapper.trigger('mouseleave')
    const tooltip = wrapper.find('.bg-tooltip')
    expect(tooltip.exists()).toBe(false)
  })

  it('should not show tooltip when disabled', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip text', disabled: true },
    })
    await wrapper.trigger('mouseenter')
    const tooltip = wrapper.find('.bg-tooltip')
    expect(tooltip.exists()).toBe(false)
  })

  it('should apply position classes for top', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tooltip text', position: 'top' },
    })
    const container = wrapper.find('.relative')

    await container.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    const tooltip = document.querySelector('.bg-tooltip') as any
    const arrow = document.querySelector('.w-2') as any
    expect(tooltip.classList.contains('bottom-full')).toBe(true)
    expect(tooltip.classList.contains('mb-2')).toBe(true)
    expect(tooltip.classList.contains('left-1/2')).toBe(true)
    expect(tooltip.classList.contains('-translate-x-1/2')).toBe(true)

    expect(arrow.classList.contains('bottom-[-4px]')).toBe(true)
    expect(arrow.classList.contains('left-1/2')).toBe(true)
    expect(arrow.classList.contains('-translate-x-1/2')).toBe(true)
    expect(arrow.classList.contains('rotate-45')).toBe(true)
  })

  it('should render content slot instead of content prop', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Prop content' },
      slots: { content: '<span>Slot content</span>' },
    })
    const container = wrapper.find('.relative')

    await container.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    const tooltip = document.querySelector('.bg-tooltip') as any
    expect(tooltip.textContent).toBe('Slot content')
    expect(tooltip?.innerHTML).toContain('<span>Slot content</span>')
    expect(wrapper.text()).not.toContain('Prop content')
  })

  it('should render custom trigger slot', () => {
    const wrapper = mount(Tooltip, {
      slots: { trigger: '<button>Hover me</button>' },
    })
    const trigger = wrapper.find('button')
    expect(trigger.exists()).toBe(true)
    expect(trigger.text()).toBe('Hover me')
    expect(wrapper.find('i').exists()).toBe(false)
  })

  it('should apply custom classes', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        containerClass: 'custom-container',
        tooltipClass: 'custom-tooltip',
        arrowClass: 'custom-arrow',
        content: 'Tooltip text',
      },
    })
    const container = wrapper.find('.relative')
    expect(container.classes()).toContain('custom-container')
    await container.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    const tooltip = document.querySelector('.bg-tooltip') as any
    console.log('tooltip', tooltip.classList)
    const arrow = document.querySelector('.w-2') as any
    expect(tooltip.classList.contains('custom-tooltip')).toBe(true)
    expect(arrow.classList.contains('custom-arrow')).toBe(true)
  })

  it('should not show tooltip when content is empty and no slot', async () => {
    const wrapper = mount(Tooltip)
    await wrapper.trigger('mouseenter')
    const tooltip = wrapper.find('.bg-tooltip')
    expect(tooltip.exists()).toBe(false)
  })
})
