import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { IAxiosResponse } from '@/lib/types/common'

export function handleServerError(error: unknown) {
  if (error instanceof AxiosError) {
    const response = error.response?.data as IAxiosResponse | undefined
    if (response?.errorMessage) {
      toast.error(response.errorMessage)
      return
    }
  }

  if (error instanceof Error) {
    toast.error(error.message)
    return
  }

  toast.error('Something went wrong!')
}
