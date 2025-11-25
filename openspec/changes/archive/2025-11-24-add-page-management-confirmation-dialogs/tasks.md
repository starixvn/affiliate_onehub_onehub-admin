# Tasks: Add Page Management Confirmation Dialogs

## Implementation Checklist

### Frontend - Dialog Components

- [x] Create `client-app/src/features/landing-page-cms/page-management/components/dialog/page-status-change-dialog.tsx`
  - Accept `open`, `onOpenChange`, `currentRow`, `newStatusId` props
  - Display page name, current status, and new status
  - Use `ConfirmDialog` component with Info icon
  - Call `useUpdateBatchLandingPageStatus` mutation on confirm
  - Handle pending state and success callback

- [x] Create `client-app/src/features/landing-page-cms/page-management/components/dialog/page-bulk-status-change-dialog.tsx`
  - Accept `open`, `onOpenChange`, `pageIds`, `newStatusId`, `affectedCount`, `onSuccess` props
  - Display affected count and new status information
  - Use `ConfirmDialog` component with Info icon
  - Call `useUpdateBatchLandingPageStatus` mutation on confirm
  - Handle pending state and success callback

- [x] Simplify `client-app/src/features/landing-page-cms/page-management/components/dialog/page-multi-delete-dialog.tsx`
  - Remove `useState` for confirmation word input
  - Remove `Input` and `Label` components for typing confirmation
  - Remove validation check for typed confirmation word
  - Remove `setValue('')` state cleanup
  - Update `disabled` prop to only check `deleteMutation.isPending` (remove typing requirement)
  - Keep destructive Alert warning
  - Match `ComponentMultiDeleteDialog` structure exactly

### Frontend - Dialog Integration

- [x] Update `client-app/src/features/landing-page-cms/page-management/components/dialog/page-dialog.tsx`
  - Import `PageStatusChangeDialog` and `PageBulkStatusChangeDialog`
  - Add dialog components to JSX with proper open state and props
  - Handle dialog open state from provider context

- [x] Update `client-app/src/features/landing-page-cms/page-management/components/page-provider.tsx`
  - Extend `LandingPagesDialogType` to include `'statusChange'` and `'bulkStatusChange'`
  - Add `newStatusId` state for tracking status change target
  - Add `pendingBulkStatusChange` state for bulk operations (pageIds, statusId, affectedCount)
  - Add setter functions to context type

### Frontend - Trigger Updates

- [x] Update `client-app/src/features/landing-page-cms/page-management/components/table/page-status-cell.tsx`
  - Replace direct mutation call with dialog trigger
  - Import provider context via `useLandingPages`
  - On status change, set current row, new status ID, and open `'statusChange'` dialog
  - Remove direct `useUpdateBatchLandingPageStatus` usage from this component

- [x] Update `client-app/src/features/landing-page-cms/page-management/components/table/page-bulk-actions.tsx`
  - Replace direct mutation call with dialog trigger in `handleStatusChange`
  - Import provider context via `useLandingPages`
  - On bulk status change, set pending bulk status change state and open `'bulkStatusChange'` dialog
  - Remove direct mutation execution from button click handlers
  - Keep validation logic (checking affected count, showing error toast)

### Frontend - Translations

- [x] Add i18n keys to `client-app/src/locales/en/page-management.json`
  - `dialog.statusChange.title`
  - `dialog.statusChange.message`
  - `dialog.statusChange.from`
  - `dialog.statusChange.confirm`
  - `dialog.statusChange.cancel`
  - `dialog.bulkStatusChange.title`
  - `dialog.bulkStatusChange.message`
  - `dialog.bulkStatusChange.confirm`
  - `dialog.bulkStatusChange.cancel`

- [x] Update multi-delete translations in `client-app/src/locales/en/page-management.json`
  - Remove `dialog.multiDelete.confirmWord` (no longer needed)
  - Remove `dialog.multiDelete.confirmLabel` (no longer needed)
  - Remove `dialog.multiDelete.confirmPlaceholder` (no longer needed)
  - Remove `dialog.multiDeleteToast.confirmRequired` (no longer needed)
  - Keep existing `dialog.multiDelete.title`, `message`, `description`, `warning`, `warningMessage`, `confirm`

- [x] Add corresponding translations to other locale files
  - `client-app/src/locales/zh/page-management.json` (Chinese)
  - Follow Component Management translation structure
  - Update multi-delete translations to remove typing-related keys

### Testing & Validation

- [x] Verify single status change opens confirmation dialog
- [x] Verify bulk status change opens confirmation dialog
- [x] Verify dialog shows correct page/status information
- [x] Verify confirm button executes mutation and closes dialog
- [x] Verify cancel button closes dialog without mutation
- [x] Verify pending state disables confirm button during mutation
- [x] Verify success toast appears after successful mutation
- [x] Verify table updates and row selection resets after bulk operation
- [x] Verify simplified multi-delete dialog no longer requires typing
- [x] Verify multi-delete confirm button is immediately enabled (no typing check)
- [x] Verify multi-delete still shows destructive warning and count
- [x] Test RTL layout for Chinese language (only supported locale besides English)
- [x] Run `pnpm lint` to ensure no linting errors
- [x] Run `pnpm format` to ensure consistent formatting

## Notes

- Follow Component Management dialog patterns exactly
- Reuse existing `ConfirmDialog` component
- Maintain existing mutation hooks (no changes needed)
- Ensure dialog state cleanup on close
- Preserve existing single delete dialog functionality (no changes)
- Simplify multi-delete dialog to match Component Management (remove typing requirement)
