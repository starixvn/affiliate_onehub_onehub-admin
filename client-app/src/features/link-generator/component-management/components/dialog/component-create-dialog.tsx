'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
import { useComponents } from '../component-provider'
import { categories, deviceTypes, status } from '../../data/data'

const formSchema = z.object({
  categoryId: z.number().min(1, 'Component Category is required'),
  componentName: z.string().min(1, 'Name is required'),
  componentCode: z.string().min(1, 'Code is required'),
  statusId: z.number(),
  deviceType: z.string().optional(),
})

type ComponentForm = z.infer<typeof formSchema>

export function ComponentCreateDialog() {
  const { open, setOpen, selectedCategory } = useComponents()

  const form = useForm<ComponentForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      categoryId: Number(selectedCategory),
      componentName: '',
      componentCode: '',
      statusId: 1,
      deviceType: 'mobile',
    },
  })

  const watchCategory = form.watch('categoryId')
  const watchName = form.watch('componentName')

  useEffect(() => {
    if (watchName) {
      const generatedCode = watchName.trim().replace(/\s+/g, '_')
      form.setValue('componentCode', generatedCode)
    }
  }, [watchName, form])

  useEffect(() => {
    if (open === 'create') {
      form.reset({
        categoryId: Number(selectedCategory),
        componentName: '',
        componentCode: '',
        statusId: 1,
        deviceType: 'mobile',
      })
    }
  }, [open, selectedCategory, form])

  const onSubmit = () => {
    toast.success('Component created successfully')
    form.reset()
    setOpen(null)
  }

  const isLandingPage = watchCategory === 6

  return (
    <Dialog
      open={open === 'create'}
      onOpenChange={(state) => {
        form.reset()
        setOpen(state ? 'create' : null)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>Create New Component</DialogTitle>
          <DialogDescription>
            Create a new component with a code auto-generated from the name. The
            code will appear in the generated link and cannot be changed once
            created.
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='component-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 whitespace-nowrap text-end'>
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
                    <FormLabel className='col-span-2 text-end'>Status</FormLabel>
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
                  name='deviceType'
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
            form='component-form'
            disabled={!form.formState.isValid}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
