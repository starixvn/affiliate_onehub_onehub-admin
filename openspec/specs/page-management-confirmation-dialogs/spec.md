# page-management-confirmation-dialogs Specification

## Purpose
TBD - created by archiving change add-page-management-confirmation-dialogs. Update Purpose after archive.
## Requirements
### Requirement: Single page status change must show confirmation dialog

Users MUST see a confirmation dialog when changing the status of a single page. The dialog MUST display page details and require explicit confirmation before executing the status change mutation.

#### Scenario: Status change via dropdown opens confirmation dialog

**Given** a user is viewing the Page Management table

**And** a page row with status "Draft" (statusId: 0) exists

**When** the user clicks the status dropdown for that row

**And** selects "Active" (statusId: 1) from the dropdown

**Then** a confirmation dialog MUST open

**And** the dialog MUST display:
- Title: "Change Page Status" with Info icon
- Message: "Are you sure you want to change the status of **[Page Name]**?"
- Status transition: "From: Draft → Active"
- Cancel button (secondary style)
- Confirm button (primary style)

**And** the status change mutation MUST NOT execute until the user clicks Confirm

**Implementation Note**: Use `PageStatusChangeDialog` component. Trigger via `PageStatusCell` component by setting dialog state in provider context instead of calling mutation directly.

#### Scenario: Confirming status change dialog executes mutation

**Given** the single page status change dialog is open

**And** the dialog shows the page "Home Page" changing from "Draft" to "Active"

**When** the user clicks the Confirm button

**Then** the `useUpdateBatchLandingPageStatus` mutation MUST execute with:
- `pageIds`: String representation of the page ID
- `statusId`: Target status ID (1 for Active)

**And** the Confirm button MUST be disabled while mutation is pending

**And** upon successful mutation (errorCode === 0):
- Dialog MUST close
- Success toast MUST appear: "Landing page status updated successfully"
- Table data MUST refresh (query invalidation)

**And** if mutation fails (errorCode !== 0):
- Dialog MUST remain open
- Error toast MUST appear: "Failed to update landing page status"

#### Scenario: Canceling status change dialog does not execute mutation

**Given** the single page status change dialog is open

**When** the user clicks the Cancel button

**Or** presses the Escape key

**Or** clicks outside the dialog

**Then** the dialog MUST close

**And** the status change mutation MUST NOT execute

**And** the page status MUST remain unchanged

**And** the dialog state MUST reset (currentRow, newStatusId set to null)

### Requirement: Bulk page status change must show confirmation dialog

Users MUST see a confirmation dialog when changing the status of multiple selected pages. The dialog MUST display the count of affected pages and require explicit confirmation before executing the batch status change mutation.

#### Scenario: Bulk status change via toolbar opens confirmation dialog

**Given** a user has selected 5 pages in the Page Management table

**And** 3 of those pages have a status other than "Active"

**When** the user clicks the "Set Active" bulk action button

**Then** a confirmation dialog MUST open

**And** the dialog MUST display:
- Title: "Change Status for Multiple Pages" with Info icon
- Message: "Are you sure you want to change the status of **3 pages** to **Active**?"
- Cancel button (secondary style)
- Confirm button (primary style)

**And** the bulk status change mutation MUST NOT execute until the user clicks Confirm

**Implementation Note**: Use `PageBulkStatusChangeDialog` component. Trigger via `PageBulkActions` component by setting pending bulk status change state in provider context instead of calling mutation directly.

#### Scenario: Bulk status change only affects pages with different status

**Given** a user has selected 5 pages in the Page Management table

**And** 2 pages are "Active", 3 pages are "Draft"

**When** the user clicks the "Set Active" bulk action button

**Then** the confirmation dialog MUST only count the 3 affected pages (Draft → Active)

**And** the dialog message MUST show "3 pages" (not 5 pages)

**And** upon confirmation, the mutation MUST only send the 3 affected page IDs

**Technical Context**: Existing `PageBulkActions.handleStatusChange` already filters affected pages. This logic MUST be preserved when triggering the dialog.

