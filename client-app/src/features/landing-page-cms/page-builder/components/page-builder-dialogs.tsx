import { usePageBuilder } from './page-builder-provider'
import { CampaignCreateDialog } from './dialogs/campaign-create-dialog'

export function PageBuilderDialogs() {
  const { dialogOpen, setDialogOpen } = usePageBuilder()

  return (
    <>
      <CampaignCreateDialog
        open={dialogOpen === 'campaign'}
        onOpenChange={(open) => setDialogOpen(open ? 'campaign' : null)}
      />
    </>
  )
}

