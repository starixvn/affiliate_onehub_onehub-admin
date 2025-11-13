import { CampaignCreateDialog } from './campaign-create-dialog'
import { useGenerateLink } from '../generate-link-provider'
import { ComponentCreateDialog } from './component-create-dialog'

export function GenerateLinkDialogs() {
  const { dialogOpen, setDialogOpen } = useGenerateLink()

  return (
    <>
      <CampaignCreateDialog
        open={dialogOpen === 'campaign'}
        onOpenChange={(open) => setDialogOpen(open ? 'campaign' : null)}
      />

      <ComponentCreateDialog
        componentType='group'
        open={dialogOpen === 'group'}
        onOpenChange={(open) => setDialogOpen(open ? 'group' : null)}
      />

      <ComponentCreateDialog
        componentType='channel'
        open={dialogOpen === 'channel'}
        onOpenChange={(open) => setDialogOpen(open ? 'channel' : null)}
      />

      <ComponentCreateDialog
        componentType='type'
        open={dialogOpen === 'type'}
        onOpenChange={(open) => setDialogOpen(open ? 'type' : null)}
      />

      <ComponentCreateDialog
        componentType='agency'
        open={dialogOpen === 'agency'}
        onOpenChange={(open) => setDialogOpen(open ? 'agency' : null)}
      />

      <ComponentCreateDialog
        componentType='event'
        open={dialogOpen === 'event'}
        onOpenChange={(open) => setDialogOpen(open ? 'event' : null)}
      />
    </>
  )
}

