import { RegisterFormManagementContent } from './components/register-form-management-content'
import { RegisterFormManagementProvider } from './components/register-form-management-provider'
import { RegisterFormDialogManager } from './components/dialog/register-form-dialog-manager'

export function RegisterFormManagement() {
  return (
    <RegisterFormManagementProvider>
      <RegisterFormManagementContent />
      <RegisterFormDialogManager />
    </RegisterFormManagementProvider>
  )
}