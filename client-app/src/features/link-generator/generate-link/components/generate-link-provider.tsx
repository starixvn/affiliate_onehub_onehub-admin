import React from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetLinkGeneratorOptions } from '../api/queries'
import { generateLinkFormSchema, type GenerateLinkFormValues } from '../data/schema'
import type { LinkGeneratorOptions } from '../types'
import useDialogState from '@/hooks/use-dialog-state'

export type DialogType = 'campaign' | 'group' | 'channel' | 'type' | 'agency' | 'event'

type GenerateLinkContextType = {
  form: UseFormReturn<GenerateLinkFormValues>
  options: LinkGeneratorOptions | undefined
  isLoading: boolean
  isError: boolean
  dialogOpen: DialogType | null
  setDialogOpen: (type: DialogType | null) => void
}

const GenerateLinkContext = React.createContext<GenerateLinkContextType | null>(null)

type GenerateLinkProviderProps = {
  children: React.ReactNode
}

export function GenerateLinkProvider({ children }: GenerateLinkProviderProps) {
  const { data: options, isLoading, isError } = useGetLinkGeneratorOptions()
  const [dialogOpen, setDialogOpen] = useDialogState<DialogType>(null)

  const form = useForm<GenerateLinkFormValues>({
    resolver: zodResolver(generateLinkFormSchema),
    defaultValues: {
      linkName: '',
      identifierCode: '',
      campaign: '',
      country: '',
      language: '',
      group: '',
      event: '',
      domainName: '',
      domainReservedNote: '',
      shortLinkName: '',
      shortLinkValue: '',
      channel: '',
      type: '',
      agency: '',
      landingPage: '',
      note: '',
    },
  })

  return (
    <GenerateLinkContext
      value={{
        form,
        options,
        isLoading,
        isError,
        dialogOpen,
        setDialogOpen,
      }}
    >
      {children}
    </GenerateLinkContext>
  )
}

export const useGenerateLink = () => {
  const context = React.useContext(GenerateLinkContext)

  if (!context) {
    throw new Error('useGenerateLink has to be used within <GenerateLinkProvider>')
  }

  return context
}

