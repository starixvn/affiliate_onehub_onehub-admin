import {
  DeleteMediaDialog,
  StatusChangeDialog,
  SharedDialogManager,
} from '@/features/landing-page-cms/shared'
import { useDeleteMedias, useUpdateMediaStatus } from '../../api/commands'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetDialog } from './asset-dialog'
import { TRANSLATION_KEY } from '../../data/schema'

export function AssetDialogManager() {
  const { open, setOpen, currentRow, targetStatusId } = useAssetUploader()

  const DeleteAssetDialog = () => {
    return (
      <DeleteMediaDialog
        translationKey={TRANSLATION_KEY}
        useDeleteMutation={useDeleteMedias}
        media={currentRow}
        open={open === 'delete' ? true : false}
        onOpenChange={(open: boolean) => setOpen(open ? 'delete' : null)}
      />
    )
  }

  const AssetStatusChangeDialog = () => {
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
      UploadDialog={AssetDialog}
      EditDialog={AssetDialog}
      DeleteDialog={DeleteAssetDialog}
      StatusChangeDialog={AssetStatusChangeDialog}
    />
  )
}
