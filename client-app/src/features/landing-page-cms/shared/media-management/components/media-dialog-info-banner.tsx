import { useTranslation } from 'react-i18next'

interface MediaDialogInfoBannerProps {
  isEdit: boolean
  translationKey: string
}

export function MediaDialogInfoBanner({
  isEdit,
  translationKey,
}: MediaDialogInfoBannerProps) {
  const { t } = useTranslation(translationKey)

  return (
    <div className='bg-card rounded-lg border border-border p-4'>
      <div className='text-card-foreground space-y-1 text-sm'>
        <p>{t('info.validTypes')}</p>
        <p>{t('info.fileSizeLimit')}</p>
        {!isEdit && <p>{t('info.maxFiles')}</p>}
      </div>
      <div className='text-card-foreground mt-3 text-sm italic'>
        <span className='font-medium not-italic'>{t('info.noteLabel')}</span>{' '}
        {t('info.noteContent')}
      </div>
    </div>
  )
}
