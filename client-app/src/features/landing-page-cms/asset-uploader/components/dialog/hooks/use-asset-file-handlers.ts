import type { ModuleWithFiles } from '../../../data/schema'
import { resetFileErrors } from '../../../data/validation'

interface UseAssetFileHandlersProps {
  moduleRows: ModuleWithFiles[]
  isEdit: boolean
  setModuleRows: React.Dispatch<React.SetStateAction<ModuleWithFiles[]>>
  setFileName: React.Dispatch<React.SetStateAction<string>>
  setErrors: React.Dispatch<React.SetStateAction<any>>
  setExpandedModules: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >
}

export function useAssetFileHandlers({
  moduleRows,
  isEdit,
  setModuleRows,
  setFileName,
  setErrors,
  setExpandedModules,
}: UseAssetFileHandlersProps) {
  const handleEditFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      resetFileErrors(setErrors)
      const newFile = files[0]
      setModuleRows((prev) =>
        prev.map((row, i) => (i === 0 ? { ...row, files: [newFile] } : row))
      )
      setFileName(newFile.name)
    }
  }

  const handleFileChange = (moduleIndex: number, files: FileList | null) => {
    if (files && files.length > 0) {
      resetFileErrors(setErrors)

      if (isEdit) {
        const newFile = files[0]
        setModuleRows((prev) =>
          prev.map((row, i) =>
            i === moduleIndex ? { ...row, files: [newFile] } : row
          )
        )
        setFileName(newFile.name)
      } else {
        const newFiles = Array.from(files)

        const existingFileNames = moduleRows[moduleIndex].files.map(
          (f) => f.name
        )
        const filteredNewFiles = newFiles.filter(
          (newFile) => !existingFileNames.includes(newFile.name)
        )

        if (filteredNewFiles.length > 0) {
          setModuleRows((prev) =>
            prev.map((row, i) =>
              i === moduleIndex
                ? { ...row, files: [...row.files, ...filteredNewFiles] }
                : row
            )
          )

          if (moduleIndex === 0) {
            setFileName(filteredNewFiles[0].name)
          }
        }
      }
    }
  }

  const handleToggleExpanded = (moduleIndex: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex],
    }))
  }

  const handleRemoveFile = (moduleIndex: number, fileIndex: number) => {
    setModuleRows((prev) =>
      prev.map((row, i) =>
        i === moduleIndex
          ? { ...row, files: row.files.filter((_, fi) => fi !== fileIndex) }
          : row
      )
    )
  }

  return {
    handleEditFileChange,
    handleFileChange,
    handleToggleExpanded,
    handleRemoveFile,
  }
}