#### Scenario: Confirming bulk status change dialog executes mutation

**Given** the bulk page status change dialog is open

**And** the dialog shows 3 pages changing to "Active"

**And** the pending bulk status change contains pageIds "123,456,789"

**When** the user clicks the Confirm button

**Then** the `useUpdateBatchLandingPageStatus` mutation MUST execute with:
- `pageIds`: "123,456,789"
- `statusId`: Target status ID (1 for Active)

**And** the Confirm button MUST be disabled while mutation is pending

**And** upon successful mutation (errorCode === 0):
- Dialog MUST close
- Success toast MUST appear: "Landing page status updated successfully"
- Table row selection MUST reset (all rows deselected)
- Table data MUST refresh (query invalidation)

**And** if mutation fails (errorCode !== 0):
- Dialog MUST remain open
- Error toast MUST appear: "Failed to update landing page status"

#### Scenario: Canceling bulk status change dialog does not execute mutation

**Given** the bulk page status change dialog is open

**When** the user clicks the Cancel button

**Or** presses the Escape key

**Or** clicks outside the dialog

**Then** the dialog MUST close

**And** the bulk status change mutation MUST NOT execute

**And** the page statuses MUST remain unchanged

**And** the table row selection MUST remain unchanged

**And** the dialog state MUST reset (pendingBulkStatusChange set to null)

### Requirement: Dialog state management must be integrated with page provider

The page provider context MUST manage dialog state for status change operations, ensuring proper state isolation and cleanup. Dialog state MUST integrate seamlessly with existing dialog management for delete operations.

#### Scenario: Page provider context includes status change dialog state

**Given** the `LandingPagesProvider` context is initialized

**Then** the context MUST include the following state:

**Dialog Type Extensions:**
- `open: LandingPagesDialogType | null` where `LandingPagesDialogType` includes:
  - `'create'`, `'update'`, `'delete'`, `'duplicate'` (existing)
  - `'statusChange'` (NEW)
  - `'bulkStatusChange'` (NEW)

**Status Change State:**
- `newStatusId: number | null` - Target status ID for single page status change
- `setNewStatusId: (id: number | null) => void` - Setter for target status

**Bulk Status Change State:**
- `pendingBulkStatusChange: { pageIds: string, statusId: number, affectedCount: number } | null`
- `setPendingBulkStatusChange: (data: PendingBulkStatusChange | null) => void`

**Implementation Note**: Extend existing provider context types and state management. Follow patterns from `currentRow` state for consistency.

#### Scenario: Dialog state cleanup on dialog close

**Given** a status change dialog is open with state populated

**When** the dialog closes (via cancel, confirm success, or outside click)

**Then** the dialog-specific state MUST reset:

**For Single Status Change:**
- `open` MUST be set to `null`
- `currentRow` MUST be set to `null`
- `newStatusId` MUST be set to `null`

**For Bulk Status Change:**
- `open` MUST be set to `null`
- `pendingBulkStatusChange` MUST be set to `null`

**Implementation Note**: State cleanup occurs in `onOpenChange` handlers in `PageDialogs` component.

#### Scenario: Dialog state persists during mutation pending

**Given** a status change dialog is open and confirm button is clicked

**And** the mutation is pending (not yet completed)

**Then** the dialog MUST remain open

**And** the dialog state MUST NOT reset

**And** the confirm button MUST be disabled

**When** the mutation completes successfully

**Then** the dialog MUST close

**And** the dialog state MUST reset

**Technical Context**: Mutation hooks handle pending state via `isPending` property. Dialog remains open until `onSuccess` callback executes.

### Requirement: Dialog components must follow Component Management patterns

The Page Management status change dialogs MUST follow the established patterns from Component Management dialogs. This ensures UI/UX consistency and code maintainability.

#### Scenario: PageStatusChangeDialog matches ComponentStatusChangeDialog structure

**Given** the `PageStatusChangeDialog` component is implemented

