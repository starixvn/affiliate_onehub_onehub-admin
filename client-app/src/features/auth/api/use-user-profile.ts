import { useQuery } from '@tanstack/react-query'
import { authApi } from './client'

export function useUserProfile() {
  return useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await authApi.getMe()
      if (response.errorCode === 0 && response.data) {
        return response.data
      }
      throw new Error(response.errorMessage || 'Failed to fetch user profile')
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}
