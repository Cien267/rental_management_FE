import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Select from '@/components/base/atoms/Select.vue'
import { h } from 'vue'

describe('Select', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should render input with default classes and icon', () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name' },
    })
    const input = wrapper.find('input')
    const icon = wrapper.find('.iks')
    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain('block')
    expect(input.classes()).toContain('w-full')
    expect(input.classes()).toContain('border-gray-150')
    expect(input.attributes('readonly')).toBeDefined()
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('ik-angle-small-down')
  })

  it('should display placeholder when no option selected', () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', placeholder: 'Select an option' },
    })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('Select an option')
    expect(input.element.value).toBe('')
  })

  it('should apply disabled state', () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', disabled: true },
    })
    const input = wrapper.find('input')
    expect(input.attributes('disabled')).toBeDefined()
    expect(input.classes()).toContain('bg-gray-50')
    expect(input.classes()).toContain('cursor-not-allowed')
  })

  it('should show error state with message', () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', error: true, errorMsg: 'Selection required' },
    })
    const input = wrapper.find('input')
    const errorSpan = wrapper.find('span')
    expect(input.classes()).toContain('border-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Selection required')
  })

  it('should open dropdown on click', async () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', options: [{ name: 'Option 1' }, { name: 'Option 2' }] },
    })
    const container = wrapper.find('.relative')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-gray-0') as any
    expect(dropdown).not.toBeNull()
    expect(dropdown.classList.contains('shadow-block')).toBe(true)
  })

  it('should update value with v-model on option select', async () => {
    const wrapper = mount(Select, {
      props: {
        optionLabel: 'name',
        options: [{ name: 'Option 1' }, { name: 'Option 2' }],
        selectedOption: null,
        'onUpdate:selectedOption': (e) => wrapper.setProps({ selectedOption: e }),
      },
    })
    const container = wrapper.find('.relative')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-gray-0') as any
    const options = dropdown.querySelectorAll('.cursor-pointer')
    expect(options.length).toBe(2)
    await options[0].dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.props('selectedOption')).toEqual({ name: 'Option 1' })
    expect(wrapper.find('input').element.value).toBe('Option 1')
  })

  it('should emit select-option event', async () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', options: [{ name: 'Option 1' }] },
    })
    const container = wrapper.find('.relative')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-gray-0') as any
    const option = dropdown.querySelector('.cursor-pointer')
    await option.dispatchEvent(new Event('click'))
    expect(wrapper.emitted('select-option')).toBeTruthy()
    expect(wrapper.emitted('select-option')?.[0] ?? null).toEqual([{ name: 'Option 1' }])
  })

  it('should close dropdown on blur', async () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', options: [{ name: 'Option 1' }] },
    })
    const input = wrapper.find('input')
    await input.trigger('focus')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.bg-gray-0')).not.toBeNull()
    await input.trigger('blur')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.bg-gray-0')).toBeNull()
  })

  it('should render custom option slot', async () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', options: [{ name: 'Option 1' }] },
      slots: {
        option: ({ option }) => h('span', { class: 'custom-tag' }, `${option.name} - Custom`),
      },
    })
    const container = wrapper.find('.relative')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-gray-0') as any
    const option = dropdown.querySelector('.cursor-pointer')
    expect(option.textContent).toBe('Option 1 - Custom')
  })

  it('should render header and footer slots', async () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', options: [{ name: 'Option 1' }] },
      slots: { header: '<div>Header</div>', footer: '<div>Footer</div>' },
    })
    const container = wrapper.find('.relative')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-gray-0') as any
    expect(dropdown.textContent).toContain('Header')
    expect(dropdown.textContent).toContain('Footer')
  })

  it('should apply custom classes', async () => {
    const wrapper = mount(Select, {
      props: {
        optionLabel: 'name',
        containerClass: 'custom-container',
        inputClass: 'custom-input',
        dropdownClass: 'custom-dropdown',
        options: [{ name: 'Option 1' }],
      },
    })
    const container = wrapper.find('.relative')
    const input = wrapper.find('input')
    expect(container.classes()).toContain('custom-container')
    expect(input.classes()).toContain('custom-input')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-gray-0') as any
    expect(dropdown.classList.contains('custom-dropdown')).toBe(true)
  })

  it('should update dropdown position on focus', async () => {
    const wrapper = mount(Select, {
      props: { optionLabel: 'name', options: [{ name: 'Option 1' }] },
    })
    const input = wrapper.find('input') as any
    input.element.getBoundingClientRect = vi.fn(() => ({
      bottom: 50,
      left: 10,
      width: 200,
    }))
    await input.trigger('focus')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-gray-0') as any
    expect(dropdown.getAttribute('style')).toContain('top: 54px')
    expect(dropdown.getAttribute('style')).toContain('left: 0px')
    expect(dropdown.getAttribute('style')).toContain('inset-inline-start: 10px')
    expect(dropdown.getAttribute('style')).toContain('min-width: 200px')
  })
})
