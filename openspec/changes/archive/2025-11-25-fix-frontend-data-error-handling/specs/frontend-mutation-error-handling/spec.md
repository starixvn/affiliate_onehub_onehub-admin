# Frontend Mutation Error Handling

## ADDED Requirements

### Requirement: Mutation hooks MUST validate response errorCode before treating as success

Mutation hooks MUST check `response.errorCode === 0` in `onSuccess` callback before invalidating queries or showing success notifications. Business errors (`errorCode !== 0`) MUST be handled separately from HTTP-level errors.

#### Scenario: useDeleteLandingPage checks errorCode in onSuccess

```typescript
// client-app/src/features/landing-page-cms/page-management/api/commands.ts
export function useDeleteLandingPage(onError?: (error: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => landingPageApi.deleteLandingPage(id),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        // True success - invalidate queries and show success toast
        queryClient.invalidateQueries({ queryKey: landingPageKeys.lists() })
        queryClient.invalidateQueries({ queryKey: landingPageKeys.summary() })
        toast.success('Landing page deleted successfully')
      } else {
        // Business error - show error message
        const errorMessage = response.errorMessage || 'Failed to delete landing page'
        onError?.(errorMessage)
        if (!onError) {
          toast.error(errorMessage)
        }
      }
    },
  })
}
```

**Given** backend returns `{ errorCode: 1, errorMessage: "Page is in use", data: null }`
**When** mutation completes with HTTP 200
**Then** `onSuccess` callback receives response
**And** `response.errorCode !== 0` is detected
**And** queries are NOT invalidated
**And** error toast is shown with backend error message
**And** success toast is NOT shown

#### Scenario: Mutation hook accepts optional onError callback

```typescript
// Usage in component
const deleteMutation = useDeleteLandingPage((error) => {
  // Custom error handling in component
  console.error('Delete failed:', error)
  setDialogOpen(false)
})
```

**Given** component needs custom error handling
**When** mutation hook is called with onError callback
**Then** callback is invoked when `errorCode !== 0`
**And** backend error message is passed to callback
**And** component can implement custom error behavior

#### Scenario: Mutation hook falls back to toast when no callback provided

```typescript
// Usage without callback
const deleteMutation = useDeleteLandingPage()
```

**Given** mutation hook is called without onError callback
**When** mutation returns `errorCode !== 0`
**Then** error message is shown via toast.error()
**And** user sees backend error message
**And** no custom component logic is needed

### Requirement: Batch delete mutation MUST validate errorCode

Batch operations MUST follow same errorCode validation pattern as single operations.

#### Scenario: useDeleteBatchLandingPages checks errorCode

```typescript
export function useDeleteBatchLandingPages(onError?: (error: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: DeleteBatchLandingPageRequest) =>
      landingPageApi.deleteBatchLandingPages(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: landingPageKeys.lists() })
        queryClient.invalidateQueries({ queryKey: landingPageKeys.summary() })
        toast.success('Landing pages deleted successfully')
      } else {
        const errorMessage = response.errorMessage || 'Failed to delete landing pages'
        onError?.(errorMessage)
        if (!onError) {
          toast.error(errorMessage)
        }
      }
    },
  })
}
```

**Given** batch delete of 5 pages where 1 page is in use
**When** backend returns `errorCode !== 0`
**Then** operation is treated as error
**And** no pages are deleted (transactional behavior)
**And** specific error message is shown to user

### Requirement: Status update mutation MUST validate errorCode

Status change operations MUST validate errorCode to prevent false success indicators.

#### Scenario: useUpdateBatchLandingPageStatus checks errorCode

```typescript
export function useUpdateBatchLandingPageStatus(onError?: (error: string) => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateBatchLandingPageStatusRequest) =>
      landingPageApi.updateBatchLandingPageStatus(data),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: landingPageKeys.lists() })
        queryClient.invalidateQueries({ queryKey: landingPageKeys.summary() })
        toast.success('Landing page status updated successfully')
      } else {
        const errorMessage = response.errorMessage || 'Failed to update landing page status'
        onError?.(errorMessage)
        if (!onError) {
          toast.error(errorMessage)
        }
      }
    },
  })
}
```

**Given** status change from Active to Inactive is not allowed
**When** backend returns `{ errorCode: 2, errorMessage: "Cannot deactivate page with active campaigns" }`
**Then** error message is shown to user
**And** status change dialog remains open
**And** page list is not refreshed

### Requirement: Mutation error handling MUST align with asset-uploader pattern

Page management mutation hooks MUST follow the exact same pattern as asset-uploader and registration-form-management modules for consistency across the codebase.

#### Scenario: Error handling pattern matches asset-uploader

```typescript
// Pattern from asset-uploader/api/commands.ts
export const useDeleteMedias = (onError?: (error: string) => void) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (mediaIds: string) => assetUploaderApi.deleteMedias(mediaIds),
    onSuccess: (response) => {
      if (response.errorCode === 0) {
        queryClient.invalidateQueries({ queryKey: assetUploaderKeys.lists() })
        toast.success('Assets deleted successfully')
      } else {
        const errorMessage = response.errorMessage || 'Failed to delete asset'
        onError?.(errorMessage)
        if (!onError) {
          toast.error(errorMessage)
        }
      }
    },
  })
}

// Same pattern in page-management/api/commands.ts
export function useDeleteLandingPage(onError?: (error: string) => void) {
  // Identical structure
}
```

**Given** asset-uploader module has correct error handling pattern
**When** implementing page management mutation hooks
**Then** same pattern is used for consistency
**And** developers can recognize familiar pattern
**And** codebase maintains uniform error handling approach

## MODIFIED Requirements

None. This introduces new error handling requirements for mutation hooks.

## REMOVED Requirements

None. No existing requirements are being removed.
