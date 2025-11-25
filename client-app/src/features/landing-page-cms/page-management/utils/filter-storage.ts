const STORAGE_KEY = 'page-management-filters'

export interface SavedFilters {
  search?: string
  status?: string
  countryCode?: string
  languageCode?: string
  fromDate?: string
  toDate?: string
  pageIndex?: number
  pageSize?: number
}

export function savePageManagementFilters(filters: SavedFilters): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
  } catch (error) {
    console.error('Failed to save filters:', error)
  }
}

export function loadPageManagementFilters(): SavedFilters | null {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved) {
      sessionStorage.removeItem(STORAGE_KEY)
      return JSON.parse(saved)
    }
    return null
  } catch (error) {
    console.error('Failed to load filters:', error)
    return null
  }
}

export function clearPageManagementFilters(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear filters:', error)
  }
}
