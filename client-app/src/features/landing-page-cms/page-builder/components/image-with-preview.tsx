import { useEffect, useState } from 'react'
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'

type ImageWithPreviewProps = {
  imageUrl: string
  alt: string
}

export function ImageWithPreview({ imageUrl, alt }: ImageWithPreviewProps) {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null)

  useEffect(() => {
    if (imageUrl) {
      const img = new Image()
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height })
      }
      img.onerror = () => {
        setImageSize(null)
      }
      img.src = imageUrl
    }
  }, [imageUrl])

  const getPreviewSize = () => {
    if (!imageSize) return { maxWidth: '500px', maxHeight: '500px' }
    const { width, height } = imageSize
    
    if (width < 500 && height < 500) {
      return { maxWidth: `${width}px`, maxHeight: `${height}px` }
    }
    
    const aspectRatio = width / height
    if (width >= height) {
      return { maxWidth: '500px', maxHeight: `${500 / aspectRatio}px` }
    } else {
      return { maxWidth: `${500 * aspectRatio}px`, maxHeight: '500px' }
    }
  }

  const previewSize = getPreviewSize()

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='h-8 w-8 flex-shrink-0 flex items-center justify-center bg-muted rounded overflow-hidden cursor-pointer'>
            <img
              src={imageUrl}
              alt={alt}
              className='max-h-full max-w-full object-contain'
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side='right'
          className='p-2 bg-popover border max-w-none'
          sideOffset={8}
        >
          <div className='flex items-center justify-center'>
            <img
              src={imageUrl}
              alt={alt}
              style={{
                maxWidth: previewSize.maxWidth,
                maxHeight: previewSize.maxHeight,
              }}
              className='object-contain rounded'
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

