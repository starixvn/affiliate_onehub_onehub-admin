import { z } from 'zod'

export const createPageBuilderFormSchema = (t: (key: string) => string) => z.object({
  pageName: z.string().trim().min(1, t('validation.pageNameRequired')).max(200, t('validation.pageNameMaxLength')),
  pageCode: z.string().trim().min(1, t('validation.pageCodeRequired')).regex(/^[a-zA-Z0-9]*$/, t('validation.pageCodeInvalid')),
  campaign: z.string().min(1, t('validation.campaignRequired')),
  campaignCode: z.string(),
  country: z.string().min(1, t('validation.countryRequired')),
  language: z.string().min(1, t('validation.languageRequired')),
  shortedLanguageCode: z.string().min(1, t('validation.languageRequired')),
  statusId: z.number().int().min(0, t('validation.statusRequired')),
  modules: z.array(z.object({
    moduleId: z.number().optional(),
    sourceId: z.string().optional(),
    contactPath: z.string().optional(),
  })).min(1, t('validation.atLeastOneModule')).superRefine((modules, ctx) => {
    const incompleteModules = modules.filter((m) => !m.moduleId || !m.sourceId)
    if (incompleteModules.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: t('validation.allModulesComplete'),
        path: [],
      })
    }
    modules.forEach((module, index) => {
      if (module.moduleId && !module.sourceId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.sourceRequired'),
          path: [index, 'sourceId'],
        })
      }
    })
  }),
})

export type PageBuilderFormValues = z.infer<ReturnType<typeof createPageBuilderFormSchema>>

export const pageBuilderDefaultValues: PageBuilderFormValues = {
  pageName: '',
  pageCode: '',
  campaign: '',
  campaignCode: '',
  country: '',
  language: '',
  shortedLanguageCode: '',
  statusId: 0,
  modules: [{ moduleId: undefined, sourceId: undefined, contactPath: undefined }],
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

export const createComponentCreateFormSchema = (t: (key: string) => string) => z.object({
  componentName: z.string().trim().min(1, t('validation.componentNameRequired')),
  componentCode: z.string(),
  statusId: z.number(),
})

export type ComponentCreateForm = z.infer<ReturnType<typeof createComponentCreateFormSchema>>

