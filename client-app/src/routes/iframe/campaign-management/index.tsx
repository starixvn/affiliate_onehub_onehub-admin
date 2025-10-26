import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { CampaignManagement } from '@/features/campaign-management'

const searchSchema = z.object({
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  status: z.string().optional(),
})

export const Route = createFileRoute('/iframe/campaign-management/')({
  component: CampaignManagement,
  validateSearch: searchSchema,
})
