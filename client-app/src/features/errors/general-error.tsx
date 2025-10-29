import { useNavigate, useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { isInIframe } from '@/lib/iframe-utils'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  const { history } = useRouter()
  const inIframe = isInIframe()

  const handleGoBack = () => {
    if (inIframe) {
      window.top!.history.go(-1)
    } else {
      history.go(-1)
    }
  }

  const handleGoHome = () => {
    if (inIframe) {
      window.top!.location.href = '/'
    } else {
      navigate({ to: '/' })
    }
  }

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>Oops! Something went wrong {`:')`}</span>
        <p className='text-muted-foreground text-center'>
          We apologize for the inconvenience. <br /> Please try again later.
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={handleGoBack}>
              Go Back
            </Button>
            <Button onClick={handleGoHome}>Back to Home</Button>
          </div>
        )}
      </div>
    </div>
  )
}
