import { useState, useEffect, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { LinkGeneratedResult } from '../types'

type GenerateLinkResultProps = {
    result: LinkGeneratedResult
}

export function GenerateLinkResult({ result }: GenerateLinkResultProps) {
    const [copied, setCopied] = useState(false)
    const resultRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [])

    const handleCopyShortLink = async () => {
        try {
            await navigator.clipboard.writeText(result.shortLink)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            setCopied(false)
        }
    }

    return (
        <div ref={resultRef} className='rounded-lg border bg-card p-4 sm:p-6 space-y-4'>
            <h3 className='text-lg font-semibold'>Link Generated</h3>

            <div className='space-y-4'>
                <div className='flex items-center gap-2'>
                    <Label className='text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md whitespace-nowrap w-24 flex items-center justify-center'>Full Link</Label>
                    <div className='flex-1 rounded-md border bg-muted/50 p-2'>
                        <p className='text-sm break-all select-none font-mono'>{result.fullLink}</p>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <Label className='text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-md whitespace-nowrap w-24 flex items-center justify-center'>Short Link</Label>
                    <div className='flex-1 flex items-center gap-2 rounded-md border bg-muted/50 p-2'>
                        <p className='text-sm break-all select-all font-mono flex-1'>{result.shortLink}</p>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={handleCopyShortLink}
                            className='shrink-0 h-6 w-6'
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

