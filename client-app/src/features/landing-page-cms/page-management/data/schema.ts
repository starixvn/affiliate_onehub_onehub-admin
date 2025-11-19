import { z } from 'zod'

export const landingPageSchema = z.object({
  pageId: z.number(),
  campaignCode: z.string(),
  campaignName: z.string(),
  lpCode: z.string(),
  lpName: z.string(),
  countryCode: z.string(),
  countryName: z.string(),
  languageCode: z.string(),
  languageName: z.string(),
  targetLanguageCode: z.string(),
  createdDate: z.string(),
  createdBy: z.string(),
  modifiedDate: z.string(),
  modifiedBy: z.string(),
  click: z.number(),
  registration: z.number(),
  ftd: z.number(),
  revenue: z.number(),
  statusId: z.number(),
  status: z.string(),
  rowIdx: z.number(),
})

export type LandingPage = z.infer<typeof landingPageSchema>
