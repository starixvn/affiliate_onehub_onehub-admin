import { createFileRoute } from '@tanstack/react-router'
import { GenerateLink } from '@/features/link-generator/generate-link'

export const Route = createFileRoute('/iframe/link-generator/generate-link/')({
  component: GenerateLink,
})
