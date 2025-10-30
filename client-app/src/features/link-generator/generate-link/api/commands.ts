import { useMutation } from '@tanstack/react-query'
import { linkGeneratorApi } from './client'
import type { GenerateLinkRequest } from '../types'

export function useGenerateLink() {
  return useMutation({
    mutationFn: (data: GenerateLinkRequest) => linkGeneratorApi.generateLink(data),
  })
}

