'use client'

import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
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
import { useUpdateComponent } from '../../api/commands'
import { categories, deviceTypes, status } from '../../data/data'
import { useComponents } from '../component-provider'

const getFormSchema = (t: (key: string) => string) =>
  z.object({
    categoryId: z.number().min(1, t('dialog.form.categoryRequired')),
    componentName: z.string().min(1, t('dialog.form.nameRequired')),
    componentCode: z.string().min(1, t('dialog.form.codeRequired')),
    statusId: z.number(),
    deviceId: z.number().optional(),
  })

export function ComponentUpdateDialog() {
  const { t } = useTranslation('component-management')
  const { open, setOpen, currentRow } = useComponents()
  const updateMutation = useUpdateComponent()

  const formSchema = getFormSchema(t)
  type ComponentForm = z.infer<typeof formSchema>

  const form = useForm<ComponentForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      categoryId: currentRow?.categoryId ?? 1,
      componentName: currentRow?.componentName ?? '',
      componentCode: currentRow?.componentCode ?? '',
      statusId: currentRow?.statusId ?? 1,
      deviceId: currentRow?.deviceId ?? undefined,
    },
  })

  const watchCategory = form.watch('categoryId')
  const isLandingPage = watchCategory === 6

  useEffect(() => {
    if (open === 'update' && currentRow) {
      form.reset({
        categoryId: currentRow.categoryId,
        componentName: currentRow.componentName,
        componentCode: currentRow.componentCode,
        statusId: currentRow.statusId,
        deviceId: currentRow.deviceId ?? undefined,
      })
    }
  }, [open, currentRow, form])

  useEffect(() => {
    if (isLandingPage) {
      if (!form.getValues('deviceId')) {
        form.setValue('deviceId', 1)
      }
    } else {
      form.setValue('deviceId', undefined)
    }
  }, [isLandingPage])

  const onSubmit = (values: ComponentForm) => {
    if (!currentRow?.componentId) return

    updateMutation.mutate(
      {
        id: currentRow.componentId,
        data: {
          componentId: currentRow.componentId,
          categoryId: values.categoryId,
          componentName: values.componentName,
          componentCode: values.componentCode,
          statusId: values.statusId,
          deviceId: isLandingPage ? values.deviceId : undefined,
        },
      },
      {
        onSuccess: (response) => {
          if (response.errorCode === 0) {
            form.reset()
            setOpen(null)
          }
        },
      }
    )
  }

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
          <DialogTitle>{t('updateDialog.title')}</DialogTitle>
          <DialogDescription>{t('updateDialog.description')}</DialogDescription>
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
                      {t('dialog.form.category')}
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                      placeholder={t('dialog.form.categoryPlaceholder')}
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
                      {t('dialog.form.name')}{' '}
                      <span className='text-destructive'>
                        {t('dialog.form.requiredField')}
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('dialog.form.namePlaceholder')}
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
                    <FormLabel className='col-span-2 text-end'>
                      {t('dialog.form.code')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t('dialog.form.codePlaceholder')}
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
                      {t('dialog.form.status')}
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                      placeholder={t('dialog.form.statusPlaceholder')}
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
                  name='deviceId'
                  render={({ field }) => (
                    <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                      <FormLabel className='col-span-2 text-end'>
                        {t('dialog.form.device')}
                      </FormLabel>
                      <SelectDropdown
                        defaultValue={field.value ? String(field.value) : '1'}
                        onValueChange={(value) => field.onChange(Number(value))}
                        placeholder={t('dialog.form.devicePlaceholder')}
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
            disabled={!form.formState.isValid || updateMutation.isPending}
          >
            {t('dialog.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
