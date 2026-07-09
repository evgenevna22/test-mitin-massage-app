import type { BackendError } from '@/types'
import axios from 'axios'
import type { ToastServiceMethods } from 'primevue'

type ErrorHandler = {
  error: unknown
  needToast?: boolean
  toastType?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
}

export const handleError = (
  { error, needToast = true, toastType = 'error' }: ErrorHandler,
  toast: ToastServiceMethods
) => {
  if (axios.isAxiosError<BackendError>(error)) {
    if (!needToast) {
      return
    }

    toast.add({ severity: toastType, summary: error.response?.data.error })
  } else {
    if (!needToast) {
      return
    }

    toast.add({ severity: toastType, summary: 'Unknown error' })
  }
}
