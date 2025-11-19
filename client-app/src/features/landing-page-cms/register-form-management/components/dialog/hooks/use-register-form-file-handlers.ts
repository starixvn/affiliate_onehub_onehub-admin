import type {
  FormWithFiles,
  FormFile,
  ValidationErrors,
  TouchedFields,
} from '../../../data/schema'
import { validateField, useErrorMessages } from '../../../data/validation'

interface UseRegisterFormFileHandlersProps {
  formWithFiles: FormWithFiles
  touched: TouchedFields
  setFormWithFiles: React.Dispatch<React.SetStateAction<FormWithFiles>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setTouched: React.Dispatch<
    React.SetStateAction<{
      country: boolean
      language: boolean
      formNames: { [key: number]: boolean }
    }>
  >
  resetTouchedForFormNames: (fileCount: number) => void
}

export function useRegisterFormFileHandlers({
  formWithFiles,
  touched,
  setFormWithFiles,
  setErrors,
  setTouched,
  resetTouchedForFormNames,
}: UseRegisterFormFileHandlersProps) {
  const errorMessages = useErrorMessages()
  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const existingFileNames = formWithFiles.files.map(
        (formFile) => formFile.file.name
      )

      const newFiles: FormFile[] = Array.from(files)
        .filter((file) => !existingFileNames.includes(file.name))
        .map((file) => ({
          file,
          formName: file.name.replace(/\.[^/.]+$/, ''),
          fileName: file.name,
        }))

      setFormWithFiles((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }))

      setErrors((prev) => ({ ...prev, files: undefined }))

      resetTouchedForFormNames(formWithFiles.files.length + newFiles.length)
    }
  }

  const handleFormNameChange = (index: number, value: string) => {
    setFormWithFiles((prev) => ({
      ...prev,
      files: prev.files.map((file, i) =>
        i === index ? { ...file, formName: value } : file
      ),
    }))

    validateField('formName', value, setErrors, errorMessages, index)
  }

  const handleFormNameBlur = (index: number) => {
    if (!touched.formNames[index]) {
      setTouched((prev) => ({
        ...prev,
        formNames: { ...prev.formNames, [index]: true },
      }))
      validateField(
        'formName',
        formWithFiles.files[index]?.formName || '',
        setErrors,
        errorMessages,
        index
      )
    }
  }

  const handleRemoveFile = (fileIndex: number) => {
    setFormWithFiles((prev) => ({
      ...prev,
      files: prev.files.filter((_, index) => index !== fileIndex),
    }))

    setTouched((prev) => {
      const newFormNames = { ...prev.formNames }
      delete newFormNames[fileIndex]

      const shiftedFormNames: { [key: number]: boolean } = {}
      Object.keys(newFormNames).forEach((key) => {
        const keyNum = parseInt(key)
        if (keyNum > fileIndex) {
          shiftedFormNames[keyNum - 1] = newFormNames[keyNum]
        } else {
          shiftedFormNames[keyNum] = newFormNames[keyNum]
        }
      })

      return {
        ...prev,
        formNames: shiftedFormNames,
      }
    })

    setErrors((prev) => ({ ...prev, files: undefined }))
  }

  return {
    handleFileChange,
    handleFormNameChange,
    handleFormNameBlur,
    handleRemoveFile,
  }
}
