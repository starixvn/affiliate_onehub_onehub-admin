import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { DisplayForm } from '@/features/settings/display/display-form'

function SettingsPage() {
  return (
    <Main fixed>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Settings
        </h1>
        <p className='text-muted-foreground'>
          Turn items on or off to control what's displayed in the app.
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
          <div className='lg:max-w-xl'>
            <DisplayForm />
          </div>
        </div>
      </div>
    </Main>
  )
}

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsPage,
})
