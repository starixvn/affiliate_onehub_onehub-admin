import { z } from 'zod'

export const campaignSchema = z.object({
  campaignId: z.number(),
  campaignCode: z.string(),
  campaignName: z.string(),
  description: z.string(),
  statusId: z.number(),
  status: z.string(),
  creator: z.string(),
  createdDate: z.string(),
  updatedBy: z.string(),
  updatedDate: z.string(),
  rowIdx: z.number(),
})

export type Campaign = z.infer<typeof campaignSchema>
