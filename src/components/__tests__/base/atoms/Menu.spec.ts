import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Menu from '@/components/base/atoms/Menu.vue'
import { h } from 'vue'

describe('Menu', () => {
  afterEach(() => {
    document.body.innerHTML = '' // Clean up teleported elements
  })

  it('should render trigger with default button', () => {
    const wrapper = mount(Menu)
    const trigger = wrapper.find('button')
    expect(trigger.exists()).toBe(true)
    expect(trigger.text()).toBe('Menu')
  })

  it('should render custom trigger slot', () => {
    const wrapper = mount(Menu, {
      slots: { trigger: '<span class="custom-trigger">Custom</span>' },
    })
    const customTrigger = wrapper.find('.custom-trigger')
    expect(customTrigger.exists()).toBe(true)
    expect(customTrigger.text()).toBe('Custom')
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('should toggle menu on trigger click', async () => {
    const wrapper = mount(Menu)
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    const menu = document.querySelector('.bg-white')
    expect(menu).not.toBeNull()
    expect(wrapper.vm.isOpen).toBe(true)
  })

  it('should close menu on click outside', async () => {
    const wrapper = mount(Menu)
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.bg-white')).not.toBeNull()
    wrapper.vm.clickOutside()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.bg-white')).toBeNull()
    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('should render items with itemLabel', async () => {
    const wrapper = mount(Menu, {
      props: {
        items: [{ name: 'Item 1' }, { name: 'Item 2' }],
        itemLabel: 'name',
      },
    })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    const menuItems = document.querySelectorAll('.cursor-pointer')
    expect(menuItems.length).toBe(2)
    expect(menuItems[0].textContent).toBe('Item 1')
    expect(menuItems[1].textContent).toBe('Item 2')
  })

  it('should call item action and close menu on click', async () => {
    const actionSpy = vi.fn()
    const wrapper = mount(Menu, {
      props: {
        items: [{ name: 'Item 1', action: actionSpy }],
        itemLabel: 'name',
      },
    })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    const item = document.querySelector('.cursor-pointer') as any
    await item.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(actionSpy).toHaveBeenCalled()
    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('should render custom item slot', async () => {
    const wrapper = mount(Menu, {
      props: { items: [{ name: 'Item 1' }] },
      slots: {
        item: ({ items }) => h('span', { class: 'custom-item' }, `${items[0].name}`),
      },
    })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    const customItem = document.querySelector('.custom-item') as any
    expect(customItem).not.toBeNull()
    expect(customItem.textContent).toBe('Item 1')
  })

  it('should apply position bottom-right', async () => {
    const wrapper = mount(Menu, {
      props: { position: 'bottom-right' },
    })
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    const menu = document.querySelector('.bg-white') as any
    expect(menu.classList.contains('top-full')).toBe(true)
    expect(menu.classList.contains('mt-2')).toBe(true)
    expect(menu.classList.contains('right-0')).toBe(true)
  })

  it('should apply custom container and menu classes', async () => {
    const wrapper = mount(Menu, {
      props: { containerClass: 'custom-container', menuClass: 'custom-menu' },
    })
    const container = wrapper.find('.relative')
    expect(container.classes()).toContain('custom-container')
    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await wrapper.vm.$nextTick()
    const menu = document.querySelector('.bg-white') as any
    expect(menu.classList.contains('custom-menu')).toBe(true)
  })
})
