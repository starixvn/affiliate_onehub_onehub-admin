'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
import { categories, deviceTypes, status } from '../../data/data'
import { useComponents } from '../component-provider'

const formSchema = z.object({
  categoryId: z.number().min(1, 'Component Category is required'),
  componentName: z.string().min(1, 'Name is required'),
  componentCode: z.string().min(1, 'Code is required'),
  statusId: z.number(),
  deviceIds: z.string().optional(),
})

type ComponentForm = z.infer<typeof formSchema>

export function ComponentUpdateDialog() {
  const { open, setOpen, currentRow } = useComponents()

  const form = useForm<ComponentForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      categoryId: currentRow?.categoryId ?? 1,
      componentName: currentRow?.componentName ?? '',
      componentCode: currentRow?.componentCode ?? '',
      statusId: currentRow?.statusId ?? 1,
      deviceIds: currentRow?.deviceIds ?? 'mobile',
    },
  })

  const watchCategory = form.watch('categoryId')

  useEffect(() => {
    if (open === 'update' && currentRow) {
      form.reset({
        categoryId: currentRow.categoryId,
        componentName: currentRow.componentName,
        componentCode: currentRow.componentCode,
        statusId: currentRow.statusId,
        deviceIds: currentRow.deviceIds ?? 'mobile',
      })
    }
  }, [open, currentRow, form])

  const onSubmit = () => {
    toast.success('Component updated successfully')
    form.reset()
    setOpen(null)
  }

  const isLandingPage = watchCategory === 6

  return (
    <Dialog
      open={open === 'update'}
      onOpenChange={(state) => {
        form.reset()
        setOpen(state ? 'update' : null)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Edit Component</DialogTitle>
          <DialogDescription>
            Update the component information. The code cannot be changed once
            created.
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='component-update-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end whitespace-nowrap'>
                      Component Category
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                      placeholder='Select category'
                      className='col-span-4'
                      items={categories}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
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
                        placeholder='e.g., Lucky Draw'
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
                        placeholder='e.g., Lucky_Draw'
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
                      placeholder='Select status'
                      className='col-span-4'
                      items={status.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {isLandingPage && (
                <FormField
                  control={form.control}
                  name='deviceIds'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        Device
                      </FormLabel>
                      <SelectDropdown
                        defaultValue={field.value}
                        onValueChange={field.onChange}
                        placeholder='Select device'
                        className='col-span-4'
                        items={deviceTypes}
                      />
                      <FormMessage className='col-span-4 col-start-3' />
                    </FormItem>
                  )}
                />
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='component-update-form'
            disabled={!form.formState.isValid}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
