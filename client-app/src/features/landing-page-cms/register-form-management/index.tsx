import { getRouteApi } from '@tanstack/react-router'
import { RegisterFormManagementContent } from './components/register-form-management-content'
import { RegisterFormManagementProvider } from './components/register-form-management-provider'
import { RegisterFormDialogManager } from './components/dialog/register-form-dialog-manager'
import { normalizeSearchParams } from './data/constants'

const route = getRouteApi('/iframe/landing-page-cms/register-form-management/')

export function RegisterFormManagement() {
  const search = route.useSearch()

  const params = normalizeSearchParams(search)

  return (
    <RegisterFormManagementProvider params={params}>
      <RegisterFormManagementContent />
      <RegisterFormDialogManager />
    </RegisterFormManagementProvider>
  )
}