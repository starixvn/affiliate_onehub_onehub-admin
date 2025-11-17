import { useTranslation } from 'react-i18next'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useUpdateLinkStatus } from '../../api/commands'
import { type LinkInfo } from '../../data/schema'

interface LinkStatusDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: LinkInfo
    newStatusId: number
}

export function LinkStatusDialog({
    open,
    onOpenChange,
    currentRow,
    newStatusId,
}: LinkStatusDialogProps) {
    const { t } = useTranslation('link-management')
    const updateLinkStatus = useUpdateLinkStatus()

    const handleConfirm = () => {
        updateLinkStatus.mutate(
            {
                id: currentRow.linkId,
                data: {
                    linkId: currentRow.linkId,
                    statusId: newStatusId,
                },
            },
            {
                onSuccess: () => {
                    onOpenChange(false)
                },
            }
        )
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('dialogs.statusChange.title')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('dialogs.statusChange.description', {
                            name: currentRow.linkName,
                        })}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{t('dialogs.statusChange.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={updateLinkStatus.isPending}
                    >
                        {updateLinkStatus.isPending
                            ? t('dialogs.statusChange.updating')
                            : t('dialogs.statusChange.confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

