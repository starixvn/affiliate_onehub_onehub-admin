import { z } from 'zod'

export const componentSchema = z.object({
  componentId: z.number(),
  componentCode: z.string(),
  componentName: z.string(),
  category: z.string(),
  categoryId: z.number(),
  statusId: z.number(),
  status: z.string(),
  deviceType: z.string().optional(),
  creator: z.string(),
  createdDate: z.string(),
  updatedBy: z.string(),
  updatedDate: z.string(),
  rowIdx: z.number(),
})

export type Component = z.infer<typeof componentSchema>
