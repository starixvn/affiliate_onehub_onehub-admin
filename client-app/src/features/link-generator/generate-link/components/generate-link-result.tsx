import { useState, useEffect, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { LinkGeneratedResult } from '../types'

type GenerateLinkResultProps = {
  result: LinkGeneratedResult
}

export function GenerateLinkResult({ result }: GenerateLinkResultProps) {
  const [copied, setCopied] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    return () => {
      clearExistingTimeout()
    }
  }, [])

  const handleCopyShortLink = async () => {
    try {
      await navigator.clipboard.writeText(result.shortLink)
      setCopied(true)
      clearExistingTimeout()
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch (_error) {
      toast.error('Failed to copy link to clipboard')
      setCopied(false)
    }
  }

  return (
    <div
      ref={resultRef}
      className='bg-card space-y-4 rounded-lg border p-4 sm:p-6'
    >
      <h3 className='text-lg font-semibold'>Link Generated</h3>

      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <Label className='bg-primary text-primary-foreground flex w-24 items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap'>
            Full Link
          </Label>
          <div className='bg-muted/50 flex-1 rounded-md border p-2'>
            <p className='font-mono text-sm break-all select-none'>
              {result.fullLink}
            </p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Label className='bg-primary text-primary-foreground flex w-24 items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap'>
            Short Link
          </Label>
          <div className='bg-muted/50 flex flex-1 items-center gap-2 rounded-md border p-2'>
            <p className='flex-1 font-mono text-sm break-all select-all'>
              {result.shortLink}
            </p>
            <Button
              variant='ghost'
              size='icon'
              onClick={handleCopyShortLink}
              className='h-6 w-6 shrink-0'
            >
              {copied ? (
                <Check className='h-4 w-4 text-green-500' />
              ) : (
                <Copy className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
