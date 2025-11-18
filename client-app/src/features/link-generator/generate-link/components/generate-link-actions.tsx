import { Link, SquareArrowOutUpRight, RefreshCw } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useGenerateLink } from './generate-link-provider'
import { useInsertLink } from '../api/commands'
import type { InsertLinkRequest } from '../types'

export function GenerateLinkActions() {
  const { t } = useTranslation('link-generator')
  const { form, setGeneratedResult, generatedResult } = useGenerateLink()
  const navigate = useNavigate()
  const insertLinkMutation = useInsertLink()

  const handleGenerateLink = form.handleSubmit((data) => {
    const request: InsertLinkRequest = {
      linkName: data.linkName,
      identifierCode: data.identifierCode || undefined,
      campaignId: Number.parseInt(data.campaign, 10) || 0,
      campaignCode: data.campaignCode,
      countryCode: data.country || '',
      marketId: data.language || '',
      shortedLanguageCode: data.shortedLanguageCode || '',
      eventIds: data.event || '',
      eventCodes: data.eventCodes,
      groupId: Number.parseInt(data.group, 10) || 0,
      groupCode: data.groupCode,
      channelId: Number.parseInt(data.channel, 10) || 0,
      channelCode: data.channelCode,
      agencyId: Number.parseInt(data.agency, 10) || 0,
      agencyCode: data.agencyCode,
      typeId: Number.parseInt(data.type, 10) || 0,
      typeCode: data.typeCode,
      landingPage: data.landingPage || '',
      pageType: data.pageType,
      pageCode: data.pageCode || '',
      domainName: data.domainName,
      domainNote: data.domainReservedNote,
      shortDomain: data.shortDomain,
      shortPath: data.shortPath || '',
      note: data.note || undefined,
    }

    insertLinkMutation.mutate(request, {
      onSuccess: (response) => {
        if (response.errorCode === 0 && response.data) {
          if (response.data.idCode && !data.identifierCode) {
            form.setValue('identifierCode', response.data.idCode)
          }
          setGeneratedResult(response.data)
        }
      },
    })
  })

  const handleGoToLinkManagement = () => {
    navigate({ to: '/iframe/link-generator/link-management' })
  }

  const handleReset = () => {
    form.reset()
    setGeneratedResult(null)
  }

  return (
    <div className='flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2'>
      <Button
        onClick={handleGenerateLink}
        className='w-full sm:w-auto'
        disabled={insertLinkMutation.isPending || !!generatedResult}
      >
        <Link className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>
          {insertLinkMutation.isPending ? 'Generating...' : t('buttons.generateLink')}
        </span>
      </Button>
      <Button onClick={handleGoToLinkManagement} className='w-full sm:w-auto'>
        <SquareArrowOutUpRight className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>{t('buttons.goToLinkManagement')}</span>
      </Button>
      <Button variant='outline' onClick={handleReset} className='w-full sm:w-auto'>
        <RefreshCw className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>{t('buttons.reset')}</span>
      </Button>
    </div>
  )
}

