import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import MultiSelect from '@/components/base/atoms/MultiSelect.vue'
import { h } from 'vue'

describe('MultiSelect', () => {
  afterEach(() => {
    document.body.innerHTML = '' // Clean up teleported elements
  })

  it('should render input with placeholder', () => {
    const wrapper = mount(MultiSelect, {
      props: { placeholder: 'Select options' },
    })
    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Select options')
  })

  it('should show dropdown on container click', async () => {
    const wrapper = mount(MultiSelect, {
      props: { options: [{ value: '1', label: 'Option 1' }] },
    })
    const container = wrapper.find('.w-full .overflow-hidden')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    const dropdown = document.querySelector('.bg-white')
    expect(dropdown).not.toBeNull()
    expect(wrapper.vm.showDropdown).toBe(true)
  })

  it('should close dropdown on click outside', async () => {
    const wrapper = mount(MultiSelect)
    const container = wrapper.find('.w-full .overflow-hidden')
    await container.trigger('click')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.bg-white')).not.toBeNull()
    wrapper.vm.clickOutSide()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.bg-white')).toBeNull()
    expect(wrapper.vm.showDropdown).toBe(false)
  })

  it('should render selected options as tags', async () => {
    const wrapper = mount(MultiSelect, {
      props: {
        value: [{ value: '1', label: 'Option 1' }],
      },
    })
    const tag = wrapper.find('.bg-blue-500')
    expect(tag.exists()).toBe(true)
    expect(tag.text()).toContain('Option 1')
  })

  it('should render custom tag slot', async () => {
    const wrapper = mount(MultiSelect, {
      props: { value: [{ value: '1', label: 'Option 1' }] },
      slots: { tag: ({ tag }) => h('span', { class: 'custom-tag' }, `${tag.label}`) },
    })
    const customTag = wrapper.find('.custom-tag')
    expect(customTag.exists()).toBe(true)
    expect(customTag.text()).toBe('Option 1')
    expect(wrapper.find('.bg-blue-500').exists()).toBe(false)
  })

  it('should render options in dropdown', async () => {
    const wrapper = mount(MultiSelect, {
      props: {
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      },
    })
    await wrapper.find('.w-full  .overflow-hidden').trigger('click')
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll('.cursor-pointer')
    expect(options.length).toBe(2)
    expect(options[0].textContent).toContain('Option 1')
    expect(options[1].textContent).toContain('Option 2')
  })

  it('should render custom option slot', async () => {
    const wrapper = mount(MultiSelect, {
      props: { options: [{ value: '1', label: 'Option 1' }] },
      slots: { option: ({ option }) => h('span', { class: 'custom-option' }, `${option.label}`) },
    })
    await wrapper.find('.w-full  .overflow-hidden').trigger('click')
    await wrapper.vm.$nextTick()
    const customOption = document.querySelector('.custom-option') as any
    expect(customOption).not.toBeNull()
    expect(customOption.textContent).toBe('Option 1')
  })

  it('should select an option and emit update', async () => {
    const wrapper = mount(MultiSelect, {
      props: { options: [{ value: '1', label: 'Option 1' }] },
    })
    await wrapper.find('.w-full  .overflow-hidden').trigger('click')
    await wrapper.vm.$nextTick()
    const option = document.querySelector('.cursor-pointer') as any
    await option.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectedOptions).toEqual([{ value: '1', label: 'Option 1' }])
    expect(wrapper.emitted('update:value')?.[0]).toEqual([[{ value: '1', label: 'Option 1' }]])
  })

  it('should remove a selected option and emit remove-tag', async () => {
    const wrapper = mount(MultiSelect, {
      props: { value: [{ value: '1', label: 'Option 1' }] },
    })
    const removeIcon = wrapper.find('.ik-xmark')
    await removeIcon.trigger('click')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.selectedOptions).toEqual([])
    expect(wrapper.emitted('remove-tag')?.[0]).toEqual([{ value: '1', label: 'Option 1' }])
  })

  it('should filter options based on search', async () => {
    const wrapper = mount(MultiSelect, {
      props: {
        options: [
          { value: '1', label: 'Option 1' },
          { value: '2', label: 'Option 2' },
        ],
      },
    })
    await wrapper.find('.w-full  .overflow-hidden').trigger('click')
    await wrapper.vm.$nextTick()
    const input = wrapper.find('input')
    await input.setValue('Option 1')
    await input.trigger('input')
    await wrapper.vm.$nextTick()
    const options = document.querySelectorAll('.cursor-pointer')
    expect(options.length).toBe(1)
    expect(options[0].textContent).toContain('Option 1')
  })

  it('should adjust input width based on content', async () => {
    const wrapper = mount(MultiSelect)
    const input = wrapper.find('input')
    const calculator = wrapper.find('.invisible')
    vi.spyOn(calculator.element, 'clientWidth', 'get').mockReturnValue(50)
    await input.setValue('Search')
    await input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(input.element.style.minWidth).toBe('50px')
  })

  it('should apply disabled state', () => {
    const wrapper = mount(MultiSelect, {
      props: { disabled: true },
    })
    const input = wrapper.find('input')
    const container = wrapper.find('.w-full  .overflow-hidden')
    expect(input.attributes('disabled')).toBeDefined()
    expect(container.classes()).toContain('bg-gray-50')
    expect(container.classes()).toContain('cursor-not-allowed')
  })

  it('should show error state with message', () => {
    const wrapper = mount(MultiSelect, {
      props: { error: true, errorMsg: 'Selection required' },
    })
    const container = wrapper.find('.w-full  .overflow-hidden')
    const errorSpan = wrapper.find('.text-red-500')
    expect(container.classes()).toContain('border-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Selection required')
  })
})
