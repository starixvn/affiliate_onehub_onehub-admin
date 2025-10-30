import { z } from 'zod'

export const generateLinkFormSchema = z.object({
  linkName: z.string().min(1, 'Link name is required'),
  identifierCode: z.string().optional(),
  campaign: z.string().optional(),
  country: z.string().optional(),
  language: z.string().optional(),
  group: z.string().optional(),
  event: z.string().optional(),
  domainName: z.string().min(1, 'Domain name is required'),
  domainReservedNote: z.string().min(1, 'Domain reserved note is required'),
  shortLinkName: z.string().min(1, 'Short link name is required'),
  shortLinkValue: z.string().optional(),
  channel: z.string().optional(),
  type: z.string().optional(),
  agency: z.string().optional(),
  landingPage: z.string().optional(),
  note: z.string().optional(),
})

export type GenerateLinkFormValues = z.infer<typeof generateLinkFormSchema>

