import { useToast } from 'vue-toastification'
const toast = useToast()
import Toast from '@/components/base/atoms/Toast.vue'
import { h } from 'vue'

export const useCustomToast = () => {
  const tSuccess = (title: string, content: string) => {
    const objectToast: any = {
      component: Toast,
      props: {
        title: title,
        content: content,
        type: 'success',
      },
    }
    toast.success(objectToast, {
      icon: h('i', { class: 'pi pi-check-circle text-green-500 !mt-0.5' }),
    })
  }

  const tError = (title: string, content: string) => {
    const objectToast: any = {
      component: Toast,
      props: {
        title: title,
        content: content,
        type: 'error',
      },
    }
    toast.error(objectToast, {
      icon: h('i', { class: 'pi pi-power-off text-red-500 !mt-0.5' }),
    })
  }

  const tWarning = (title: string, content: string) => {
    const objectToast: any = {
      component: Toast,
      props: {
        title: title,
        content: content,
        type: 'warning',
      },
    }
    toast.warning(objectToast, {
      icon: h('i', { class: 'pi pi-exclamation-triangle text-orange-500 !mt-0.5' }),
    })
  }

  const tInfo = (title: string, content: string) => {
    const objectToast: any = {
      component: Toast,
      props: {
        title: title,
        content: content,
        type: 'info',
      },
    }
    toast.info(objectToast, {
      icon: h('i', { class: 'pi pi-info text-blue-500 !mt-0.5' }),
    })
  }

  return {
    tSuccess,
    tError,
    tWarning,
    tInfo,
  }
}
