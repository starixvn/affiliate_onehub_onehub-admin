import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImagePreviewCellProps {
  fileName: string
  imageUrl: string
  thumbnailUrl?: string
}

export function ImagePreviewCell({
  fileName,
  imageUrl,
  thumbnailUrl,
}: ImagePreviewCellProps) {
  const [isOpen, setIsOpen] = useState(false)

  const thumb = thumbnailUrl || imageUrl

  return (
    <>
      <div className='flex justify-center py-2'>
        <div
          className='hover:ring-primary h-24 w-48 cursor-pointer overflow-hidden rounded-lg border-2 shadow-sm transition-all hover:shadow-md hover:ring-2'
          onClick={() => setIsOpen(true)}
        >
          {thumb ? (
            <img
              src={thumb}
              alt={fileName}
              className='h-full w-full object-contain'
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.innerHTML = `<div class="bg-muted flex h-full w-full items-center justify-center text-xs">No Image</div>`
                }
              }}
            />
          ) : (
            <div className='bg-muted flex h-full w-full items-center justify-center text-xs'>
              No Image
            </div>
          )}
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>{fileName}</DialogTitle>
          </DialogHeader>
          <div className='flex items-center justify-center'>
            <img
              src={imageUrl}
              alt={fileName}
              className='max-h-[70vh] w-auto rounded-lg'
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
