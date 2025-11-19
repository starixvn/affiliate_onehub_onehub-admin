import { useRegisterFormManagement } from '../registration-form-management-provider'
import { RegisterFormDialog } from './registration-form-dialog'
import { RegisterFormStatusChangeDialog } from './registration-form-status-change-dialog'
import { DeleteRegisterFormDialog } from './delete-registration-form-dialog'

export function RegisterFormDialogManager() {
  const { open, setOpen, currentRow, targetStatusId } = useRegisterFormManagement()

  return (
    <>
      <RegisterFormDialog
        open={open === 'upload'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'upload' : null)}
      />
      <RegisterFormDialog
        open={open === 'edit'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'edit' : null)}
        registerForm={currentRow}
      />
      <DeleteRegisterFormDialog
        open={open === 'delete'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'delete' : null)}
        registerForm={currentRow}
      />
      <RegisterFormStatusChangeDialog
        open={open === 'status-change'}
        onOpenChange={(isOpen: boolean) =>
          setOpen(isOpen ? 'status-change' : null)
        }
        registerForm={currentRow}
        newStatusId={targetStatusId || 1}
      />
    </>
  )
}
