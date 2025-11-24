import { useEffect, useState } from 'react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import { Badge } from '@/components/ui/badge'
import { useGetMediaSources } from '../api/queries'
import { ModuleSelectField } from './module-select-field'
import { SourceSelectField } from './source-select-field'
import { ContactPathField } from './contact-path-field'
import { ModuleRowActions } from './module-row-actions'
import { YoutubeDialog } from './youtube-dialog'
import type { PageBuilderFormValues } from '../data/schema'
import type { Module, MediaSource } from '../types'

type ModuleRowProps = {
  index: number
  form: UseFormReturn<PageBuilderFormValues>
  modules: Module[] | undefined
  isLoadingModules: boolean
  isErrorModules: boolean
  isDisabled: boolean
  hasError?: boolean
  onAdd: () => void
  onRemove: () => void
}

export function ModuleRow({
  index,
  form,
  modules,
  isLoadingModules,
  isErrorModules,
  isDisabled,
  hasError = false,
  onAdd,
  onRemove,
}: ModuleRowProps) {
  const { control } = form
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false)

  const moduleId = useWatch({ control, name: `modules.${index}.moduleId` })
  const countryCode = useWatch({ control, name: 'country' })
  const languageCode = useWatch({ control, name: 'language' })
  const currentSourceId = useWatch({ control, name: `modules.${index}.sourceId` })
  const allModules = useWatch({ control, name: 'modules' })

  const isFirstRow = index === 0
  const firstModule = modules && modules.length > 0 ? modules[0] : null

  const selectedModule = modules?.find((m) => {
    if (isFirstRow && firstModule) {
      return m.moduleId === firstModule.moduleId
    }
    return m.moduleId === moduleId
  })
  const isMultipleUpload = selectedModule?.isMultipleUpload ?? false
  const isContactUsModule = selectedModule?.moduleType === 2
  const isYoutubeModule = selectedModule?.moduleType === 4

  const getAvailableModules = () => {
    if (!modules || modules.length === 0) return []
    
    const selectedModuleIds = (allModules || [])
      .map((m, idx) => idx !== index ? m.moduleId : null)
      .filter((id): id is number => id !== null && id !== undefined)
    
    const uniqueSelectedModuleIds = new Set<number>()
    selectedModuleIds.forEach((selectedId) => {
      const module = modules.find((m) => m.moduleId === selectedId)
      if (module?.isUnique) {
        uniqueSelectedModuleIds.add(selectedId)
      }
    })
    
    const currentModuleId = isFirstRow && firstModule ? firstModule.moduleId : moduleId
    return modules.filter((module) => {
      if (module.moduleId === currentModuleId) return true
      return !(module.isUnique && uniqueSelectedModuleIds.has(module.moduleId))
    })
  }
  
  const availableModules = getAvailableModules()

  useEffect(() => {
    if (isFirstRow && firstModule && !moduleId) {
      form.setValue(`modules.${index}.moduleId`, firstModule.moduleId)
    }
  }, [isFirstRow, firstModule, moduleId, form, index])

  const effectiveModuleId = isFirstRow && firstModule ? firstModule.moduleId : moduleId
  const shouldLoadSources = !!effectiveModuleId && !!countryCode && !!languageCode

  const { data: mediaSources } = useGetMediaSources(
    languageCode || '',
    countryCode || '',
    effectiveModuleId
  )

  useEffect(() => {
    if (isYoutubeModule) {
      return
    }
    
    if (shouldLoadSources && mediaSources && currentSourceId) {
      if (isMultipleUpload) {
        const valueArray = typeof currentSourceId === 'string' && currentSourceId
          ? currentSourceId.split(',').filter(Boolean)
          : []
        
        const validSourceIds = valueArray.filter((id) =>
          mediaSources.some((source: MediaSource) => String(source.mediaId) === String(id))
        )
        
        if (validSourceIds.length !== valueArray.length) {
          form.setValue(`modules.${index}.sourceId`, validSourceIds.length > 0 ? validSourceIds.join(',') : '')
        }
      } else {
        const sourceExists = mediaSources.some((source: MediaSource) => String(source.mediaId) === String(currentSourceId))
        if (!sourceExists) {
          form.setValue(`modules.${index}.sourceId`, '')
        }
      }
    }
  }, [mediaSources, shouldLoadSources, currentSourceId, form, index, isMultipleUpload, isYoutubeModule])

  return (
    <div className='space-y-2'>
      <div className='grid grid-cols-12 items-center gap-2'>
        <div className='col-span-1 flex justify-center'>
          <Badge variant='secondary' className='flex h-6 w-6 items-center justify-center rounded-sm p-0'>
            {index + 1}
          </Badge>
        </div>
        <ModuleSelectField
          index={index}
          form={form}
          modules={modules}
          isLoadingModules={isLoadingModules}
          isErrorModules={isErrorModules}
          isDisabled={isDisabled}
          hasError={hasError}
          isFirstRow={isFirstRow}
          firstModule={firstModule}
          availableModules={availableModules}
          onYoutubeInfoClick={() => setShowYoutubeDialog(true)}
          isYoutubeModule={isYoutubeModule}
        />
        <SourceSelectField
          index={index}
          form={form}
          isDisabled={isDisabled}
          hasError={hasError}
          isYoutubeModule={isYoutubeModule}
          isMultipleUpload={isMultipleUpload}
          shouldLoadSources={shouldLoadSources}
          effectiveModuleId={effectiveModuleId}
          countryCode={countryCode}
          languageCode={languageCode}
        />
        <ModuleRowActions
          isDisabled={isDisabled}
          isFirstRow={isFirstRow}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      </div>
      {isContactUsModule && (
        <ContactPathField
          index={index}
          form={form}
          isDisabled={isDisabled}
        />
      )}
      <YoutubeDialog
        open={showYoutubeDialog}
        onOpenChange={setShowYoutubeDialog}
      />
    </div>
  )
}
