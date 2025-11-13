import {
  SharedContent,
  SharedPrimaryButtons,
} from '@/features/landing-page-cms/shared'
import { TRANSLATION_KEY } from '../data/schema'
import { useRegisterFormManagement } from './registration-form-management-provider'
import { RegisterFormTable } from './table/registration-form-table'

export function RegisterFormManagementContent() {
  const {
    registerForms,
    setOpen,
    bannerRootUrl,
    totalCount,
    isLoading,
    isError,
  } = useRegisterFormManagement()

  return (
    <SharedContent
      translationKey={TRANSLATION_KEY}
      Table={RegisterFormTable}
      PrimaryButtons={
        <SharedPrimaryButtons
          translationKey={TRANSLATION_KEY}
          onOpenUpload={() => setOpen('upload')}
        />
      }
      items={registerForms}
      bannerRootUrl={bannerRootUrl}
      totalCount={totalCount}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
