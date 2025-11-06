import { z } from 'zod'

const categoryMap: Record<number, string> = {
  1: 'Event',
  2: 'Group',
  3: 'Channel',
  4: 'Agency',
  5: 'Type',
  6: 'Landing Page',
}

export const componentSchema = z
  .object({
    componentId: z.number(),
    componentCode: z.string(),
    componentName: z.string(),
    componentTypeId: z.number(),
    createdBy: z.string(),
    createdDate: z.string(),
    lastModifiedBy: z.string(),
    lastModifiedDate: z.string(),
    statusId: z.number(),
    status: z.string(),
    device: z.string().optional().nullable(),
    deviceId: z.number().optional().nullable(),
    rowIdx: z.number(),
  })
  .transform((data) => ({
    ...data,
    categoryId: data.componentTypeId,
    category: categoryMap[data.componentTypeId] || '',
    creator: data.createdBy,
    updatedBy: data.lastModifiedBy,
    updatedDate: data.lastModifiedDate,
  }))

export type Component = z.infer<typeof componentSchema>
