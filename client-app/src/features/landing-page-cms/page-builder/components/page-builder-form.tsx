import { Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function PageBuilderForm() {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
      {/* ================= COLUMN 1: Create New Page ================= */}
      <div className='h-full rounded-lg border p-4 lg:col-span-3'>
        <div className='mb-4 flex items-center gap-2'>
          <h3 className='font-semibold'>Create New Page</h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className='text-muted-foreground h-4 w-4' />
            </TooltipTrigger>
            <TooltipContent>Page configuration details</TooltipContent>
          </Tooltip>
        </div>

        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>
              Page Name <span className='text-destructive'>*</span>
            </Label>
            <Input placeholder='e.g., New Year Promotion Page' />
          </div>

          <div className='space-y-2'>
            <Label>
              Page Code <span className='text-destructive'>*</span>
            </Label>
            <Input placeholder='e.g., LP-2025-NY' />
          </div>

          <div className='space-y-2'>
            <Label>Campaign</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select campaign' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='c1'>
                  CAM_20250922_1049 | Winston's Camp 06
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select country' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='my'>Malaysia</SelectItem>
                <SelectItem value='th'>Thailand</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Language</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select language' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='en'>English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Page Status</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='draft'>Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ================= COLUMN 2: Module Components ================= */}
      <div className='h-full rounded-lg border p-4 lg:col-span-6'>
        <h3 className='mb-4 font-semibold'>Module Components</h3>

        <div className='space-y-4'>
          {/* Header Row */}
          <div className='grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground'>
            <div className='col-span-1 text-center'>Order</div>
            <div className='col-span-4'>Module</div>
            <div className='col-span-4'>Source</div>
            <div className='col-span-3 text-center'>Action</div>
          </div>

          {/* Module Row 1 */}
          <div className='grid grid-cols-12 items-center gap-2'>
            <div className='col-span-1 flex justify-center'>
              <Badge variant='secondary' className='flex h-6 w-6 items-center justify-center rounded-sm p-0'>
                1
              </Badge>
            </div>
            <div className='col-span-4'>
              <div className='flex items-center gap-2'>
                <Select>
                  <SelectTrigger className='bg-muted/50'>
                    <SelectValue placeholder='Background' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='bg'>Background</SelectItem>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className='text-muted-foreground h-4 w-4' />
                  </TooltipTrigger>
                  <TooltipContent>Module info</TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className='col-span-4'>
              <Select>
                <SelectTrigger className='bg-muted/50'>
                  <SelectValue placeholder='Please select...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='src1'>Background_Thai.jpg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='col-span-3 flex justify-center gap-1'>
              <Button
                size='sm'
                variant='outline'
                className='h-8 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700'
              >
                + Add
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='h-8 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700'
              >
                - Remove
              </Button>
            </div>
          </div>

          {/* Module Row 2 (Example) */}
          <div className='grid grid-cols-12 items-center gap-2'>
            <div className='col-span-1 flex justify-center'>
              <Badge variant='secondary' className='flex h-6 w-6 items-center justify-center rounded-sm p-0'>
                2
              </Badge>
            </div>
            <div className='col-span-4'>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Logo & Sponsorship' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='logo'>Logo & Sponsorship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='col-span-4'>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder='Please select...' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='src2'>Logo_Sponsorship_Thai.jpg</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='col-span-3 flex justify-center gap-1'>
              <Button
                size='sm'
                variant='outline'
                className='h-8 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700'
              >
                + Add
              </Button>
              <Button
                size='sm'
                variant='outline'
                className='h-8 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700'
              >
                - Remove
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= COLUMN 3: Page Preview ================= */}
      <div className='h-full rounded-lg border p-4 lg:col-span-3'>
        <h3 className='mb-4 font-semibold'>Page Preview</h3>

        <div className='mb-4 flex gap-2'>
          <Button variant='outline' className='flex-1'>
            Preview Page
          </Button>
          <Button className='flex-1 bg-gray-900 text-white hover:bg-gray-800'>
            Create Page
          </Button>
          <Button variant='outline' size='icon'>
            <span className='sr-only'>Reset</span>
            ↺
          </Button>
        </div>

        <div className='mb-4 flex gap-2'>
          <Button variant='secondary' className='h-auto flex-col gap-1 bg-gray-600 p-2 text-xs text-white hover:bg-gray-700'>
            <span>Copy</span>
            <span>Link</span>
          </Button>
          <div className='bg-muted/30 flex-1 rounded border p-2 text-xs text-muted-foreground break-all'>
            https://landing.12zii.com/p1/mycs/MYR-2025-Nine?isPreview=true&pageId=290
          </div>
        </div>

        <div className='aspect-[9/16] w-full overflow-hidden rounded border bg-muted/10'>
          {/* Placeholder for Preview Image/Iframe */}
          <div className='flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground'>
            <div className='mb-2 text-4xl'>◫</div>
            <p className='text-xs'>
              Create a new page, then select components in order to start building.
            </p>
            <p className='mt-1 text-xs'>
              Reference the Best Practice tips for optimal layout.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

