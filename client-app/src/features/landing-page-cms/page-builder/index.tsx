import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'

export function PageBuilder() {
  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Page Builder</h1>
        <div className='flex items-center space-x-2'>
          <Button>Build New Page</Button>
        </div>
      </div>
      <div className='space-y-4'>
        <p className='text-muted-foreground'>
          Create and design landing pages with the page builder.
        </p>
      </div>
    </Main>
  )
}
