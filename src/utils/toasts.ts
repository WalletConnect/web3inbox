import type { ToastOptions } from 'react-toastify'
import { toast } from 'react-toastify'

export const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  position: 'bottom-right',
  autoClose: 5000,
  style: {
    borderRadius: '1em'
  }
}

export const showSuccessMessageToast = (message: string, options?: ToastOptions) => {
  toast(
    message,
    options ?? {
      ...DEFAULT_TOAST_OPTIONS,
      type: 'success'
    }
  )
}

export const showErrorMessageToast = (message: string, options?: ToastOptions) => {
  toast(
    message,
    options ?? {
      ...DEFAULT_TOAST_OPTIONS,
      type: 'error'
    }
  )
}
