import { ConfirmDialog } from '@/components/confirm-dialog'
import { useAssetUploader } from '../asset-uploader-provider'
import { AssetDialog } from './asset-dialog'
import { DeleteAssetDialog } from './delete-asset-dialog'

export function AssetDialogManager() {
  const { open, setOpen, currentRow } = useAssetUploader()

  const confirmDelete = () => {
    setOpen(null)
  }

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
      <ConfirmDialog
        open={open === 'delete-bulk'}
        onOpenChange={(isOpen: boolean) =>
          setOpen(isOpen ? 'delete-bulk' : null)
        }
        title='Delete Assets'
        desc='Are you sure you want to delete selected assets? This action cannot be undone.'
        handleConfirm={confirmDelete}
      />
    </>
  )
}
