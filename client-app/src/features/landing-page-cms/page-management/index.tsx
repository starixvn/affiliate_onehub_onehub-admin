import { Button } from '@/components/ui/button'
import { Main } from '@/components/layout/main'

export function PageManagement() {
  return (
    <Main>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight'>Page Management</h1>
        <div className='flex items-center space-x-2'>
          <Button>Create Page</Button>
        </div>
      </div>
      <div className='space-y-4'>
        <p className='text-muted-foreground'>Manage your landing pages here.</p>
      </div>
    </Main>
  )
}
