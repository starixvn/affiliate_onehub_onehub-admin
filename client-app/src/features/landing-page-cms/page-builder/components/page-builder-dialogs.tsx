import { useEffect, useRef } from 'react'
import { usePageBuilder } from './page-builder-provider'
import { CampaignCreateDialog } from './dialogs/campaign-create-dialog'
import { useQueryClient } from '@tanstack/react-query'
import { pageBuilderKeys } from '../api/queries'
import { useGetCampaigns } from '../api/queries'
import type { CampaignInfo } from '../types'

export function PageBuilderDialogs() {
  const { dialogOpen, setDialogOpen, form } = usePageBuilder()
  const queryClient = useQueryClient()
  const { data: campaigns } = useGetCampaigns()
  const createdCampaignNameRef = useRef<string | null>(null)

  const handleCampaignCreated = (campaignName: string) => {
    createdCampaignNameRef.current = campaignName
    queryClient.invalidateQueries({
      queryKey: pageBuilderKeys.campaigns(),
    })
  }

  useEffect(() => {
    if (campaigns && createdCampaignNameRef.current && dialogOpen === null) {
      const newCampaign = campaigns.find(
        (campaign: CampaignInfo) => campaign.campaignName === createdCampaignNameRef.current
      )
      
      if (newCampaign) {
        form.setValue('campaign', String(newCampaign.campaignId))
        if (newCampaign.campaignCode) {
          form.setValue('campaignCode', newCampaign.campaignCode)
        }
        createdCampaignNameRef.current = null
      }
    }
  }, [campaigns, dialogOpen, form])

  return (
    <>
      <CampaignCreateDialog
        open={dialogOpen === 'campaign'}
        onOpenChange={(open) => setDialogOpen(open ? 'campaign' : null)}
        onCampaignCreated={handleCampaignCreated}
      />
    </>
  )
}

