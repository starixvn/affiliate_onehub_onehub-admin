type FormFieldErrorProps = {
  message?: string
}

export function FormFieldError({ message }: FormFieldErrorProps) {
  return (
    <p className='text-destructive mt-0.5 min-h-[0.75rem] text-xs leading-tight'>
      {message || '\u00A0'}
    </p>
  )
}
