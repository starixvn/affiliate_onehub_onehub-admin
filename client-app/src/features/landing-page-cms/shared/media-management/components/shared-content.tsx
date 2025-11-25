import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'

export interface SharedContentProps<TDetail> {
  translationKey: string
  PrimaryButtons: React.ReactNode
  Table:
    | React.ComponentType<{
        data: TDetail[]
        bannerRootUrl?: string
        totalCount: number
      }>
    | (() => React.ReactElement)
  items: TDetail[]
  bannerRootUrl?: string
  totalCount: number
  isLoading: boolean
  isError: boolean
}

export function SharedContent<TDetail>({
  translationKey,
  PrimaryButtons,
  Table,
  items,
  bannerRootUrl,
  totalCount,
  isLoading,
  isError,
}: SharedContentProps<TDetail>) {
  const { t } = useTranslation(translationKey)

  const Header = (
    <div className='flex flex-wrap items-end justify-between gap-2'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>{t('page.title')}</h2>
        <p className='text-muted-foreground'>{t('page.description')}</p>
      </div>
      {items.length > 0 && PrimaryButtons}
    </div>
  )

  if (isError) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {Header}
        <div className='flex h-24 items-center justify-center'>
          <div className='text-destructive'>{t('page.failedToLoad')}</div>
        </div>
      </Main>
    )
  }

  if (isLoading || items.length === 0) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        {Header}
        <div className='flex items-center justify-center py-8'>
          <p className='text-muted-foreground'>{t('page.loading')}</p>
        </div>
      </Main>
    )
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      {Header}

      <div className='flex flex-1 flex-col gap-4'>
        {typeof Table === 'function' ? (
          <Table
            data={items}
            bannerRootUrl={bannerRootUrl}
            totalCount={totalCount}
          />
        ) : (
          (Table as () => React.ReactElement)()
        )}
      </div>
    </Main>
  )
}
