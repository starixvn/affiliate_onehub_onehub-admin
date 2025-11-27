import { Controller, type UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { SingleSelect, MultipleSelect } from '@/components/dropdowns'
import { cn } from '@/lib/utils'
import { useGetMediaSources } from '../api/queries'
import { ImageWithPreview } from './image-with-preview'
import type { PageBuilderFormValues } from '../data/schema'
import type { MediaSource } from '../types'

type SourceSelectFieldProps = {
  index: number
  form: UseFormReturn<PageBuilderFormValues>
  isDisabled: boolean
  hasError: boolean
  isYoutubeModule: boolean
  isMultipleUpload: boolean
  shouldLoadSources: boolean
  effectiveModuleId: number | undefined
  countryCode: string | undefined
  languageCode: string | undefined
}

export function SourceSelectField({
  index,
  form,
  isDisabled,
  hasError,
  isYoutubeModule,
  isMultipleUpload,
  shouldLoadSources,
  effectiveModuleId,
  countryCode,
  languageCode,
}: SourceSelectFieldProps) {
  const { t } = useTranslation('page-builder')
  const { control } = form

  const { data: mediaSources, isLoading: isLoadingSources, isError: isErrorSources } = useGetMediaSources(
    languageCode || '',
    countryCode || '',
    effectiveModuleId
  )

  return (
    <div className='col-span-4'>
      <Controller
        name={`modules.${index}.sourceId`}
        control={control}
        render={({ field: sourceField }) => {
          const sourceValue = form.getValues(`modules.${index}.sourceId`)
          const isSourceMissing = hasError && !sourceValue

          if (isYoutubeModule) {
            return (
              <Input
                placeholder={t('form.youtubePlaceholder')}
                value={sourceField.value || ''}
                onChange={(e) => sourceField.onChange(e.target.value)}
                onBlur={sourceField.onBlur}
                disabled={isDisabled}
                title={sourceField.value || ''}
                className={cn(
                  'text-blue-600',
                  index === 0 ? 'bg-muted/50' : '',
                  isSourceMissing ? 'border-destructive focus-visible:border-destructive' : ''
                )}
              />
            )
          }

          if (isMultipleUpload) {
            const valueArray = typeof sourceField.value === 'string' && sourceField.value
              ? sourceField.value.split(',').filter(Boolean)
              : Array.isArray(sourceField.value)
                ? sourceField.value.map(String)
                : []
            
            return (
              <MultipleSelect
                value={valueArray}
                onValueChange={(values) => {
                  sourceField.onChange(values.join(','))
                }}
                options={
                  !shouldLoadSources || isLoadingSources || isErrorSources || !mediaSources || mediaSources.length === 0
                    ? []
                    : mediaSources
                }
                labelKey='mediaName'
                valueKey='mediaId'
                placeholder={
                  !shouldLoadSources
                    ? t('form.selectModuleFirst')
                    : isLoadingSources
                      ? t('form.loadingSources')
                      : isErrorSources
                        ? t('form.errorLoadingSources')
                        : mediaSources && mediaSources.length > 0
                          ? t('form.pleaseSelect')
                          : t('form.noSourcesAvailable')
                }
                searchPlaceholder={t('form.searchSource')}
                selectedDisplayPattern={t('form.sourcesSelected')}
                disabled={
                  isDisabled ||
                  !shouldLoadSources ||
                  isLoadingSources ||
                  isErrorSources ||
                  !mediaSources ||
                  mediaSources.length === 0
                }
                className={cn(
                  index === 0 ? 'bg-muted/50' : '',
                  isSourceMissing ? 'border-destructive focus-visible:border-destructive' : ''
                )}
                renderOptionLabel={(option: unknown) => {
                  const source = option as MediaSource
                  const imageUrl = getImageUrl(source.fileName)
                  return (
                    <div className='flex items-center gap-2'>
                      <span>{source.mediaName}</span>
                      {imageUrl && (
                        <ImageWithPreview imageUrl={imageUrl} alt={source.mediaName} />
                      )}
                    </div>
                  )
                }}
              />
            )
          }

          return (
            <SingleSelect
              value={sourceField.value ? String(sourceField.value) : ''}
              onValueChange={(_value, option) => {
                if (option) {
                  const source = option as MediaSource
                  sourceField.onChange(String(source.mediaId))
                } else {
                  sourceField.onChange('')
                }
              }}
              options={
                !shouldLoadSources || isLoadingSources || isErrorSources || !mediaSources || mediaSources.length === 0
                  ? []
                  : mediaSources
              }
              labelKey='mediaName'
              valueKey='mediaId'
              placeholder={
                !shouldLoadSources
                  ? t('form.selectModuleFirst')
                  : isLoadingSources
                    ? t('form.loadingSources')
                    : isErrorSources
                      ? t('form.errorLoadingSources')
                      : mediaSources && mediaSources.length > 0
                        ? t('form.pleaseSelect')
                        : t('form.noSourcesAvailable')
              }
              searchPlaceholder={t('form.searchSource')}
              disabled={
                isDisabled ||
                !shouldLoadSources ||
                isLoadingSources ||
                isErrorSources ||
                !mediaSources ||
                mediaSources.length === 0
              }
              className={cn(
                index === 0 ? 'bg-muted/50' : '',
                isSourceMissing ? 'border-destructive focus-visible:border-destructive' : ''
              )}
              renderOptionLabel={(option: unknown) => {
                const source = option as MediaSource
                const imageUrl = getImageUrl(source.fileName)
                return (
                  <div className='flex items-center gap-2'>
                    <span>{source.mediaName}</span>
                    {imageUrl && (
                      <ImageWithPreview imageUrl={imageUrl} alt={source.mediaName} />
                    )}
                  </div>
                )
              }}
            />
          )
        }}
      />
    </div>
  )
}

const getImageUrl = (fileName: string): string => {
  if (!fileName) return ''
  if (fileName.startsWith('http://') || fileName.startsWith('https://')) {
    return fileName
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  return fileName.startsWith('/') ? `${baseUrl}${fileName}` : `${baseUrl}/${fileName}`
}

