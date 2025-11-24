import { useLandingPages } from '../page-provider'
import { PageBulkStatusChangeDialog } from './page-bulk-status-change-dialog'
import { PageDeleteDialog } from './page-delete-dialog'
import { PageStatusChangeDialog } from './page-status-change-dialog'

export function PageDialogs() {
  const {
    open,
    setOpen,
    currentRow,
    setCurrentRow,
    newStatusId,
    setNewStatusId,
    pendingBulkStatusChange,
    setPendingBulkStatusChange,
  } = useLandingPages()
  return (
    <>
      {currentRow && (
        <PageDeleteDialog
          key={`page-delete-${currentRow.lpCode}`}
          open={open === 'delete'}
          onOpenChange={() => {
            setOpen('delete')
            setTimeout(() => {
              setCurrentRow(null)
            }, 500)
          }}
          currentRow={currentRow}
        />
      )}
      {currentRow && newStatusId !== null && (
        <PageStatusChangeDialog
          open={open === 'statusChange'}
          onOpenChange={() => {
            setOpen(null)
            setCurrentRow(null)
            setNewStatusId(null)
          }}
          currentRow={currentRow}
          newStatusId={newStatusId}
        />
      )}
      {pendingBulkStatusChange && (
        <PageBulkStatusChangeDialog
          open={open === 'bulkStatusChange'}
          onOpenChange={() => {
            setOpen(null)
            setPendingBulkStatusChange(null)
          }}
          pageIds={pendingBulkStatusChange.pageIds}
          newStatusId={pendingBulkStatusChange.statusId}
          affectedCount={pendingBulkStatusChange.affectedCount}
          onSuccess={pendingBulkStatusChange.onSuccess}
        />
      )}
    </>
  )
}
