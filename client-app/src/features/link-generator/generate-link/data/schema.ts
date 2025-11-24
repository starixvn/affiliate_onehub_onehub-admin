import { z } from 'zod'

export const generateLinkFormSchema = z.object({
  linkName: z
    .string()
    .trim()
    .min(1, 'Link name is required')
    .max(200, 'Link name must be at most 200 characters'),
  identifierCode: z
    .union([
      z
        .string()
        .trim()
        .regex(
          /^[a-zA-Z0-9]*$/,
          'Identifier code must contain only letters and numbers'
        ),
      z.literal(''),
    ])
    .optional(),
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
  domainReservedNote: z
    .string()
    .trim()
    .min(1, 'Domain reserved note is required')
    .max(200, 'Domain reserved note must be at most 200 characters'),
  shortDomain: z.string().min(1, 'Short domain is required'),
  shortPath: z
    .union([
      z
        .string()
        .trim()
        .min(5, 'Short path must be at least 5 characters')
        .max(20, 'Short path must be at most 20 characters')
        .regex(
          /^[a-z0-9\-.]*$/,
          'Short path must contain only lowercase letters, numbers, hyphens, and dots'
        ),
      z.literal(''),
    ])
    .optional(),
  channel: z.string().min(1, 'Channel is required'),
  channelCode: z.string(),
  type: z.string().min(1, 'Type is required'),
  typeCode: z.string(),
  agency: z.string().min(1, 'Agency is required'),
  agencyCode: z.string(),
  landingPage: z.string().min(1, 'Landing page is required'),
  pageType: z.number().int(),
  pageCode: z.string(),
  note: z.string().trim().optional(),
})

export type GenerateLinkFormValues = z.infer<typeof generateLinkFormSchema>

export const generateLinkDefaultValues: GenerateLinkFormValues = {
  linkName: '',
  identifierCode: '',
  campaign: '',
  campaignCode: '',
  country: '',
  language: '',
  shortedLanguageCode: '',
  group: '',
  groupCode: '',
  event: '',
  eventCodes: '',
  domainName: '',
  domainReservedNote: '',
  shortDomain: '',
  shortPath: '',
  channel: '',
  channelCode: '',
  type: '',
  typeCode: '',
  agency: '',
  agencyCode: '',
  landingPage: '',
  pageType: 0,
  pageCode: '',
  note: '',
}

export type ComponentType = 'event' | 'group' | 'channel' | 'agency' | 'type'

export const COMPONENT_CONFIG: Record<
  ComponentType,
  {
    label: string
    categoryId: number
  }
> = {
  event: { label: 'Event', categoryId: 1 },
  group: { label: 'Group', categoryId: 2 },
  channel: { label: 'Channel', categoryId: 3 },
  agency: { label: 'Agency', categoryId: 4 },
  type: { label: 'Type', categoryId: 5 },
}

export const componentCreateFormSchema = z.object({
  componentName: z.string().trim().min(1, 'Name is required'),
  componentCode: z.string(),
  statusId: z.number(),
})

export type ComponentCreateForm = z.infer<typeof componentCreateFormSchema>
