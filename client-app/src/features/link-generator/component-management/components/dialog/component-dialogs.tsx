import { ComponentCreateDialog } from './component-create-dialog'
import { ComponentUpdateDialog } from './component-update-dialog'
import { ComponentDeleteDialog } from './component-delete-dialog'

export function ComponentDialogs() {
  return (
    <>
      <ComponentCreateDialog />
      <ComponentUpdateDialog />
      <ComponentDeleteDialog />
    </>
  )
}
