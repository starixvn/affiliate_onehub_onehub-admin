import { createFileRoute, redirect } from '@tanstack/react-router'
import { LinkManagement } from '@/features/link-generator/link-management'
import { z } from 'zod'

const linkManagementSearchSchema = z.object({
  search: z.string().optional(),
  statusIds: z.string().optional(),
  countryCodes: z.string().optional(),
  channelIds: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  pageIndex: z.number().optional(),
  pageSize: z.number().optional(),
})

export const Route = createFileRoute('/iframe/link-generator/link-management/')({
  component: LinkManagement,
  validateSearch: (search) => linkManagementSearchSchema.parse(search),
  beforeLoad: ({ search }) => {
    if (!search.statusIds) {
      throw redirect({
        to: '/iframe/link-generator/link-management',
        search: {
          ...search,
          statusIds: '1',
        },
        replace: true,
      })
    }
  },
})
