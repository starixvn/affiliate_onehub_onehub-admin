import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { AssetDetail } from '../../data/schema'
import { useDeleteAsset } from '../../api/commands'

interface DeleteAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: AssetDetail | null
}

export function DeleteAssetDialog({
  open,
  onOpenChange,
  asset,
}: DeleteAssetDialogProps) {
  const deleteMutation = useDeleteAsset()
  const handleConfirm = () => {
    if (asset) {
      deleteMutation.mutate(asset.mediaId.toString(), {
        onSuccess: (response: any) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
          } else {
            toast.error(response.errorMessage || 'Failed to delete asset')
          }
        },
      })
    }
  }

  if (!asset) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title='Delete Asset'
      desc={`Are you sure you want to delete "${asset.mediaName}"? This action cannot be undone.`}
      confirmText='Delete'
      destructive
      handleConfirm={handleConfirm}
    />
  )
}
