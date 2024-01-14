import toast from 'react-hot-toast'

export const showDefaultToast = (message: string) => {
  toast(message)
}

export const showSuccessMessageToast = (message: string) => {
  toast.success(message)
}

export const showErrorMessageToast = (message: string) => {
  toast.error(message)
}
