import { useLandingPages } from '../page-provider'
import { PageDeleteDialog } from './page-delete-dialog'

export function PageDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useLandingPages()
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
    </>
  )
}

