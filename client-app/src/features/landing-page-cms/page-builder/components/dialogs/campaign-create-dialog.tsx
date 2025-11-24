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
import { Textarea } from '@/components/ui/textarea'
import { SelectDropdown } from '@/components/select-dropdown'
import { useCreateCampaign } from '../../api/commands'
import { status } from '@/features/campaign-management/data/data'

const getFormSchema = (t: (key: string) => string) =>
  z.object({
    campaignName: z.string().trim().min(1, t('dialog.form.nameRequired')),
    description: z.string().max(500).optional(),
    statusId: z.number().optional(),
  })

type CampaignCreateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CampaignCreateDialog({
  open,
  onOpenChange,
}: CampaignCreateDialogProps) {
  const { t } = useTranslation('campaign-management')
  const formSchema = getFormSchema(t)
  type CampaignForm = z.infer<typeof formSchema>
  const createMutation = useCreateCampaign()
  const form = useForm<CampaignForm>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      campaignName: '',
      description: '',
      statusId: 0,
    },
  })

  const onSubmit = (values: CampaignForm) => {
    createMutation.mutate(
      {
        campaignName: values.campaignName,
        description: values.description || '',
        statusId: values.statusId ?? 0,
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
          <DialogTitle>{t('dialog.create.title')}</DialogTitle>
          <DialogDescription>
            {t('dialog.create.description')}
          </DialogDescription>
        </DialogHeader>
        <div className='w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='campaign-create-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='campaignName'
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
                name='description'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 pt-2 text-end'>
                      {t('dialog.form.description')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t('dialog.form.descriptionPlaceholder')}
                        className='col-span-4 min-h-24'
                        maxLength={500}
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
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='campaign-create-form'
            disabled={!isFormValid || createMutation.isPending}
          >
            {t('dialog.saveChanges')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

