import { z } from 'zod'

export const campaignSchema = z.object({
  campaignId: z.number(),
  campaignCode: z.string(),
  campaignName: z.string(),
  description: z.string(),
  statusId: z.number(),
  status: z.string(),
  creator: z.string(),
  creatorId: z.number(),
  createdDate: z.string(),
  createdDateText: z.string(),
  updatedBy: z.string(),
  updatedById: z.number(),
  updatedDate: z.string(),
  updatedDateText: z.string(),
  rowIdx: z.number(),
})

export type Campaign = z.infer<typeof campaignSchema>
