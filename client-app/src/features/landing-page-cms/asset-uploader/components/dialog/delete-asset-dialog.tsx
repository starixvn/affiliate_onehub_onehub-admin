import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('asset-uploader')
  const deleteMutation = useDeleteAsset()
  const handleConfirm = () => {
    if (asset) {
      deleteMutation.mutate(asset.mediaId.toString(), {
        onSuccess: (response: any) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
          } else {
            toast.error(response.errorMessage || t('toasts.deleteFailed'))
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
      title={t('dialogs.deleteAsset')}
      desc={t('dialogs.confirmDeleteSingle', { assetName: asset.mediaName })}
      confirmText={t('dialogs.delete')}
      destructive
      handleConfirm={handleConfirm}
    />
  )
}
