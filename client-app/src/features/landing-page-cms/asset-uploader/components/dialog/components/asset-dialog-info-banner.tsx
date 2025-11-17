import { useTranslation } from 'react-i18next'

interface AssetDialogInfoBannerProps {
  isEdit: boolean
}

export function AssetDialogInfoBanner({ isEdit }: AssetDialogInfoBannerProps) {
  const { t } = useTranslation('asset-uploader')

  return (
    <div className='bg-white rounded-lg border p-4'>
      <div className='text-black space-y-1 text-sm'>
        <p>{t('info.validTypes')}</p>
        <p>{t('info.fileSizeLimit')}</p>
        {!isEdit && <p>{t('info.maxFiles')}</p>}
      </div>
      <div className='text-black mt-3 text-sm italic'>
        <span className='font-medium not-italic'>{t('info.noteLabel')}</span>{' '}
        {t('info.noteContent')}
      </div>
    </div>
  )
}
