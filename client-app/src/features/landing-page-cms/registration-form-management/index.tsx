import { RegisterFormDialogManager } from './components/dialog/registration-form-dialog-manager'
import { RegisterFormManagementContent } from './components/registration-form-management-content'
import { RegisterFormManagementProvider } from './components/registration-form-management-provider'

export function RegisterFormManagement() {
  return (
    <RegisterFormManagementProvider>
      <RegisterFormManagementContent />
      <RegisterFormDialogManager />
    </RegisterFormManagementProvider>
  )
}
