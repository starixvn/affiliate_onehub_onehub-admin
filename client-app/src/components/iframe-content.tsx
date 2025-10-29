import { useState } from 'react'

type IframeContentProps = {
  iframePath: string
}

export function IframeContent({ iframePath }: IframeContentProps) {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className='relative h-[calc(100vh-5rem)] w-full'>
      {isLoading && (
        <div className='bg-background absolute inset-0 flex items-center justify-center'>
          <div className='flex flex-col items-center gap-2'>
            <div className='border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent' />
            <p className='text-muted-foreground text-sm'>Loading...</p>
          </div>
        </div>
      )}
      <iframe
        src={iframePath}
        className='h-full w-full border-0'
        onLoad={() => setIsLoading(false)}
        title='Content'
      />
    </div>
  )
}
