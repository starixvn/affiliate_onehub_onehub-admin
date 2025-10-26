import { Link } from '@tanstack/react-router'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar'

export function AppTitle() {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size='lg'
          className='gap-0 py-0 hover:bg-transparent active:bg-transparent'
          asChild
        >
          <div className='flex w-full items-center'>
            <Link
              to='/'
              onClick={() => setOpenMobile(false)}
              className='flex flex-1 items-end gap-2 text-start group-data-[collapsible=icon]:hidden'
            >
              <img
                src='/images/favicon.svg'
                alt='ONEHub'
                className='size-8 shrink-0'
              />
              <span className='truncate text-base font-bold'>ONEHub Admin</span>
            </Link>
            <SidebarTrigger className='group-data-[collapsible=icon]:mx-auto' />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
