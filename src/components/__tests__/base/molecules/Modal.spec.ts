import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Modal from '@/components/base/molecules/Modal.vue'

describe('Modal', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should render modal when show is true', () => {
    mount(Modal, {
      props: { show: true, title: 'Test Modal' },
    })
    const modal = document.querySelector('.bg-white') as any
    expect(modal).not.toBeNull()
    expect(modal.textContent).toContain('Test Modal')
  })

  it('should not render modal when show is false', () => {
    mount(Modal, {
      props: { show: false },
    })
    const modal = document.querySelector('.bg-white')
    expect(modal).toBeNull()
  })

  it('should render custom header slot', () => {
    mount(Modal, {
      props: { show: true },
      slots: { header: '<div class="custom-header">Custom Header</div>' },
    })
    const customHeader = document.querySelector('.custom-header') as any
    expect(customHeader).not.toBeNull()
    expect(customHeader.textContent).toBe('Custom Header')
  })

  it('should render custom body slot', () => {
    mount(Modal, {
      props: { show: true },
      slots: { body: '<p class="custom-body">Custom Body</p>' },
    })
    const customBody = document.querySelector('.custom-body') as any
    expect(customBody).not.toBeNull()
    expect(customBody.textContent).toBe('Custom Body')
  })

  it('should render custom footer slot', () => {
    mount(Modal, {
      props: { show: true },
      slots: { footer: '<div class="custom-footer">Custom Footer</div>' },
    })
    const customFooter = document.querySelector('.custom-footer') as any
    expect(customFooter).not.toBeNull()
    expect(customFooter.textContent).toBe('Custom Footer')
  })

  it('should close modal on close button click', async () => {
    const wrapper = mount(Modal, {
      props: { show: true },
    })
    const closeButton = document.querySelector('.pi-times') as any
    await closeButton.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShow).toBe(false)
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(document.querySelector('.bg-white')).toBeNull()
  })

  it('should close modal on backdrop click when enabled', async () => {
    const wrapper = mount(Modal, {
      props: { show: true, enableBackdropClose: true },
    })
    const backdrop = document.querySelector('.bg-gray-1000') as any
    await backdrop.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShow).toBe(false)
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(document.querySelector('.bg-white')).toBeNull()
  })

  it('should not close modal on backdrop click when disabled', async () => {
    const wrapper = mount(Modal, {
      props: { show: true, enableBackdropClose: false },
    })
    const backdrop = document.querySelector('.bg-gray-1000') as any
    await backdrop.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShow).toBe(true)
    expect(document.querySelector('.bg-white')).not.toBeNull()
  })

  it('should close modal on escape key when enabled', async () => {
    const wrapper = mount(Modal, {
      props: { show: true, enableEscapeClose: true },
    })
    await document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShow).toBe(false)
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(document.querySelector('.bg-white')).toBeNull()
  })

  it('should not close modal on escape key when disabled', async () => {
    const wrapper = mount(Modal, {
      props: { show: true, enableEscapeClose: false },
    })
    await document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShow).toBe(true)
    expect(document.querySelector('.bg-white')).not.toBeNull()
  })

  it('should submit modal on submit button click', async () => {
    const wrapper = mount(Modal, {
      props: { show: true },
    })
    const submitButton = document.querySelector('button.bg-blue-500') as any
    await submitButton.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('should apply position top classes', () => {
    mount(Modal, {
      props: { show: true, position: 'top' },
    })
    const container = document.querySelector('.fixed') as any
    expect(container.classList.contains('flex')).toBe(true)
    expect(container.classList.contains('flex-col')).toBe(true)
    expect(container.classList.contains('py-10')).toBe(true)
  })

  it('should apply custom container, modal, and backdrop classes', () => {
    mount(Modal, {
      props: {
        show: true,
        containerClass: 'custom-container',
        modalClass: 'custom-modal',
        backdropClass: 'custom-backdrop',
      },
    })
    const container = document.querySelector('.fixed') as any
    const modal = document.querySelector('.bg-white') as any
    const backdrop = document.querySelector('.bg-gray-1000') as any
    expect(container.classList.contains('custom-container')).toBe(true)
    expect(modal.classList.contains('custom-modal')).toBe(true)
    expect(backdrop.classList.contains('custom-backdrop')).toBe(true)
  })

  it('should update v-model show value', async () => {
    const wrapper = mount(Modal, {
      props: { show: true, 'onUpdate:show': (val) => wrapper.setProps({ show: val }) },
    })
    const closeButton = document.querySelector('.pi-times') as any
    await closeButton.dispatchEvent(new Event('click'))
    await wrapper.vm.$nextTick()
    expect(wrapper.props('show')).toBe(false)
  })
})
