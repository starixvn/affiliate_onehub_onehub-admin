import { useNavigate, useRouter } from '@tanstack/react-router'
import { isInIframe } from '@/lib/iframe-utils'
import { Button } from '@/components/ui/button'

export function UnauthorisedError() {
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
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>401</h1>
        <span className='font-medium'>Unauthorized Access</span>
        <p className='text-muted-foreground text-center'>
          Please log in with the appropriate credentials <br /> to access this
          resource.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={handleGoBack}>
            Go Back
          </Button>
          <Button onClick={handleGoHome}>Back to Home</Button>
        </div>
      </div>
    </div>
  )
}
