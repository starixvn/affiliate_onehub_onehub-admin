import { useState, useEffect, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { usePageBuilder } from './page-builder-provider'

export function CopyLinkButton() {
  const { t } = useTranslation('page-builder')
  const { generatedResult } = usePageBuilder()
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const clearCopyTimeout = () => {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      clearCopyTimeout()
    }
  }, [])

  const handleCopyLink = async () => {
    if (!generatedResult?.landingPageUrl) return

    try {
      await navigator.clipboard.writeText(generatedResult.landingPageUrl)
      setCopied(true)
      clearCopyTimeout()
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (_error) {
      toast.error(t('errors.failedToCopyLink'))
      setCopied(false)
    }
  }

  return (
    <Button 
      variant='secondary' 
      className='h-auto flex-col gap-1 bg-gray-600 p-2 text-xs text-white hover:bg-gray-700 disabled:opacity-50' 
      disabled={!generatedResult?.landingPageUrl}
      onClick={handleCopyLink}
    >
      {copied ? (
        <>
          <Check className='h-4 w-4' />
          <span>{t('form.copied')}</span>
        </>
      ) : (
        <>
          <Copy className='h-4 w-4' />
          <span>{t('form.copy')}</span>
          <span>{t('form.link')}</span>
        </>
      )}
    </Button>
  )
}

