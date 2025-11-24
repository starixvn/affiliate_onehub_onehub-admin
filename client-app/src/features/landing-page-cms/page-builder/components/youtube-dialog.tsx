import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Info, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type YoutubeDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function YoutubeDialog({ open, onOpenChange }: YoutubeDialogProps) {
  const { t } = useTranslation('page-builder')
  const [copiedCode, setCopiedCode] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Info className='h-5 w-5' />
            {t('form.youtubeDialog.title')}
          </DialogTitle>
          <DialogDescription>
            {t('form.youtubeDialog.instruction')}
          </DialogDescription>
        </DialogHeader>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-4'>
          <div className='space-y-4'>
            <div className='border rounded-lg overflow-hidden bg-muted/10'>
              <iframe
                width='100%'
                height='315'
                src={t('form.youtubeDialog.exampleUrl')}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                referrerPolicy='strict-origin-when-cross-origin'
                allowFullScreen
                className='w-full'
              />
            </div>
          </div>

          <div className='space-y-4'>
            <div className='border rounded-lg p-4 bg-muted/5'>
              <h4 className='font-semibold mb-3'>{t('form.youtubeDialog.embedVideo')}</h4>
              <div className='relative'>
                <div className='text-xs bg-muted/30 p-3 rounded border overflow-x-auto max-h-[200px] overflow-y-auto font-mono'>
                  {(() => {
                    const code = t('form.youtubeDialog.exampleCode')
                    const srcMatch = code.match(/src="([^"]+)"/)
                    if (!srcMatch || !srcMatch.index) return <code>{code}</code>
                    
                    const beforeSrc = code.substring(0, srcMatch.index)
                    const url = srcMatch[1]
                    const afterSrc = code.substring(srcMatch.index + srcMatch[0].length)
                    
                    const embedIndex = url.indexOf('/embed/')
                    const baseUrl = embedIndex >= 0 ? url.substring(0, embedIndex + '/embed/'.length) : ''
                    const videoId = embedIndex >= 0 ? url.substring(embedIndex + '/embed/'.length) : url
                    
                    return (
                      <code className='block whitespace-pre-wrap break-words'>
                        {beforeSrc}
                        <span className='text-foreground'>src="</span>
                        <span className='bg-red-200 dark:bg-red-900/40 px-0.5 rounded'>{baseUrl}</span>
                        <span className='bg-red-200 dark:bg-red-900/40 px-0.5 rounded'>{videoId}</span>
                        <span className='text-foreground'>"</span>
                        {afterSrc}
                      </code>
                    )
                  })()}
                </div>
                <Button
                  size='sm'
                  variant='outline'
                  className='absolute top-2 right-2'
                  onClick={async () => {
                    const code = t('form.youtubeDialog.exampleCode')
                    const urlMatch = code.match(/src="([^"]+)"/)
                    const urlToCopy = urlMatch ? urlMatch[1] : code
                    try {
                      await navigator.clipboard.writeText(urlToCopy)
                      setCopiedCode(true)
                      setTimeout(() => setCopiedCode(false), 2000)
                    } catch (_error) {
                      // Ignore
                    }
                  }}
                >
                  {copiedCode ? (
                    <>
                      <Check className='h-4 w-4 mr-1' />
                      {t('form.youtubeDialog.copied')}
                    </>
                  ) : (
                    <>
                      <Copy className='h-4 w-4 mr-1' />
                      {t('form.youtubeDialog.copy')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t('form.youtubeDialog.ok')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

