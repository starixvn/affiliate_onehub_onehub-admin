import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateComponent } from '../../api/commands'
import { useGetStatusOptions } from '../../api/queries'

type ComponentType = 'event' | 'group' | 'channel' | 'agency' | 'type'

const COMPONENT_CONFIG: Record<
  ComponentType,
  {
    label: string
    componentTypeId: number
  }
> = {
  event: { label: 'Event', componentTypeId: 1 },
  group: { label: 'Group', componentTypeId: 2 },
  channel: { label: 'Channel', componentTypeId: 3 },
  agency: { label: 'Agency', componentTypeId: 4 },
  type: { label: 'Type', componentTypeId: 5 },
}

const formSchema = z.object({
  componentName: z.string().min(1, 'Name is required'),
  componentCode: z.string(),
  statusId: z.number(),
})

type ComponentForm = z.infer<typeof formSchema>

type AddComponentDialogProps = {
  componentType: ComponentType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddComponentDialog({
  componentType,
  open,
  onOpenChange,
}: AddComponentDialogProps) {
  const config = COMPONENT_CONFIG[componentType]
  const title = `Create New ${config.label}`
  const createButtonLabel = `Create ${config.label}`
  const createMutation = useCreateComponent()

  const { data: statusData, isLoading: isLoadingStatus } = useGetStatusOptions()
  const statusOptions = statusData?.data || []

  const form = useForm<ComponentForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      componentName: '',
      componentCode: '',
      statusId: 1,
    },
  })

  const componentName = form.watch('componentName')

  useEffect(() => {
    if (componentName) {
      const generatedCode = componentName
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
      form.setValue('componentCode', generatedCode)
    } else {
      form.setValue('componentCode', '')
    }
  }, [componentName, form])

  const onSubmit = (values: ComponentForm) => {
    createMutation.mutate(
      {
        componentTypeId: config.componentTypeId,
        componentName: values.componentName,
        componentCode: values.componentCode,
        statusId: values.statusId,
      },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            form.reset()
            onOpenChange(false)
          }
        },
      }
    )
  }

  const isFormValid = form.formState.isValid

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Add a new {config.label.toLowerCase()} to your link generator
            options.
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='add-component-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='componentName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Name{' '}
                      <span className='text-destructive'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter ${config.label.toLowerCase()} name`}
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='componentCode'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Auto-generated code'
                        className='col-span-4'
                        autoComplete='off'
                        disabled
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='statusId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Status</FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                      placeholder={
                        isLoadingStatus ? 'Loading...' : 'Select status'
                      }
                      className='col-span-4'
                      disabled={isLoadingStatus}
                      items={statusOptions.map(({ label, value }) => ({
                        label,
                        value: String(value),
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => {
              form.reset()
              onOpenChange(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            form='add-component-form'
            disabled={!isFormValid || createMutation.isPending}
          >
            {createButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

