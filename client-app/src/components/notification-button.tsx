import { Link } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'

export function NotificationButton() {
  const { t } = useTranslation()
  const notifications = [
    {
      id: 1,
      title: 'New campaign created',
      description: 'Your campaign "Summer Sale" is now live',
      time: '5m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Link generator updated',
      description: 'New links have been generated successfully',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Page published',
      description: 'Landing page "Product Launch" is now published',
      time: '2h ago',
      unread: false,
    },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='relative scale-95 rounded-full'
        >
          <Bell className='size-[1.2rem]' />
          {unreadCount > 0 && (
            <Badge
              variant='destructive'
              className='absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center p-0 text-xs'
            >
              {unreadCount}
            </Badge>
          )}
          <span className='sr-only'>{t('common.notifications')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-80'>
        <DropdownMenuLabel className='flex items-center justify-between'>
          <span>{t('common.notifications')}</span>
          {unreadCount > 0 && (
            <Badge variant='secondary' className='ml-auto'>
              {unreadCount} {t('common.new')}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className='h-80'>
          {notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className='flex cursor-pointer flex-col items-start p-4'
            >
              <div className='flex w-full items-start justify-between gap-2'>
                <div className='flex-1'>
                  <p className='mb-1 text-sm leading-none font-medium'>
                    {notification.title}
                  </p>
                  <p className='text-muted-foreground text-sm'>
                    {notification.description}
                  </p>
                  <p className='text-muted-foreground mt-2 text-xs'>
                    {notification.time}
                  </p>
                </div>
                {notification.unread && (
                  <div className='mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600' />
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            to='/notifications'
            className='w-full cursor-pointer justify-center text-center'
          >
            {t('common.viewAll')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
