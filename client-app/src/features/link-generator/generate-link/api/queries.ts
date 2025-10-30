import { useQuery } from '@tanstack/react-query'
import { linkGeneratorApi } from './client'

export const linkGeneratorKeys = {
  all: ['link-generator'] as const,
  options: () => [...linkGeneratorKeys.all, 'options'] as const,
}

export function useGetLinkGeneratorOptions() {
  return useQuery({
    queryKey: linkGeneratorKeys.options(),
    queryFn: () => linkGeneratorApi.getOptions(),
    select: (data) => data.result,
  })
}

