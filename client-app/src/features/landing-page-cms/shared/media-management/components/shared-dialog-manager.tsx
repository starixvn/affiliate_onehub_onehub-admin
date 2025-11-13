import type { DialogType } from '../schema/types'

export interface SharedDialogManagerProps<TDetail> {
  open: DialogType | null
  setOpen: (str: DialogType | null) => void
  currentRow: TDetail | null
  targetStatusId: number | null
  UploadDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
  }>
  EditDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
    asset?: TDetail | null
    registerForm?: TDetail | null
  }>
  DeleteDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
    asset?: TDetail | null
    registerForm?: TDetail | null
  }>
  StatusChangeDialog: React.ComponentType<{
    open: boolean
    onOpenChange: (open: boolean) => void
    asset?: TDetail | null
    registerForm?: TDetail | null
    newStatusId: number
  }>
}

export function SharedDialogManager<TDetail>({
  open,
  setOpen,
  currentRow,
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
        asset={currentRow}
        registerForm={currentRow}
      />
      <DeleteDialog
        open={open === 'delete'}
        onOpenChange={(isOpen: boolean) => setOpen(isOpen ? 'delete' : null)}
        asset={currentRow}
        registerForm={currentRow}
      />
      <StatusChangeDialog
        open={open === 'status-change'}
        onOpenChange={(isOpen: boolean) =>
          setOpen(isOpen ? 'status-change' : null)
        }
        asset={currentRow}
        registerForm={currentRow}
        newStatusId={targetStatusId || 1}
      />
    </>
  )
}
