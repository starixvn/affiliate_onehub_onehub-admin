import {
  DeleteMediaDialog,
  StatusChangeDialog,
  SharedDialogManager,
} from '@/features/landing-page-cms/shared'
import { useDeleteMedias, useUpdateMediaStatus } from '../../api/commands'
import { TRANSLATION_KEY } from '../../data/schema'
import type { RegisterFormDetail } from '../../data/schema'
import { useRegisterFormManagement } from '../registration-form-management-provider'
import { RegisterFormDialog } from './registration-form-dialog'

function DeleteRegisterFormDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: RegisterFormDetail
}) {
  return (
    <DeleteMediaDialog
      translationKey={TRANSLATION_KEY}
      useDeleteMutation={useDeleteMedias}
      media={item}
      open={open}
      onOpenChange={onOpenChange}
    />
  )
}

function RegisterFormStatusChangeDialog({
  open,
  onOpenChange,
  item,
  newStatusId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: RegisterFormDetail
  newStatusId: number
}) {
  return (
    <StatusChangeDialog
      translationKey={TRANSLATION_KEY}
      open={open}
      onOpenChange={onOpenChange}
      media={item}
      useUpdateStatusMutation={useUpdateMediaStatus}
      newStatusId={newStatusId}
    />
  )
}

export function RegisterFormDialogManager() {
  const { open, setOpen, currentRow, targetStatusId } =
    useRegisterFormManagement()

  return (
    <SharedDialogManager
      open={open}
      setOpen={setOpen}
      currentItem={currentRow}
      targetStatusId={targetStatusId}
      UploadDialog={RegisterFormDialog}
      EditDialog={RegisterFormDialog}
      DeleteDialog={DeleteRegisterFormDialog}
      StatusChangeDialog={RegisterFormStatusChangeDialog}
    />
  )
}
