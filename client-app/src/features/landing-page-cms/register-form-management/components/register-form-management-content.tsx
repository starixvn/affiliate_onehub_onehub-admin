import { useTranslation } from 'react-i18next'
import { Main } from '@/components/layout/main'
import { useRegisterFormManagement } from './register-form-management-provider'
import { RegisterFormPrimaryButtons } from './register-form-primary-buttons'
import { RegisterFormTable } from './table/register-form-table'

export function RegisterFormManagementContent() {
  const { t } = useTranslation('register-form-management')
  const { isLoading, isError } = useRegisterFormManagement()

  if (isLoading) {
    return (
      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {t('page.title')}
            </h2>
            <p className='text-muted-foreground'>{t('page.description')}</p>
          </div>
        </div>
        <div className='flex items-center justify-center py-8'>
          <p className='text-muted-foreground'>{t('page.loading')}</p>
        </div>
      </Main>
    )
  }

  return (
    <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
      <div className='flex flex-wrap items-end justify-between gap-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            {t('page.title')}
          </h2>
          <p className='text-muted-foreground'>{t('page.description')}</p>
        </div>
        <RegisterFormPrimaryButtons />
      </div>

      <div className='flex flex-1 flex-col gap-4'>
        {isError ? (
          <div className='flex h-24 items-center justify-center'>
            <div className='text-destructive'>{t('page.failedToLoad')}</div>
          </div>
        ) : (
          <RegisterFormTable />
        )}
      </div>
    </Main>
  )
}
