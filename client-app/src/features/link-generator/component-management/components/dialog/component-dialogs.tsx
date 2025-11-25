import { ComponentCreateDialog } from './component-create-dialog'
import { ComponentDeleteDialog } from './component-delete-dialog'
import { ComponentUpdateDialog } from './component-update-dialog'

export function ComponentDialogs() {
  return (
    <>
      <ComponentCreateDialog />
      <ComponentUpdateDialog />
      <ComponentDeleteDialog />
    </>
  )
}
