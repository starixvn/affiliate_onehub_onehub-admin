import { useEffect } from 'react'
import { useWatch, type UseFormReturn } from 'react-hook-form'
import type { ComponentInfo } from '../../types'
import type { GenerateLinkFormValues } from '../../data/schema'

type UseEventFormatterParams = {
  form: UseFormReturn<GenerateLinkFormValues>
  events: ComponentInfo[] | undefined
}

export function useEventFormatter({ form, events }: UseEventFormatterParams) {
  const selectedEventIds = useWatch({ control: form.control, name: 'event' })

  useEffect(() => {
    if (selectedEventIds && events) {
      const eventIdArray = selectedEventIds.split(',').filter(Boolean)
      const eventCodesList = eventIdArray
        .map((id) => {
          const event = events.find(
            (e: ComponentInfo) => e.componentId === parseInt(id)
          )
          return event?.componentCode || ''
        })
        .filter(Boolean)
      form.setValue('eventCodes', eventCodesList.join(','))
    } else {
      form.setValue('eventCodes', '')
    }
  }, [selectedEventIds, events, form])
}

