import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { NotificationsForm } from '@/features/settings/notifications/notifications-form'

function NotificationsPage() {
  return (
    <Main fixed>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Notifications
        </h1>
        <p className='text-muted-foreground'>
          Configure how you receive notifications.
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
          <div className='lg:max-w-xl'>
            <NotificationsForm />
          </div>
        </div>
      </div>
    </Main>
  )
}

export const Route = createFileRoute('/_authenticated/notifications/')({
  component: NotificationsPage,
})
