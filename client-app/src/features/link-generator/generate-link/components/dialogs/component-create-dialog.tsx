import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { COMPONENT_CONFIG, type ComponentType } from '../../data/data'
import { componentCreateFormSchema, type ComponentCreateForm } from '../../data/schema'
import { useGenerateLink } from '../generate-link-provider'

type ComponentCreateDialogProps = {
  componentType: ComponentType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ComponentCreateDialog({
  componentType,
  open,
  onOpenChange,
}: ComponentCreateDialogProps) {
  const config = COMPONENT_CONFIG[componentType]
  const title = `Create New ${config.label}`
  const createButtonLabel = `Create ${config.label}`
  const { form: generateLinkForm } = useGenerateLink()
  const createMutation = useCreateComponent()

  const { data: statusData, isLoading: isLoadingStatus } = useGetStatusOptions()
  const statusOptions = statusData?.data || []

  const form = useForm<ComponentCreateForm>({
    resolver: zodResolver(componentCreateFormSchema),
    mode: 'onChange',
    defaultValues: {
      componentName: '',
      componentCode: '',
      statusId: 1,
    },
  })

  const watchName = form.watch('componentName')

  useEffect(() => {
    const generatedCode = watchName ? watchName.trim().replace(/\s+/g, '-') : ''
    form.setValue('componentCode', generatedCode)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchName])

  const onSubmit = (values: ComponentCreateForm) => {
    createMutation.mutate(
      {
        categoryId: config.categoryId,
        componentName: values.componentName,
        componentCode: values.componentCode,
        statusId: values.statusId,
      },
      {
        onSuccess: (response) => {
          if (values.statusId === 1 && response.errorCode === 0 && response.data && typeof response.data === 'object' && 'componentId' in response.data) {
            const componentData = response.data as { componentId: number }
            const component = {
              componentId: componentData.componentId,
              componentCode: values.componentCode,
              componentName: values.componentName
            }

            if (componentType === 'event') {
              const currentEvents = generateLinkForm.getValues('event') || ''
              const eventIds = currentEvents ? currentEvents.split(',').filter(Boolean) : []
              if (!eventIds.includes(String(component.componentId))) {
                eventIds.push(String(component.componentId))
                generateLinkForm.setValue('event', eventIds.join(','))

                const currentCodes = generateLinkForm.getValues('eventCodes') || ''
                const eventCodes = currentCodes ? currentCodes.split(',').filter(Boolean) : []
                if (!eventCodes.includes(component.componentCode)) {
                  eventCodes.push(component.componentCode)
                  generateLinkForm.setValue('eventCodes', eventCodes.join(','))
                }
              }
            } else {
              switch (componentType) {
                case 'group':
                  generateLinkForm.setValue('group', String(component.componentId))
                  generateLinkForm.setValue('groupCode', component.componentCode)
                  break
                case 'channel':
                  generateLinkForm.setValue('channel', String(component.componentId))
                  generateLinkForm.setValue('channelCode', component.componentCode)
                  break
                case 'agency':
                  generateLinkForm.setValue('agency', String(component.componentId))
                  generateLinkForm.setValue('agencyCode', component.componentCode)
                  break
                case 'type':
                  generateLinkForm.setValue('type', String(component.componentId))
                  generateLinkForm.setValue('typeCode', component.componentCode)
                  break
              }
            }
          }
          form.reset()
          onOpenChange(false)
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
                      Name <span className='text-destructive'>*</span>
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
                    <FormLabel className='col-span-2 text-end'>
                      Status
                    </FormLabel>
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
