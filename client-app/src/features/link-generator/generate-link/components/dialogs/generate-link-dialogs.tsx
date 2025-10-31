import { CampaignActionDialog } from '@/features/campaign-management/components/dialog/campaign-action-dialog'
import { useGenerateLink } from '../generate-link-provider'
import { AddComponentDialog } from './add-component-dialog'

export function GenerateLinkDialogs() {
  const { dialogOpen, setDialogOpen } = useGenerateLink()

  return (
    <>
      <CampaignActionDialog
        open={dialogOpen === 'campaign'}
        onOpenChange={(open) => setDialogOpen(open ? 'campaign' : null)}
      />

      <AddComponentDialog
        componentType='group'
        open={dialogOpen === 'group'}
        onOpenChange={(open) => setDialogOpen(open ? 'group' : null)}
      />

      <AddComponentDialog
        componentType='channel'
        open={dialogOpen === 'channel'}
        onOpenChange={(open) => setDialogOpen(open ? 'channel' : null)}
      />

      <AddComponentDialog
        componentType='type'
        open={dialogOpen === 'type'}
        onOpenChange={(open) => setDialogOpen(open ? 'type' : null)}
      />

      <AddComponentDialog
        componentType='agency'
        open={dialogOpen === 'agency'}
        onOpenChange={(open) => setDialogOpen(open ? 'agency' : null)}
      />

      <AddComponentDialog
        componentType='event'
        open={dialogOpen === 'event'}
        onOpenChange={(open) => setDialogOpen(open ? 'event' : null)}
      />
    </>
  )
}

