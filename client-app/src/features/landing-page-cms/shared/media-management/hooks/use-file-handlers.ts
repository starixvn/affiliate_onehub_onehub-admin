import type {
  ModuleWithFiles,
  FormWithFiles,
  FormFile,
  ValidationErrors,
  TouchedFields,
} from '../schema'
import { resetFileErrors } from '../schema'

interface ModuleFileHandlersProps {
  mode: 'modules'
  isEdit: boolean
  fileGroups: ModuleWithFiles<File>[]
  setFileGroups: React.Dispatch<React.SetStateAction<ModuleWithFiles<File>[]>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  setFileName: React.Dispatch<React.SetStateAction<string>>
  setExpandedModules?: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >
}

interface FormFileHandlersProps {
  mode: 'formNames'
  isEdit: boolean
  fileGroups: FormWithFiles<FormFile>
  setFileGroups: React.Dispatch<React.SetStateAction<FormWithFiles<FormFile>>>
  setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>
  touched: TouchedFields
  setTouched: React.Dispatch<React.SetStateAction<TouchedFields>>
  resetTouchedForFormNames: (fileCount: number) => void
  createFormFile?: (file: File) => FormFile
}

type UseFileHandlersProps = ModuleFileHandlersProps | FormFileHandlersProps

export function useFileHandlers(props: UseFileHandlersProps) {
  const { isEdit, fileGroups, setFileGroups, setErrors, mode } = props

  const getFilesFromGroup = (groupIndex: number): File[] => {
    if (mode === 'modules') {
      return (fileGroups as ModuleWithFiles<File>[])[groupIndex]?.files || []
    }
    return (fileGroups as FormWithFiles<FormFile>).files.map((f) => f.file)
  }

  const updateFilesInModules = (
    groupIndex: number,
    updater: (files: File[]) => File[]
  ) => {
    const moduleGroups = fileGroups as ModuleWithFiles<File>[]
    const moduleSetFileGroups = setFileGroups as React.Dispatch<
      React.SetStateAction<ModuleWithFiles<File>[]>
    >
    moduleSetFileGroups(
      moduleGroups.map((group, i) =>
        i === groupIndex ? { ...group, files: updater(group.files) } : group
      )
    )
  }

  const updateFilesInForm = (updater: (files: FormFile[]) => FormFile[]) => {
    const formGroup = fileGroups as FormWithFiles<FormFile>
    const formSetFileGroups = setFileGroups as React.Dispatch<
      React.SetStateAction<FormWithFiles<FormFile>>
    >
    formSetFileGroups({
      ...formGroup,
      files: updater(formGroup.files),
    })
  }

  const handleFileChange = (groupIndex: number, files: FileList | null) => {
    if (files && files.length > 0) {
      resetFileErrors(setErrors)

      if (isEdit) {
        if (mode === 'modules') {
          const newFile = files[0]
          updateFilesInModules(groupIndex, () => [newFile])

          const moduleProps = props as ModuleFileHandlersProps
          moduleProps.setFileName(newFile.name)
        } else {
          const formProps = props as FormFileHandlersProps
          const newFile = formProps.createFormFile?.(files[0]) || {
            file: files[0],
            formName: files[0].name.replace(/\.[^/.]+$/, ''),
            fileName: files[0].name,
          }
          updateFilesInForm(() => [newFile])
          formProps.resetTouchedForFormNames(1)
        }
      } else {
        const uploadedFiles = Array.from(files)

        if (uploadedFiles.length > 0) {
          if (mode === 'modules') {
            updateFilesInModules(groupIndex, (existing) => {
              const merged = [...existing]
              uploadedFiles.forEach((uploadedFile) => {
                const existingIndex = merged.findIndex(
                  (existingFile) => existingFile.name === uploadedFile.name
                )
                if (existingIndex >= 0) {
                  merged[existingIndex] = uploadedFile
                } else {
                  merged.push(uploadedFile)
                }
              })
              return merged
            })
          } else {
            const formProps = props as FormFileHandlersProps
            updateFilesInForm((existing) => {
              const merged = [...existing]
              uploadedFiles.forEach((uploadedFile) => {
                const newFormFile = formProps.createFormFile?.(
                  uploadedFile
                ) || {
                  file: uploadedFile,
                  formName: uploadedFile.name.replace(/\.[^/.]+$/, ''),
                  fileName: uploadedFile.name,
                }

                const existingIndex = merged.findIndex(
                  (existingFile) => existingFile.fileName === uploadedFile.name
                )
                if (existingIndex >= 0) {
                  merged[existingIndex] = newFormFile
                } else {
                  merged.push(newFormFile)
                }
              })
              return merged
            })
            formProps.resetTouchedForFormNames(
              getFilesFromGroup(groupIndex).length
            )
          }
        }
      }
    }
  }

  const handleToggleExpanded = (groupIndex: number) => {
    if (mode === 'modules') {
      const moduleProps = props as ModuleFileHandlersProps
      moduleProps.setExpandedModules?.((prev) => ({
        ...prev,
        [groupIndex]: !prev[groupIndex],
      }))
    }
  }

  const handleRemoveFile = (groupIndex: number, fileIndex: number) => {
    if (mode === 'modules') {
      updateFilesInModules(groupIndex, (files) =>
        files.filter((_, fi) => fi !== fileIndex)
      )
    } else {
      updateFilesInForm((files) => files.filter((_, fi) => fi !== fileIndex))

      const formProps = props as FormFileHandlersProps
      formProps.setTouched((prev) => {
        const newFormNames = { ...(prev.formNames || {}) }
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
    }

    resetFileErrors(setErrors)
  }

  const handleFormNameChange = (fileIndex: number, value: string) => {
    if (mode === 'formNames') {
      updateFilesInForm((files) =>
        files.map((file, i) =>
          i === fileIndex ? { ...file, formName: value } : file
        )
      )
    }
  }

  const handleFormNameBlur = (
    fileIndex: number,
    validateField?: (
      field: string,
      value: string,
      setErrors: React.Dispatch<React.SetStateAction<ValidationErrors>>,
      errorMessages: any,
      index?: number
    ) => void
  ) => {
    if (mode === 'formNames') {
      const formProps = props as FormFileHandlersProps
      if (!formProps.touched.formNames?.[fileIndex]) {
        formProps.setTouched((prev) => ({
          ...prev,
          formNames: { ...prev.formNames, [fileIndex]: true },
        }))

        const formGroup = fileGroups as FormWithFiles<FormFile>
        const fileItem = formGroup.files[fileIndex]
        if (validateField) {
          validateField('formName', fileItem.formName, setErrors, {}, fileIndex)
        }
      }
    }
  }

  return {
    handleFileChange,
    handleToggleExpanded,
    handleRemoveFile,
    ...(mode === 'formNames' && {
      handleFormNameChange,
      handleFormNameBlur,
    }),
  }
}