**Then** the component MUST:
- Accept props: `open`, `onOpenChange`, `currentRow`, `newStatusId`
- Use `ConfirmDialog` component as the base
- Display Info icon (not destructive icon)
- Show page name in bold from `currentRow.lpName`
- Look up current status label from `statuses` array via `currentRow.statusId`
- Look up new status label from `statuses` array via `newStatusId`
- Display status transition: "From: [Current Status] → [New Status]"
- Use `useUpdateBatchLandingPageStatus` mutation hook
- Pass `pageIds: String(currentRow.pageId), statusId: newStatusId` to mutation
- Disable confirm button when `mutation.isPending === true`
- Close dialog on successful mutation via `onOpenChange(false)` in `onSuccess` callback
- Use i18n translations via `useTranslation('page-management')`

**Implementation Note**: Reference `ComponentStatusChangeDialog` at `client-app/src/features/link-generator/component-management/components/dialog/component-status-change-dialog.tsx` for exact structure.

#### Scenario: PageBulkStatusChangeDialog matches ComponentBulkStatusChangeDialog structure

**Given** the `PageBulkStatusChangeDialog` component is implemented

**Then** the component MUST:
- Accept props: `open`, `onOpenChange`, `pageIds`, `newStatusId`, `affectedCount`, `onSuccess`
- Use `ConfirmDialog` component as the base
- Display Info icon (not destructive icon)
- Show affected count in message: "{{count}} pages"
- Look up new status label from `statuses` array via `newStatusId`
- Use `useUpdateBatchLandingPageStatus` mutation hook
- Pass `pageIds, statusId: newStatusId` to mutation
- Disable confirm button when `mutation.isPending === true`
- Close dialog on successful mutation via `onOpenChange(false)` in `onSuccess` callback
- Execute optional `onSuccess` callback prop (for row selection reset)
- Use i18n translations via `useTranslation('page-management')`

**Implementation Note**: Reference `ComponentBulkStatusChangeDialog` at `client-app/src/features/link-generator/component-management/components/dialog/component-bulk-status-change-dialog.tsx` for exact structure.

### Requirement: Internationalization support for dialog content

Dialog content MUST support all configured languages (English, Arabic, Hebrew) via i18n translation keys. Translations MUST follow the established structure from Component Management.

#### Scenario: English translations are defined for status change dialogs

**Given** the English locale file exists at `client-app/src/locales/en/page-management.json`

**Then** the file MUST include the following translation keys under `"dialog"`:

```json
{
  "dialog": {
    "statusChange": {
      "title": "Change Page Status",
      "message": "Are you sure you want to change the status of",
      "from": "From",
      "confirm": "Confirm",
      "cancel": "Cancel"
    },
    "bulkStatusChange": {
      "title": "Change Status for Multiple Pages",
      "message": "Are you sure you want to change the status of {{count}} pages to",
      "confirm": "Confirm",
      "cancel": "Cancel"
    }
  }
}
```

**Implementation Note**: Add keys to existing `dialog` object. Do not overwrite existing `delete` and `multiDelete` keys.

#### Scenario: RTL language translations are defined for status change dialogs

**Given** the Arabic locale file exists at `client-app/src/locales/ar/page-management.json`

**And** the Hebrew locale file exists at `client-app/src/locales/he/page-management.json`

**Then** both files MUST include translated versions of the status change dialog keys

**And** the translations MUST support RTL text direction

**And** the translation structure MUST match the English version (same keys, localized values)

**Technical Context**: Use Component Management translations as reference. Arabic: `client-app/src/locales/ar/component-management.json`, Hebrew: `client-app/src/locales/he/component-management.json`.

#### Scenario: Dialog content renders with correct locale

**Given** the user has selected Arabic language

**And** a single page status change dialog is open

**When** the dialog renders

**Then** the dialog title MUST display in Arabic

**And** the dialog message MUST display in Arabic

**And** the button labels MUST display in Arabic

**And** the text MUST align right-to-left

