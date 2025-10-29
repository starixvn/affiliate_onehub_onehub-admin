import { ConfirmDialog } from '@/components/confirm-dialog'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetActionDialog } from './asset-action-dialog'
import { DeleteAssetDialog } from './delete-asset-dialog'

export function AssetDialogs() {
  const { open, setOpen, currentRow } = useAssetUploader()

  const confirmDelete = () => {
    setOpen(null)
  }

  return (
    <>
      <AssetActionDialog
        open={open === 'upload'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'upload' : null)}
      />
      <AssetActionDialog
        open={open === 'edit'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'edit' : null)}
        asset={currentRow}
      />
      <DeleteAssetDialog
        open={open === 'delete'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'delete' : null)}
        asset={currentRow}
      />
      <ConfirmDialog
        open={open === 'delete-bulk'}
        onOpenChange={(isOpen) => setOpen(isOpen ? 'delete-bulk' : null)}
        title='Delete Assets'
        desc='Are you sure you want to delete selected assets? This action cannot be undone.'
        handleConfirm={confirmDelete}
      />
    </>
  )
}
