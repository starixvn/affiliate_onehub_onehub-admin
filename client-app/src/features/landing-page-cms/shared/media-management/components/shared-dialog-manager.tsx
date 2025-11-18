import type { DialogType } from '../schema/types'

export interface SharedDialogManagerProps<TDetail> {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentItem: TDetail | null
  targetStatusId: number | null
  UploadDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
  }>
  EditDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
    item: TDetail
  }>
  DeleteDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
    item: TDetail
  }>
  StatusChangeDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
    item: TDetail
    newStatusId: number
  }>
}

export function SharedDialogManager<TDetail>({
  open,
  setOpen,
  currentItem,
  targetStatusId,
  UploadDialog,
  EditDialog,
  DeleteDialog,
  StatusChangeDialog,
}: SharedDialogManagerProps<TDetail>) {
  return (
    <>
      <UploadDialog
        open={open === 'upload'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'upload' : null)}
      />
      <EditDialog
        open={open === 'edit'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'edit' : null)}
        item={currentItem!}
      />
      <DeleteDialog
        open={open === 'delete'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'delete' : null)}
        item={currentItem!}
      />
      <StatusChangeDialog
        open={open === 'status-change'}
        onOpenChange={(isOpen: boolean) =>
          setOpen(isOpen ? 'status-change' : null)
        }
        item={currentItem!}
        newStatusId={targetStatusId || 1}
      />
    </>
  )
}
