type FormFieldErrorProps = {
  message?: string
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  if (!message) return null
  return (
    <p className='text-xs text-destructive mt-0.5 min-h-[0.75rem] leading-tight'>
      {message}
    </p>
  )
}
