import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Toast from '@/components/base/atoms/Toast.vue'

describe('Toast', () => {
  it('should render with default props', () => {
    const wrapper = mount(Toast)
    const container = wrapper.find('.w-full')
    expect(container.exists()).toBe(true)
    expect(wrapper.find('.text-sm').text()).toBe('')
    expect(wrapper.classes()).not.toContain('text-green-800')
  })

  it('should render title and content', () => {
    const wrapper = mount(Toast, {
      props: { title: 'Success!', content: 'Operation completed.' },
    })
    const titleDiv = wrapper.find('.font-semibold')
    const contentDiv = wrapper.find('.text-sm:not(.font-semibold)')
    expect(titleDiv.text()).toBe('Success!')
    expect(contentDiv.text()).toBe('Operation completed.')
  })

  it('should apply success type classes', () => {
    const wrapper = mount(Toast, {
      props: { type: 'success', title: 'Success', content: 'Done' },
    })
    const titleDiv = wrapper.find('.font-semibold')
    const contentDiv = wrapper.find('.text-sm:not(.font-semibold)')
    const closeIcon = wrapper.find('.pi-times')
    expect(titleDiv.classes()).toContain('text-green-800')
    expect(contentDiv.classes()).toContain('text-green-700')
    expect(closeIcon.classes()).toContain('text-green-700')
  })

  it('should apply error type classes', () => {
    const wrapper = mount(Toast, {
      props: { type: 'error', title: 'Error', content: 'Failed' },
    })
    const titleDiv = wrapper.find('.font-semibold')
    const contentDiv = wrapper.find('.text-sm:not(.font-semibold)')
    const closeIcon = wrapper.find('.pi-times')
    expect(titleDiv.classes()).toContain('text-red-800')
    expect(contentDiv.classes()).toContain('text-red-700')
    expect(closeIcon.classes()).toContain('text-red-700')
  })

  it('should apply warning type classes', () => {
    const wrapper = mount(Toast, {
      props: { type: 'warning', title: 'Warning', content: 'Caution' },
    })
    const titleDiv = wrapper.find('.font-semibold')
    const contentDiv = wrapper.find('.text-sm:not(.font-semibold)')
    const closeIcon = wrapper.find('.pi-times')
    expect(titleDiv.classes()).toContain('text-orange-800')
    expect(contentDiv.classes()).toContain('text-orange-700')
    expect(closeIcon.classes()).toContain('text-orange-700')
  })

  it('should apply info type classes', () => {
    const wrapper = mount(Toast, {
      props: { type: 'info', title: 'Info', content: 'Notice' },
    })
    const titleDiv = wrapper.find('.font-semibold')
    const contentDiv = wrapper.find('.text-sm:not(.font-semibold)')
    const closeIcon = wrapper.find('.pi-times')
    expect(titleDiv.classes()).toContain('text-blue-800')
    expect(contentDiv.classes()).toContain('text-blue-700')
    expect(closeIcon.classes()).toContain('text-blue-700')
  })

  it('should emit close-toast event on close icon click', async () => {
    const wrapper = mount(Toast, {
      props: { title: 'Test', content: 'Content' },
    })
    const closeIcon = wrapper.find('.pi-times')
    await closeIcon.trigger('click')
    expect(wrapper.emitted('close-toast')).toBeTruthy()
  })

  it('should render HTML in title and content', () => {
    const wrapper = mount(Toast, {
      props: { title: '<strong>Bold</strong>', content: '<em>Italic</em>' },
    })
    const titleDiv = wrapper.find('.font-semibold')
    const contentDiv = wrapper.find('.text-sm:not(.font-semibold)')
    expect(titleDiv.element.innerHTML).toBe('<strong>Bold</strong>')
    expect(contentDiv.element.innerHTML).toBe('<em>Italic</em>')
  })
})