**Technical Context**: `useTranslation('page-management')` hook automatically selects the correct locale. RTL layout handled by `DirectionProvider` context.

### Requirement: Integration with existing page management components

The status change dialogs MUST integrate seamlessly with existing Page Management components without breaking current functionality. Delete dialogs and table operations MUST remain fully functional.

#### Scenario: PageDialogs component renders all dialog types

**Given** the `PageDialogs` component exists at `client-app/src/features/landing-page-cms/page-management/components/dialog/page-dialog.tsx`

**Then** the component MUST render:
- `PageDeleteDialog` (existing, unchanged)
- `PageStatusChangeDialog` (NEW) when `open === 'statusChange'` and `currentRow` and `newStatusId` are not null
- `PageBulkStatusChangeDialog` (NEW) when `open === 'bulkStatusChange'` and `pendingBulkStatusChange` is not null

**And** each dialog MUST:
- Use provider context state via `useLandingPages()` hook
- Have proper conditional rendering (prevent rendering when state is null)
- Have proper key prop for re-rendering (e.g., `key={page-status-change-${currentRow.lpCode}}`)
- Have proper cleanup in `onOpenChange` handler

**Implementation Note**: Follow the pattern from Component Management's `ComponentDialogs` at `client-app/src/features/link-generator/component-management/components/dialog/component-dialogs.tsx`.

#### Scenario: PageStatusCell triggers status change dialog instead of direct mutation

**Given** the `PageStatusCell` component exists at `client-app/src/features/landing-page-cms/page-management/components/table/page-status-cell.tsx`

**When** the component is updated to support confirmation dialogs

**Then** the component MUST:
- Import `useLandingPages` hook from provider
- Remove direct usage of `useUpdateBatchLandingPageStatus` hook
- On `onValueChange` of `StatusSelect`:
  1. Call `setCurrentRow(row.original)`
  2. Call `setNewStatusId(Number(newStatus))`
  3. Call `setOpen('statusChange')`
- NOT call mutation directly

**And** the `StatusSelect` component MUST:
- Remain enabled (not disabled based on mutation pending state)
- Keep existing props: `value`, `options`, `size`

**Technical Context**: The mutation pending state will be managed by the dialog component, not the cell component.

#### Scenario: PageBulkActions triggers bulk status change dialog instead of direct mutation

**Given** the `PageBulkActions` component exists at `client-app/src/features/landing-page-cms/page-management/components/table/page-bulk-actions.tsx`

**When** the component is updated to support confirmation dialogs

**Then** the component MUST:
- Import `useLandingPages` hook from provider
- Remove direct mutation execution from `handleStatusChange` function
- Keep existing validation logic (affected pages count check, error toast)
- On valid status change action:
  1. Call `setPendingBulkStatusChange({ pageIds, statusId: status, affectedCount: affectedPages.length })`
  2. Call `setOpen('bulkStatusChange')`
- NOT call mutation directly

**And** the component MUST remove the `useUpdateBatchLandingPageStatus` hook usage

**And** the bulk action buttons MUST:
- Keep existing disabled logic based on affected count
- Keep existing tooltip content
- Keep existing icons and styling

**Technical Context**: Validation remains in `PageBulkActions`. Dialog only handles confirmation and mutation execution.

#### Scenario: Delete dialogs remain unchanged and functional

**Given** the `PageDeleteDialog` component exists

**And** the `PageMultiDeleteDialog` component exists

**When** the status change dialog implementation is complete

**Then** both delete dialog components MUST remain unchanged

**And** single page deletion via row actions MUST still work

**And** bulk page deletion via bulk actions toolbar MUST still work

**And** delete dialogs MUST open with `open === 'delete'` state

**Technical Context**: This change only adds new dialog types. Existing single delete functionality must not be modified. Multi-delete dialog will be simplified.

### Requirement: Multi-delete dialog must be simplified to match Component Management pattern

The existing `PageMultiDeleteDialog` component MUST be simplified to remove the typing requirement and use a simple confirm button, matching the pattern used in Component Management. This improves UX consistency and simplifies the deletion workflow.

