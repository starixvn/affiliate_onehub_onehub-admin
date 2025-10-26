import { useCampaigns } from '../campaign-provider'
import { CampaignActionDialog } from './campaign-action-dialog'
import { CampaignDeleteDialog } from './campaign-delete-dialog'

export function CampaignDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useCampaigns()
  return (
    <>
      <CampaignActionDialog
        key='campaign-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      {currentRow && (
        <>
          <CampaignActionDialog
            key={`campaign-update-${currentRow.campaignCode}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <CampaignDeleteDialog
            key={`campaign-delete-${currentRow.campaignCode}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
