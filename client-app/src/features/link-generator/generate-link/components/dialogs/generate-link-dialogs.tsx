import { useGenerateLink } from '../generate-link-provider'
import { CampaignCreateDialog } from './campaign-create-dialog'
import { ComponentCreateDialog } from './component-create-dialog'
import { componentTypes } from '../../data/data'

export function GenerateLinkDialogs() {
  const { dialogOpen, setDialogOpen } = useGenerateLink()

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
