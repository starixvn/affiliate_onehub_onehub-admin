import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface IframeHoverPreviewProps {
  src?: string
  children: ReactNode
  className?: string
  maxPreviewSize?: { width: number; height: number }
  disabled?: boolean
}

export function IframeHoverPreview({
  src,
  children,
  className,
  maxPreviewSize = { width: 393, height: 852 },
  disabled = false,
}: IframeHoverPreviewProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeBlocked, setIframeBlocked] = useState(false)
  const [isTriggerHovered, setIsTriggerHovered] = useState(false)
  const [isPreviewHovered, setIsPreviewHovered] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const calculateOptimalSize = useCallback(() => {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const maxWidth = Math.min(maxPreviewSize.width, viewportWidth * 0.8)
    const maxHeight = Math.min(maxPreviewSize.height, viewportHeight * 0.8)

    const aspectRatio = 393 / 852

    let width: number, height: number

    if (maxWidth / aspectRatio > maxHeight) {
      height = maxHeight
      width = maxHeight * aspectRatio
    } else {
      width = maxWidth
      height = maxWidth / aspectRatio
    }

    return {
      width: Math.round(width),
      height: Math.round(height),
    }
  }, [maxPreviewSize])

  const [iframeDimensions, setIframeDimensions] = useState(calculateOptimalSize)

  useEffect(() => {
    const handleResize = () => {
      setIframeDimensions(calculateOptimalSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [calculateOptimalSize])

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!src || disabled) return

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }

      setIsTriggerHovered(true)
      setIframeLoaded(false)
      setIframeBlocked(false)

      e.preventDefault()

      const rect = e.currentTarget.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const previewWidth = iframeDimensions.width + 16
      const previewHeight = iframeDimensions.height + 16

      const table = e.currentTarget.closest('table')
      const isInTable = !!table

      let x = rect.right + 10
      let y = rect.top

      if (isInTable) {
        if (rect.right + previewWidth + 10 > viewportWidth - 20) {
          x = rect.left - previewWidth - 10
        }
        y = rect.top + rect.height / 2 - previewHeight / 2
      }

      if (x + previewWidth > viewportWidth - 20) {
        x = rect.left - previewWidth - 10
      }

      if (x < 20) {
        x = 20
      }

      if (x + previewWidth > viewportWidth - 20) {
        x = Math.max(20, viewportWidth - previewWidth - 20)
      }

      if (x + previewWidth > viewportWidth) {
        x = viewportWidth - previewWidth - 10
      }

      if (x < 0) {
        x = 10
      }

      if (y + previewHeight > viewportHeight - 20) {
        y = viewportHeight - previewHeight - 20
      }

      if (y < 20) {
        y = 20
      }

      setPreviewPosition({ x, y })
      setShowPreview(true)
    },
    [src, disabled, iframeDimensions]
  )

  const handleMouseLeave = useCallback(() => {
    setIsTriggerHovered(false)

    closeTimeoutRef.current = setTimeout(() => {
      setShowPreview(false)
      setIsPreviewHovered(false)
    }, 100)
  }, [])

  const handlePreviewMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsPreviewHovered(true)
  }, [])

  const handlePreviewMouseLeave = useCallback(() => {
    setIsPreviewHovered(false)

    closeTimeoutRef.current = setTimeout(() => {
      if (!isTriggerHovered) {
        setShowPreview(false)
      }
    }, 100)
  }, [isTriggerHovered])

  const handleIframeLoad = useCallback(() => {
    setIframeLoaded(true)
    setIframeBlocked(false)
  }, [])

  const handleIframeError = useCallback(() => {
    setIframeBlocked(true)
    setIframeLoaded(false)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        showPreview &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        previewRef.current &&
        !previewRef.current.contains(e.target as Node)
      ) {
        setShowPreview(false)
      }
    }

    const preventScroll = (e: WheelEvent | TouchEvent) => {
      if (showPreview && previewRef.current) {
        const table = (e.target as HTMLElement).closest('table')
        if (!table) {
          e.preventDefault()
        }
      }
    }

    const preventHorizontalScroll = () => {
      if (showPreview) {
        document.body.style.overflowX = 'hidden'
      } else {
        document.body.style.overflowX = ''
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    if (showPreview) {
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })
      preventHorizontalScroll()
    } else {
      preventHorizontalScroll()
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('wheel', preventScroll)
      document.removeEventListener('touchmove', preventScroll)
      document.body.style.overflowX = ''
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [showPreview])

  return (
    <>
      <div
        ref={triggerRef}
        className={cn(
          'transition-colors',
          src && !disabled && 'hover:bg-primary/5 cursor-pointer',
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>

      {showPreview &&
        src &&
        !disabled &&
        createPortal(
          <>
            <div
              className='pointer-events-none fixed inset-0'
              style={{ zIndex: 9999 }}
            />
            <div
              ref={previewRef}
              className='bg-background pointer-events-auto fixed overflow-hidden rounded-lg border-2 shadow-lg will-change-transform'
              style={{
                left: `${previewPosition.x}px`,
                top: `${previewPosition.y}px`,
                zIndex: 10000,
                padding: '8px',
                width: `${iframeDimensions.width + 16}px`,
                height: `${iframeDimensions.height + 16}px`,
                maxWidth: `${window.innerWidth - 40}px`,
                maxHeight: `${window.innerHeight - 40}px`,
                boxSizing: 'border-box',
                transform: 'translateZ(0)',
              }}
              onMouseEnter={handlePreviewMouseEnter}
              onMouseLeave={handlePreviewMouseLeave}
            >
              <div className='bg-muted relative h-full w-full overflow-hidden rounded border'>
                <iframe
                  ref={iframeRef}
                  src={src}
                  title='Landing Page Preview'
                  className={cn(
                    'absolute top-0 left-0 h-full w-full border-none',
                    iframeLoaded ? 'block' : 'hidden'
                  )}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  scrolling='no'
                />

                {!iframeLoaded && !iframeBlocked && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                      <Loader2 className='text-primary mx-auto h-6 w-6 animate-spin' />
                      <div className='text-muted-foreground mt-2 text-xs'>
                        Loading preview...
                      </div>
                    </div>
                  </div>
                )}

                {iframeBlocked && (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center'>
                      <div className='text-destructive text-sm font-medium'>
                        Unable to load preview
                      </div>
                      <div className='text-muted-foreground mt-1 text-xs'>
                        This page cannot be displayed in iframe
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  )
}
