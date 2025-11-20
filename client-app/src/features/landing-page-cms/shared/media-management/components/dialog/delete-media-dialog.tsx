import { type UseMutationResult } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ConfirmDialog } from '@/components/confirm-dialog'
import type { MediaDetail } from '../../schema'
import type { DeleteMediaResponse } from '../../schema/types'

interface DeleteMediaDialogProps {
  translationKey: string
  useDeleteMutation: () => UseMutationResult<
    DeleteMediaResponse,
    Error,
    string,
    unknown
  >
  media: MediaDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function DeleteMediaDialog({
  translationKey,
  useDeleteMutation,
  media,
  open,
  onOpenChange,
}: DeleteMediaDialogProps) {
  const { t } = useTranslation(translationKey)
  const deleteMutation = useDeleteMutation()
  const handleConfirm = () => {
    if (media && !media.isMediaIdInUse) {
      deleteMutation.mutate(media.mediaId.toString(), {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            onOpenChange(false)
          }
        },
      })
    }
  }

  if (!media) return null

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('dialogs.confirmDeleteSingle', { mediaName: media.mediaName })}
      desc={t('dialogs.deleteDescription')}
      confirmText={
        deleteMutation.isPending ? t('dialogs.deleting') : t('buttons.ok')
      }
      destructive
      handleConfirm={handleConfirm}
      isLoading={deleteMutation.isPending}
    />
  )
}
