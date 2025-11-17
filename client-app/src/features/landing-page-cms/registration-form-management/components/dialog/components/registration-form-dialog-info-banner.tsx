import { useTranslation } from 'react-i18next'

interface RegisterFormDialogInfoBannerProps {
  isEdit: boolean
}

export function RegisterFormDialogInfoBanner({
  isEdit,
}: RegisterFormDialogInfoBannerProps) {
  const { t } = useTranslation('registration-form-management')

  return (
    <div className='rounded-lg border bg-white p-4'>
      <div className='space-y-1 text-sm text-black'>
        <p>{t('info.validTypes')}</p>
        <p>{t('info.fileSizeLimit')}</p>
        {!isEdit && <p>{t('info.maxFiles')}</p>}
      </div>
      <div className='mt-3 text-sm text-black italic'>
        <span className='font-medium not-italic'>{t('info.noteLabel')}</span>{' '}
        {t('info.noteContent')}
      </div>
    </div>
  )
}
