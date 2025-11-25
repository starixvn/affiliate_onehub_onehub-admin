import {
  DeleteMediaDialog,
  StatusChangeDialog,
  SharedDialogManager,
} from '@/features/landing-page-cms/shared'
import { useDeleteMedias, useUpdateMediaStatus } from '../../api/commands'
import { TRANSLATION_KEY } from '../../data/schema'
import type { AssetDetail } from '../../data/schema'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetDialog } from './asset-dialog'

function DeleteAssetDialog({
  open,
  onOpenChange,
  item,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: AssetDetail
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

function AssetStatusChangeDialog({
  open,
  onOpenChange,
  item,
  newStatusId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: AssetDetail
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

export function AssetDialogManager() {
  const { open, setOpen, currentRow, targetStatusId } = useAssetUploader()

  return (
    <SharedDialogManager
      open={open}
      setOpen={setOpen}
      currentItem={currentRow}
      targetStatusId={targetStatusId}
      UploadDialog={AssetDialog}
      EditDialog={AssetDialog}
      DeleteDialog={DeleteAssetDialog}
      StatusChangeDialog={AssetStatusChangeDialog}
    />
  )
}
