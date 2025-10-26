import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '@/components/ui/separator'
import { Main } from '@/components/layout/main'
import { ProfileForm } from '@/features/settings/profile/profile-form'

function ProfilePage() {
  return (
    <Main fixed>
      <div className='space-y-0.5'>
        <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
          Profile
        </h1>
        <p className='text-muted-foreground'>
          This is how others will see you on the site.
        </p>
      </div>
      <Separator className='my-4 lg:my-6' />
      <div className='flex flex-1 flex-col overflow-hidden'>
        <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
          <div className='lg:max-w-xl'>
            <ProfileForm />
          </div>
        </div>
      </div>
    </Main>
  )
}

export const Route = createFileRoute('/_authenticated/profile/')({
  component: ProfilePage,
})
