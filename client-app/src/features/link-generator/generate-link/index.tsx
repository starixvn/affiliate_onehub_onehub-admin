import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'

export function GenerateLink() {
  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Generate Link</h1>
        <div className='flex items-center space-x-2'>
          <Button>Generate New Link</Button>
        </div>
      </div>
      <div className='space-y-4'>
        <p className='text-muted-foreground'>
          Create tracking links for your campaigns.
        </p>
      </div>
    </Main>
  )
}
