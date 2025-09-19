import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InputTag from '@/components/base/atoms/InputTag.vue'
import { h } from 'vue'

describe('InputTag', () => {
  it('should render with default props', () => {
    const wrapper = mount(InputTag)
    const container = wrapper.find('.w-full')
    const input = wrapper.find('input')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('bg-white')
    expect(container.classes()).toContain('border-gray-150')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Add a tag...')
  })

  it('should add a tag on enter key', async () => {
    const wrapper = mount(InputTag, {
      props: { value: [], 'onUpdate:value': (e) => wrapper.setProps({ value: e }) },
    })
    const input = wrapper.find('input')
    await input.setValue('Tag1')
    await input.trigger('keydown.enter')
    expect(wrapper.props('value')).toEqual(['Tag1'])
    expect(wrapper.findAll('.bg-blue-500').length).toBe(1)
    expect(wrapper.find('.bg-blue-500').text()).toContain('Tag1')
  })

  it('should remove a tag on xmark click', async () => {
    const wrapper = mount(InputTag, {
      props: { value: ['Tag1'], 'onUpdate:value': (e) => wrapper.setProps({ value: e }) },
    })
    const xmark = wrapper.find('.pi-times')
    await xmark.trigger('click')
    expect(wrapper.props('value')).toEqual([])
    expect(wrapper.findAll('.bg-blue-500').length).toBe(0)
  })

  it('should remove last tag on backspace when input is empty', async () => {
    const wrapper = mount(InputTag, {
      props: {
        value: ['Tag1'],
        'onUpdate:value': (e) => wrapper.setProps({ value: e }),
      },
    })
    const input = wrapper.find('input')
    expect(input.element.value).toBe('')
    await input.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.props('value')).toEqual([])
  })

  it('should add tag with custom separator', async () => {
    const wrapper = mount(InputTag, {
      props: { value: [], separator: ',', 'onUpdate:value': (e) => wrapper.setProps({ value: e }) },
    })
    const input = wrapper.find('input')
    await input.setValue('Tag1')
    await input.trigger('keydown', { key: ',' })
    expect(wrapper.props('value')).toEqual(['Tag1'])
  })

  it('should apply disabled styles', () => {
    const wrapper = mount(InputTag, {
      props: { disabled: true },
    })
    const container = wrapper.find('.w-full')
    const input = wrapper.find('input')
    expect(container.classes()).toContain('bg-gray-50')
    expect(container.classes()).toContain('cursor-not-allowed')
    expect(input.attributes('disabled')).toBeDefined()
  })

  it('should show error state with message', () => {
    const wrapper = mount(InputTag, {
      props: { error: true, errorMsg: 'Tags required' },
    })
    const container = wrapper.find('.w-full')
    const errorSpan = wrapper.find('span.text-red-500')
    expect(container.classes()).toContain('!border-red-500')
    expect(errorSpan.exists()).toBe(true)
    expect(errorSpan.text()).toBe('Tags required')
  })

  it('should apply focus styles', async () => {
    const wrapper = mount(InputTag)
    const input = wrapper.find('input')
    await input.trigger('focus')
    const container = wrapper.find('.w-full')
    expect(container.classes()).toContain('border-blue-500')
  })

  it('should emit focus and blur events', async () => {
    const wrapper = mount(InputTag)
    const input = wrapper.find('input')
    await input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('should render custom tag slot', async () => {
    const wrapper = mount(InputTag, {
      props: { value: ['Tag1'] },
      slots: {
        tag: ({ tag }) => h('span', { class: 'custom-tag' }, tag),
      },
    })
    const customTag = wrapper.find('.custom-tag')
    expect(customTag.exists()).toBe(true)
    expect(customTag.text()).toBe('Tag1')
    expect(wrapper.find('.bg-blue-500').exists()).toBe(false)
  })

  it('should apply custom container and item classes', () => {
    const wrapper = mount(InputTag, {
      props: { containerClass: 'custom-container', itemClass: 'custom-item', value: ['Tag1'] },
    })
    const container = wrapper.find('.w-full')
    const tag = wrapper.find('.bg-blue-500')
    expect(container.classes()).toContain('custom-container')
    expect(tag.classes()).toContain('custom-item')
  })

  it('should adjust input width based on content', async () => {
    const wrapper = mount(InputTag)
    const input = wrapper.find('input')
    const calculator = wrapper.find('.invisible')

    vi.spyOn(calculator.element, 'clientWidth', 'get').mockReturnValue(50)

    await input.setValue('New Tag')
    await input.trigger('input')
    await wrapper.vm.$nextTick()
    expect(input.element.style.minWidth).toBe('50px')
  })
})