#### Scenario: Multi-delete dialog no longer requires typing confirmation word

**Given** the `PageMultiDeleteDialog` component exists with typing requirement

**When** the component is simplified

**Then** the dialog MUST remove:
- `useState` hook for confirmation word input value
- `Input` component for typing confirmation
- `Label` component with typing instructions
- Validation check `if (value.trim() !== CONFIRM_WORD)`
- `setValue('')` state cleanup in `onOpenChange`
- Toast error for incorrect typing `t('dialog.multiDeleteToast.confirmRequired')`

**And** the dialog MUST keep:
- `AlertTriangle` icon with destructive styling
- Dialog title with selected rows count
- Description message and warning
- Destructive `Alert` component with warning
- `ConfirmDialog` base component

**Implementation Note**: Remove lines 25, 29, 32-37, 58, 79-90 from current implementation. Update `disabled` prop on line 62 to only check `deleteMutation.isPending`.

#### Scenario: Multi-delete confirm button is immediately enabled

**Given** the simplified `PageMultiDeleteDialog` is open

**And** 3 pages are selected for deletion

**When** the dialog renders

**Then** the Confirm/Delete button MUST be enabled immediately

**And** the button MUST NOT be disabled based on input validation

**And** the button MUST only be disabled when `deleteMutation.isPending === true`

**Technical Context**: Before simplification, button was disabled via `value.trim() !== CONFIRM_WORD || deleteMutation.isPending`. After simplification, it should only check `deleteMutation.isPending`.

#### Scenario: Multi-delete mutation executes without typing validation

**Given** the simplified `PageMultiDeleteDialog` is open

**And** 3 pages are selected

**When** the user clicks the Confirm/Delete button

**Then** the `handleDelete` function MUST NOT check for confirmation word validation

**And** the mutation MUST execute immediately with `pageIds` parameter

**And** upon successful deletion:
- Dialog MUST close
- Table row selection MUST reset
- Success toast MUST appear: "Landing pages deleted successfully"

**Implementation Note**: Remove the validation block that checks `value.trim() !== CONFIRM_WORD` and shows error toast. Mutation should execute directly.

#### Scenario: Multi-delete translations no longer require typing-related keys

**Given** the English locale file at `client-app/src/locales/en/page-management.json`

**When** the multi-delete dialog is simplified

**Then** the following translation keys MUST be removed:
- `dialog.multiDelete.confirmWord`
- `dialog.multiDelete.confirmLabel`
- `dialog.multiDelete.confirmPlaceholder`
- `dialog.multiDeleteToast.confirmRequired`

**And** the following translation keys MUST be kept:
- `dialog.multiDelete.title`
- `dialog.multiDelete.message`
- `dialog.multiDelete.description`
- `dialog.multiDelete.warning`
- `dialog.multiDelete.warningMessage`
- `dialog.multiDelete.confirm`

**And** the same changes MUST apply to Arabic and Hebrew locale files

**Implementation Note**: Remove unused keys from all three locale files (en, ar, he) for page-management translations.

#### Scenario: Simplified multi-delete dialog matches ComponentMultiDeleteDialog structure

**Given** the `ComponentMultiDeleteDialog` component exists at `client-app/src/features/link-generator/component-management/components/dialog/component-multi-delete-dialog.tsx`

**And** the simplified `PageMultiDeleteDialog` component exists

**Then** both components MUST follow the same pattern:
- Use `ConfirmDialog` component as base
- Display destructive AlertTriangle icon
- Show affected count in title
- Display warning message and destructive Alert
- Have confirm button enabled immediately (only disabled during pending)
- Execute mutation directly on confirm (no validation checks)
- Reset row selection on successful deletion

**And** both components MUST NOT have:
- Input field for typing confirmation
- Validation logic for typed confirmation word
- Error toast for incorrect typing

**Technical Context**: This ensures consistency across all multi-delete dialogs in the application.

