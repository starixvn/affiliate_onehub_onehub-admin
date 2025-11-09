import { useAssetUploader } from '../asset-uploader-provider'
import { AssetDialog } from './asset-dialog'
import { AssetStatusChangeDialog } from './asset-status-change-dialog'
import { DeleteAssetDialog } from './delete-asset-dialog'

export function AssetDialogManager() {
  const { open, setOpen, currentRow, targetStatusId } = useAssetUploader()

  return (
    <>
      <AssetDialog
        open={open === 'upload'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'upload' : null)}
      />
      <AssetDialog
        open={open === 'edit'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'edit' : null)}
        asset={currentRow}
      />
      <DeleteAssetDialog
        open={open === 'delete'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'delete' : null)}
        asset={currentRow}
      />
      <AssetStatusChangeDialog
        open={open === 'status-change'}
        onOpenChange={(isOpen: boolean) =>
          setOpen(isOpen ? 'status-change' : null)
        }
        asset={currentRow}
        newStatusId={targetStatusId || 1}
      />
    </>
  )
}
