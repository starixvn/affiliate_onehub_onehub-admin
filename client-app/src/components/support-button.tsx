import { Link } from '@tanstack/react-router'
import { HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function SupportButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='scale-95 rounded-full'
            asChild
          >
            <Link to='/help-center'>
              <HelpCircle className='size-[1.2rem]' />
              <span className='sr-only'>Support</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Support</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
