import { useFileHandlers } from '@/features/landing-page-cms/shared'
import type {
  FormWithFiles,
  FormFile,
  TouchedFields,
} from '@/features/landing-page-cms/shared'
import type { ValidationErrors } from '../../../data/schema'
import {
  validateRegistrationFormField,
  useErrorMessages,
} from '../../../data/validation'

interface UseRegisterFormFileHandlersProps {
  isEdit: boolean
  formWithFiles: FormWithFiles
  touched: TouchedFields
  setFormWithFiles: React.Dispatch<React.SetStateAction<FormWithFiles>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  resetTouchedForFormNames: (fileCount: number) => void
}

export function useRegisterFormFileHandlers({
  isEdit,
  formWithFiles,
  touched,
  setFormWithFiles,
  setErrors,
  setTouched,
  resetTouchedForFormNames,
}: UseRegisterFormFileHandlersProps) {
  const errorMessages = useErrorMessages()

  const createFormFile = (file: File): FormFile => ({
    file,
    formName: file.name.replace(/\.[^/.]+$/, ''),
    fileName: file.name,
  })

  const fileHandlers = useFileHandlers({
    mode: 'formNames',
    isEdit,
    fileGroups: formWithFiles,
    setFileGroups: setFormWithFiles,
    setErrors,
    touched,
    setTouched,
    resetTouchedForFormNames,
    createFormFile,
  })

  const handleFormNameChange = (index: number, value: string) => {
    fileHandlers.handleFormNameChange?.(index, value)
    validateRegistrationFormField(
      'formName',
      value,
      setErrors,
      errorMessages,
      index
    )
  }

  const handleFormNameBlur = (index: number) => {
    fileHandlers.handleFormNameBlur?.(
      index,
      (
        field: string,
        value: string,
        setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
        errorMessages: any,
        index?: number
      ) =>
        validateRegistrationFormField(
          field,
          value,
          setErrors,
          errorMessages,
          index
        )
    )
  }

  return {
    handleFileChange: (files: FileList | null) =>
      fileHandlers.handleFileChange(0, files),
    handleFormNameChange,
    handleFormNameBlur,
    handleRemoveFile: (fileIndex: number) =>
      fileHandlers.handleRemoveFile(0, fileIndex),
  }
}
