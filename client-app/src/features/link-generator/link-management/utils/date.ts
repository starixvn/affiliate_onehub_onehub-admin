import { format, parse } from 'date-fns'

export const getDefaultStartDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

export const getDefaultEndDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const parseDateString = (dateStr: string | undefined): Date | undefined => {
  if (!dateStr) return undefined
  try {
    return parse(dateStr, 'yyyy-MM-dd', new Date())
  } catch {
    return undefined
  }
}

export const formatDateToString = (date: Date | undefined): string => {
  if (!date) return ''
  return format(date, 'yyyy-MM-dd')
}
