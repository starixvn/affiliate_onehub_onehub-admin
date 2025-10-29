import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardHeader, CardTitle, CardAction, CardContent } from './card'

const statusFilterCardVariants = cva('transition-all duration-200', {
  variants: {
    variant: {
      default: '',
      rainbow:
        'hover:border-transparent hover:bg-gradient-to-r hover:from-red-500/10 hover:via-purple-500/10 hover:to-blue-500/10',
      success: 'hover:border-green-500/50',
      warning: 'hover:border-orange-500/50',
      info: 'hover:border-blue-500/50',
      danger: 'hover:border-red-500/50',
      secondary: 'hover:border-gray-500/50',
    },
    selected: {
      true: 'ring-1',
      false: '',
    },
  },
  compoundVariants: [
    {
      variant: 'default',
      selected: true,
      className:
        'bg-primary/5 border-primary ring-primary/20 dark:bg-primary/10',
    },
    {
      variant: 'rainbow',
      selected: true,
      className:
        'bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-blue-500/10 dark:from-red-500/20 dark:via-yellow-500/20 dark:to-blue-500/20 border-transparent ring-purple-500/30',
    },
    {
      variant: 'success',
      selected: true,
      className:
        'bg-green-50 dark:bg-green-950/30 border-green-500 ring-green-500/20',
    },
    {
      variant: 'warning',
      selected: true,
      className:
        'bg-orange-50 dark:bg-orange-950/30 border-orange-500 ring-orange-500/20',
    },
    {
      variant: 'info',
      selected: true,
      className:
        'bg-blue-50 dark:bg-blue-950/30 border-blue-500 ring-blue-500/20',
    },
    {
      variant: 'danger',
      selected: true,
      className: 'bg-red-50 dark:bg-red-950/30 border-red-500 ring-red-500/20',
    },
    {
      variant: 'secondary',
      selected: true,
      className:
        'bg-gray-50 dark:bg-gray-950/30 border-gray-500 ring-gray-500/20',
    },
  ],
  defaultVariants: {
    variant: 'default',
    selected: false,
  },
})

const iconVariants = cva(
  'flex h-7 w-7 items-center justify-center rounded-lg transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        rainbow:
          'bg-gradient-to-br from-red-500/20 via-purple-500/20 to-blue-500/20 text-purple-600 dark:text-purple-400',
        success: 'bg-green-500/10 text-green-600 dark:text-green-500',
        warning: 'bg-orange-500/10 text-orange-600 dark:text-orange-500',
        info: 'bg-blue-500/10 text-blue-600 dark:text-blue-500',
        danger: 'bg-red-500/10 text-red-600 dark:text-red-500',
        secondary: 'bg-gray-500/10 text-gray-600 dark:text-gray-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface StatusFilterCardProps
  extends React.ComponentProps<typeof Card>,
    VariantProps<typeof statusFilterCardVariants> {
  title: string
  count: number | string
  icon: LucideIcon
  selected?: boolean
  onClick?: () => void
}

function StatusFilterCard({
  title,
  count,
  icon: Icon,
  variant,
  selected,
  onClick,
  className,
  ...props
}: StatusFilterCardProps) {
  return (
    <Card
      className={cn(
        'gap-0.5 py-2',
        statusFilterCardVariants({ variant, selected }),
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
      {...props}
    >
      <CardHeader className='pb-0'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>
          {title}
        </CardTitle>
        <CardAction>
          <div className={cn(iconVariants({ variant }))}>
            <Icon className='h-3.5 w-3.5' />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className='pb-0'>
        <div className='text-lg font-bold'>{count}</div>
      </CardContent>
    </Card>
  )
}

export { StatusFilterCard, statusFilterCardVariants, iconVariants }
export type { StatusFilterCardProps }
