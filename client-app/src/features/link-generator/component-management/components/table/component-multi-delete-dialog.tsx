import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
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
import { type Component } from '../../data/schema'

type ComponentMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<Component>
}

export function ComponentMultiDeleteDialog({
  open,
  onOpenChange,
  table,
}: ComponentMultiDeleteDialogProps) {
  const { t } = useTranslation('component-management')
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleDelete = () => {
    toast.success(
      t('deleteDialog.multiSuccess', { count: selectedRows.length })
    )
    table.resetRowSelection()
    onOpenChange(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('deleteDialog.multiTitle', { count: selectedRows.length })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('deleteDialog.multiDescription', { count: selectedRows.length })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('deleteDialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {t('deleteDialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
