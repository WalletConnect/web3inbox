import toast from 'react-hot-toast'

export const showSuccessMessageToast = (message: string) => {
  toast.success(message)
}

export const showErrorMessageToast = (message: string) => {
  toast.error(message)
}
