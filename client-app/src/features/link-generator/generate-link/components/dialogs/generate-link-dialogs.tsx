import { useGenerateLink } from '../generate-link-provider'
import { CampaignCreateDialog } from './campaign-create-dialog'
import { ComponentCreateDialog } from './component-create-dialog'

export function GenerateLinkDialogs() {
  const { dialogOpen, setDialogOpen } = useGenerateLink()

  const componentTypes = [
    'group',
    'channel',
    'type',
    'agency',
    'event',
  ] as const

  return (
    <>
      <CampaignCreateDialog
        open={dialogOpen === 'campaign'}
        onOpenChange={(open) => setDialogOpen(open ? 'campaign' : null)}
      />

      {componentTypes.map((componentType) => (
        <ComponentCreateDialog
          key={componentType}
          componentType={componentType}
          open={dialogOpen === componentType}
          onOpenChange={(open) => setDialogOpen(open ? componentType : null)}
        />
      ))}
    </>
  )
}
