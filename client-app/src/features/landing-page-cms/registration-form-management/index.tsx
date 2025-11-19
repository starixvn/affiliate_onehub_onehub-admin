import { RegisterFormManagementContent } from './components/registration-form-management-content'
import { RegisterFormManagementProvider } from './components/registration-form-management-provider'
import { RegisterFormDialogManager } from './components/dialog/registration-form-dialog-manager'

export function RegisterFormManagement() {
  return (
    <RegisterFormManagementProvider>
      <RegisterFormManagementContent />
      <RegisterFormDialogManager />
    </RegisterFormManagementProvider>
  )
}