import { useState } from 'react'
import type {
  RegisterFormDetail,
  FormWithFiles,
  TouchedFields,
} from '../../../data/schema'
import { INITIAL_VALIDATION_STATE } from '../../../data/validation'

export function useRegisterFormFormState(
  registerForm?: RegisterFormDetail | null
) {
  const [languageOptions, setLanguageOptions] = useState<
    Array<{ value: string; label: string }>
  >([])
  const [country, setCountry] = useState('')
  const [language, setLanguage] = useState('')
  const [formWithFiles, setFormWithFiles] = useState<FormWithFiles>({
    module: 'Registration Form',
    files: [],
  })
  const [errors, setErrors] = useState(INITIAL_VALIDATION_STATE.errors)
  const [touched, setTouched] = useState<TouchedFields>({
    ...INITIAL_VALIDATION_STATE.touched,
    formNames: INITIAL_VALIDATION_STATE.touched.formNames || {},
  })

  const isEdit = !!registerForm

  const resetForm = () => {
    setCountry('')
    setLanguage('')
    setLanguageOptions([])
    setFormWithFiles({ module: 'Registration Form', files: [] })
    setErrors(INITIAL_VALIDATION_STATE.errors)
    setTouched({
      ...INITIAL_VALIDATION_STATE.touched,
      formNames: INITIAL_VALIDATION_STATE.touched.formNames || {},
    })
  }

  const resetTouchedForFormNames = (fileCount: number) => {
    setTouched((prev: TouchedFields) => ({
      ...prev,
      formNames: Array.from({ length: fileCount }, () => false).reduce(
        (acc, _, index) => {
          acc[index] = false
          return acc
        },
        {} as { [key: number]: boolean }
      ),
    }))
  }

  return {
    isEdit,
    languageOptions,
    setLanguageOptions,
    country,
    setCountry,
    language,
    setLanguage,
    formWithFiles,
    setFormWithFiles,
    errors,
    setErrors,
    touched,
    setTouched,
    resetForm,
    resetTouchedForFormNames,
  }
}
