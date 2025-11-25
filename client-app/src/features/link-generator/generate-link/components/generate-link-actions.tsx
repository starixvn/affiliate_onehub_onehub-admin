import { useNavigate } from '@tanstack/react-router'
import { Link, SquareArrowOutUpRight, RefreshCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useInsertLink } from '../api/commands'
import type { InsertLinkRequest } from '../types'
import { useGenerateLink } from './generate-link-provider'

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
      pageType: data.pageType,
      pageCode: data.pageCode || '',
      domainName: data.domainName,
      domainNote: data.domainReservedNote,
      shortDomain: data.shortDomain,
      shortPath: data.shortPath || '',
      note: data.note || '',
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
    <div className='flex flex-col flex-wrap items-stretch gap-2 sm:flex-row sm:items-center'>
      <Button
        onClick={handleGenerateLink}
        className='w-full sm:w-auto'
        disabled={insertLinkMutation.isPending || !!generatedResult}
        aria-label={
          insertLinkMutation.isPending
            ? t('buttons.generating')
            : t('buttons.generateLink')
        }
      >
        <Link className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>
          {insertLinkMutation.isPending
            ? t('buttons.generating')
            : t('buttons.generateLink')}
        </span>
      </Button>
      <Button
        onClick={handleGoToLinkManagement}
        className='w-full sm:w-auto'
        aria-label={t('buttons.goToLinkManagement')}
      >
        <SquareArrowOutUpRight className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>
          {t('buttons.goToLinkManagement')}
        </span>
      </Button>
      <Button
        variant='outline'
        onClick={handleReset}
        className='w-full sm:w-auto'
        aria-label={t('buttons.reset')}
      >
        <RefreshCw className='h-4 w-4 sm:mr-2' />
        <span className='hidden sm:inline'>{t('buttons.reset')}</span>
      </Button>
    </div>
  )
}
