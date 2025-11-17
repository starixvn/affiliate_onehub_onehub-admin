import { z } from 'zod'

export const generateLinkFormSchema = z.object({
  linkName: z.string().trim().min(1, 'Link name is required'),
  identifierCode: z.string().trim().regex(/^[a-zA-Z0-9]*$/, 'Identifier code must contain only letters and numbers').optional().or(z.literal('')),
  campaign: z.string().min(1, 'Campaign is required'),
  campaignCode: z.string(),
  country: z.string().min(1, 'Country is required'),
  language: z.string().min(1, 'Language is required'),
  shortedLanguageCode: z.string(),
  group: z.string().min(1, 'Group is required'),
  groupCode: z.string(),
  event: z.string().min(1, 'Event is required'),
  eventCodes: z.string(),
  domainName: z.string().min(1, 'Domain name is required'),
  domainReservedNote: z.string().trim().min(1, 'Domain reserved note is required'),
  shortDomain: z.string().min(1, 'Short domain is required'),
  shortPath: z.string().trim().min(5, 'Short path must be at least 5 characters').max(20, 'Short path must be at most 20 characters').regex(/^[a-z0-9\-.]*$/, 'Short path must contain only lowercase letters, numbers, hyphens, and dots').optional().or(z.literal('')),
  channel: z.string().min(1, 'Channel is required'),
  channelCode: z.string(),
  type: z.string().min(1, 'Type is required'),
  typeCode: z.string(),
  agency: z.string().min(1, 'Agency is required'),
  agencyCode: z.string(),
  landingPage: z.string().min(1, 'Landing page is required'),
  pageType: z.number(),
  pageCode: z.string(),
  note: z.string().trim().optional(),
})

export type GenerateLinkFormValues = z.infer<typeof generateLinkFormSchema>

