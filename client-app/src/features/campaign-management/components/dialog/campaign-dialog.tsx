import { useCampaigns } from '../campaign-provider'
import { CampaignCreateDialog } from './campaign-create-dialog'
import { CampaignUpdateDialog } from './campaign-update-dialog'
import { CampaignDeleteDialog } from './campaign-delete-dialog'

export function CampaignDialogs() {
  const { open, currentRow, setCurrentRow, setOpen } = useCampaigns()
  return (
    <>
      <CampaignCreateDialog />

      {currentRow && (
        <>
          <CampaignUpdateDialog />

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
