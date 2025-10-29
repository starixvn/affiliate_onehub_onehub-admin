export function getLocalStorageItem(key: string): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(key)
}

export function setLocalStorageItem(key: string, value: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, value)
}

export function removeLocalStorageItem(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

export function clearLocalStorage(): void {
  if (typeof window === 'undefined') return
  localStorage.clear()
}
