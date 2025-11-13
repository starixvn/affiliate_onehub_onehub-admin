import {
  DeleteMediaDialog,
  StatusChangeDialog,
  SharedDialogManager,
} from '@/features/landing-page-cms/shared'
import { useDeleteMedia, useUpdateMediaStatus } from '../../api/commands'
import { TRANSLATION_KEY } from '../../data/schema'
import { useRegisterFormManagement } from '../registration-form-management-provider'
import { RegisterFormDialog } from './registration-form-dialog'

export function RegisterFormDialogManager() {
  const { open, setOpen, currentRow, targetStatusId } =
    useRegisterFormManagement()

  const DeleteRegisterFormDialog = () => {
    return (
      <DeleteMediaDialog
        translationKey={TRANSLATION_KEY}
        useDeleteMutation={useDeleteMedia}
        media={currentRow}
        open={open === 'delete' ? true : false}
        onOpenChange={(open: boolean) => setOpen(open ? 'delete' : null)}
      />
    )
  }

  const RegisterFormStatusChangeDialog = () => {
    return (
      <StatusChangeDialog
        translationKey={TRANSLATION_KEY}
        open={open === 'status-change' ? true : false}
        onOpenChange={(open: boolean) => setOpen(open ? 'status-change' : null)}
        media={currentRow}
        useUpdateStatusMutation={useUpdateMediaStatus}
        newStatusId={targetStatusId || 1}
      />
    )
  }

  return (
    <SharedDialogManager
      open={open}
      setOpen={setOpen}
      currentRow={currentRow}
      targetStatusId={targetStatusId}
      UploadDialog={RegisterFormDialog}
      EditDialog={RegisterFormDialog}
      DeleteDialog={DeleteRegisterFormDialog}
      StatusChangeDialog={RegisterFormStatusChangeDialog}
    />
  )
}
