import { z } from 'zod'

export const linkSchema = z.object({
  linkId: z.number(),
  linkName: z.string(),
  domainName: z.string(),
  shortLink: z.string(),
  campaignName: z.string(),
  countryName: z.string(),
  channelName: z.string(),
  idCode: z.string(),
  createdDate: z.string(),
  click: z.number(),
  registration: z.number(),
  ftd: z.number(),
  avgFtdAmount: z.number(),
  statusId: z.number(),
  statusName: z.string(),
  rowIdx: z.number(),
})

export type LinkInfo = z.infer<typeof linkSchema>

