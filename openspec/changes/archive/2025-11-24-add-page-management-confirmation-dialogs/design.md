# Design: Add Page Management Confirmation Dialogs

## Architecture Overview

This change adds confirmation dialogs for status change operations in Page Management and simplifies the existing multi-delete dialog to match Component Management patterns. The solution maintains separation of concerns and leverages existing infrastructure.

## Component Architecture

### New Dialog Components

**PageStatusChangeDialog**
- **Purpose**: Confirm single page status change
- **Location**: `client-app/src/features/landing-page-cms/page-management/components/dialog/page-status-change-dialog.tsx`
- **Props**:
  - `open: boolean` - Dialog visibility state
  - `onOpenChange: (open: boolean) => void` - Dialog close handler
  - `currentRow: LandingPage` - Page being modified
  - `newStatusId: number` - Target status ID
- **Behavior**:
  - Displays page name (`lpName`)
  - Shows status transition: current status → new status
  - Calls `useUpdateBatchLandingPageStatus({ pageIds: String(pageId), statusId })` on confirm
  - Closes dialog on successful mutation
- **Pattern Match**: `ComponentStatusChangeDialog`

**PageBulkStatusChangeDialog**
- **Purpose**: Confirm bulk page status change
- **Location**: `client-app/src/features/landing-page-cms/page-management/components/dialog/page-bulk-status-change-dialog.tsx`
- **Props**:
  - `open: boolean` - Dialog visibility state
  - `onOpenChange: (open: boolean) => void` - Dialog close handler
  - `pageIds: string` - Comma-separated page IDs
  - `newStatusId: number` - Target status ID
  - `affectedCount: number` - Number of pages affected
  - `onSuccess?: () => void` - Optional success callback (for row selection reset)
- **Behavior**:
  - Displays affected count and new status
  - Calls `useUpdateBatchLandingPageStatus({ pageIds, statusId })` on confirm
  - Executes `onSuccess` callback after successful mutation
  - Closes dialog on successful mutation
- **Pattern Match**: `ComponentBulkStatusChangeDialog`

### Simplified Existing Dialog

**PageMultiDeleteDialog (Modification)**
- **Purpose**: Confirm bulk page deletion (existing dialog, simplified)
- **Location**: `client-app/src/features/landing-page-cms/page-management/components/dialog/page-multi-delete-dialog.tsx`
- **Changes**:
  - **REMOVE**: `useState` for confirmation word input
  - **REMOVE**: `Input` component for typing confirmation
  - **REMOVE**: `Label` component with typing instructions
  - **REMOVE**: Validation check `if (value.trim() !== CONFIRM_WORD)`
  - **REMOVE**: `setValue('')` state cleanup
  - **REMOVE**: Toast error for incorrect typing
  - **UPDATE**: `disabled` prop to only check `deleteMutation.isPending` (remove typing requirement)
  - **KEEP**: Destructive Alert warning
  - **KEEP**: Selected rows count display
  - **KEEP**: AlertTriangle icon
- **Behavior After Changes**:
  - Displays selected pages count
  - Shows destructive warning alert
  - Confirm button immediately enabled (not dependent on typing)
  - Calls `useDeleteBatchLandingPages` on confirm
  - Closes dialog on successful mutation
- **Pattern Match**: `ComponentMultiDeleteDialog` (simplified confirm pattern)

### State Management

**Provider Context Extensions**

Extend `LandingPagesProvider` context to support dialog state:

```typescript
type LandingPagesDialogType =
  | 'create'
  | 'update'
  | 'delete'
  | 'duplicate'
  | 'statusChange'        // NEW
  | 'bulkStatusChange'    // NEW

type LandingPagesContextType = {
  // ... existing properties
  newStatusId: number | null                    // NEW
  setNewStatusId: (id: number | null) => void   // NEW
  pendingBulkStatusChange: {                    // NEW
    pageIds: string
    statusId: number
    affectedCount: number
  } | null
  setPendingBulkStatusChange: (data: PendingBulkStatusChange | null) => void  // NEW
}
```

**State Flow for Single Status Change:**
1. User clicks status dropdown in `PageStatusCell`
2. Component calls:
   - `setCurrentRow(row.original)`
   - `setNewStatusId(newStatusId)`
   - `setOpen('statusChange')`
3. `PageStatusChangeDialog` renders with current row and new status
4. User confirms → mutation executes → dialog closes
5. User cancels → dialog closes, state resets

**State Flow for Bulk Status Change:**
1. User clicks bulk action button in `PageBulkActions`
2. Component validates affected pages count
3. If valid, calls:
   - `setPendingBulkStatusChange({ pageIds, statusId, affectedCount })`
   - `setOpen('bulkStatusChange')`
4. `PageBulkStatusChangeDialog` renders with pending bulk change data
5. User confirms → mutation executes → dialog closes → row selection resets
6. User cancels → dialog closes, state resets

## Integration Points

### PageStatusCell (Single Change Trigger)

**Before:**
```typescript
const handleStatusChange = (newStatus: string) => {
  updateMutation.mutate({ pageIds: row.original.pageId.toString(), statusId: Number(newStatus) })
}
```

**After:**
```typescript
const handleStatusChange = (newStatus: string) => {
  setCurrentRow(row.original)
  setNewStatusId(Number(newStatus))
  setOpen('statusChange')
}
```

### PageBulkActions (Bulk Change Trigger)

**Before:**
```typescript
const handleStatusChange = (status: number, statusKey: string) => {
  // validation...
  updateBatchStatusMutation.mutate({ pageIds, statusId: status }, { onSuccess: ... })
}
```

**After:**
```typescript
const handleStatusChange = (status: number, statusKey: string) => {
  // validation...
  setPendingBulkStatusChange({ pageIds, statusId: status, affectedCount: affectedPages.length })
  setOpen('bulkStatusChange')
}
```

### PageDialogs (Dialog Container)

**Before:**
```tsx
<PageDeleteDialog ... />
```

**After:**
```tsx
<PageDeleteDialog ... />
{currentRow && newStatusId !== null && (
  <PageStatusChangeDialog
    open={open === 'statusChange'}
    onOpenChange={() => { setOpen(null); setCurrentRow(null); setNewStatusId(null); }}
    currentRow={currentRow}
    newStatusId={newStatusId}
  />
)}
{pendingBulkStatusChange && (
  <PageBulkStatusChangeDialog
    open={open === 'bulkStatusChange'}
    onOpenChange={() => { setOpen(null); setPendingBulkStatusChange(null); }}
    pageIds={pendingBulkStatusChange.pageIds}
    newStatusId={pendingBulkStatusChange.statusId}
    affectedCount={pendingBulkStatusChange.affectedCount}
    onSuccess={() => table.resetRowSelection()}
  />
)}
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Single Status Change Flow                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PageStatusCell (StatusSelect)                                          │
│         │                                                                │
│         │ onValueChange                                                 │
│         ▼                                                                │
│  setCurrentRow(row)                                                     │
│  setNewStatusId(statusId)                                               │
│  setOpen('statusChange')                                                │
│         │                                                                │
│         ▼                                                                │
│  PageStatusChangeDialog                                                 │
│         │                                                                │
│         │ confirm                                                       │
│         ▼                                                                │
│  useUpdateBatchLandingPageStatus.mutate()                               │
│         │                                                                │
│         │ onSuccess                                                     │
│         ▼                                                                │
│  onOpenChange(false)                                                    │
│  Query invalidation + toast                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ Bulk Status Change Flow                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  PageBulkActions (Button)                                               │
│         │                                                                │
│         │ onClick                                                       │
│         ▼                                                                │
│  Validate affected pages                                                │
│         │                                                                │
│         │ if valid                                                      │
│         ▼                                                                │
│  setPendingBulkStatusChange({ pageIds, statusId, affectedCount })      │
│  setOpen('bulkStatusChange')                                            │
│         │                                                                │
│         ▼                                                                │
│  PageBulkStatusChangeDialog                                             │
│         │                                                                │
│         │ confirm                                                       │
│         ▼                                                                │
│  useUpdateBatchLandingPageStatus.mutate()                               │
│         │                                                                │
│         │ onSuccess                                                     │
│         ▼                                                                │
│  onOpenChange(false)                                                    │
│  onSuccess() callback (reset row selection)                             │
│  Query invalidation + toast                                             │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## UI/UX Design

### Single Status Change Dialog

**Visual Elements:**
- Icon: Info icon (blue/neutral, not destructive)
- Title: "Change Page Status"
- Content:
  - "Are you sure you want to change the status of **[Page Name]**?"
  - "From: [Current Status] → [New Status]"
- Actions:
  - Cancel button (secondary)
  - Confirm button (primary, disabled when pending)

### Bulk Status Change Dialog

**Visual Elements:**
- Icon: Info icon (blue/neutral, not destructive)
- Title: "Change Status for Multiple Pages"
- Content:
  - "Are you sure you want to change the status of **[N] pages** to **[New Status]**?"
- Actions:
  - Cancel button (secondary)
  - Confirm button (primary, disabled when pending)

### Multi-Delete Dialog (Simplified)

**Visual Elements:**
- Icon: AlertTriangle (destructive, red)
- Title: "Delete [N] Pages"
- Content:
  - "Are you sure you want to delete the selected pages?"
  - "This action cannot be undone."
  - Destructive Alert with warning message
- Actions:
  - Cancel button (secondary)
  - Delete button (destructive, enabled immediately)

**Removed Elements:**
- Input field for typing confirmation word
- Label with typing instructions
- Validation toast for incorrect typing

### Styling Considerations

- Match `ConfirmDialog` component styling
- Follow RTL layout requirements (icon position, text alignment)
- Use theme-aware colors (light/dark mode support)
- Maintain consistent spacing with other dialogs

## Internationalization

### Translation Keys Structure

**New Keys (Status Change Dialogs):**
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

**Removed Keys (Multi-Delete Simplification):**
```json
{
  "dialog": {
    "multiDelete": {
      "confirmWord": "DELETE",           // REMOVE
      "confirmLabel": "Type...",         // REMOVE
      "confirmPlaceholder": "Type...",   // REMOVE
    }
  },
  "dialog": {
    "multiDeleteToast": {
      "confirmRequired": "You must type..." // REMOVE
    }
  }
}
```

**Kept Keys (Multi-Delete):**
- `dialog.multiDelete.title`
- `dialog.multiDelete.message`
- `dialog.multiDelete.description`
- `dialog.multiDelete.warning`
- `dialog.multiDelete.warningMessage`
- `dialog.multiDelete.confirm`

### Localization Files

- `client-app/src/locales/en/page-management.json` (English)
- `client-app/src/locales/ar/page-management.json` (Arabic)
- `client-app/src/locales/he/page-management.json` (Hebrew)

## Testing Strategy

### Manual Testing Checklist

1. **Single Status Change:**
   - Click status dropdown on any page row
   - Verify dialog opens with correct page name and status info
   - Click Cancel → dialog closes, status unchanged
   - Click Confirm → mutation executes, dialog closes, status updates, toast appears

2. **Bulk Status Change:**
   - Select multiple pages
   - Click bulk action button (Active/Inactive/Draft)
   - Verify dialog opens with correct affected count
   - Click Cancel → dialog closes, selection unchanged
   - Click Confirm → mutation executes, dialog closes, rows deselected, toast appears

3. **Multi-Delete Dialog:**
   - Select multiple pages
   - Click delete button in bulk actions
   - Verify dialog opens immediately with confirm button enabled
   - Verify NO input field for typing confirmation
   - Click Confirm → mutation executes, dialog closes, rows deselected, toast appears

4. **Edge Cases:**
   - Attempt bulk action when all selected pages already have target status → toast error, no dialog
   - Change status while mutation pending → confirm button disabled

5. **RTL Testing:**
   - Switch to Arabic or Hebrew language
   - Verify dialog layout mirrors correctly
   - Verify text alignment and icon positions

6. **Theme Testing:**
   - Test in light mode
   - Test in dark mode
   - Verify dialog colors and contrast

### Code Quality Checks

- Run `pnpm lint` → no errors
- Run `pnpm format` → consistent formatting
- Review for code duplication
- Verify no commented-out code
- Check file sizes stay under 250 lines

## Alternative Approaches Considered

### Option 1: Inline Confirmation (Rejected)
- Show inline confirmation instead of modal dialog
- **Rejected**: Inconsistent with existing Component Management pattern, less visible

### Option 2: Undo Feature (Rejected)
- Allow immediate status change with undo toast action
- **Rejected**: More complex implementation, potential race conditions, inconsistent UX

### Option 3: Settings Toggle (Rejected)
- Add user setting to enable/disable confirmations
- **Rejected**: Adds unnecessary complexity, most users expect confirmation for state changes

## Implementation Notes

### Code Reuse

- Reuse `ConfirmDialog` component (no changes needed)
- Reuse `useUpdateBatchLandingPageStatus` mutation hook (no changes needed)
- Reuse status data from `data/data.tsx` for status label lookup
- Follow Component Management dialog patterns exactly

### Performance Considerations

- Dialog components render conditionally (only when open)
- State updates are minimal (only required fields)
- No unnecessary re-renders due to memoized context values

### Accessibility

- Dialog uses `ConfirmDialog` component (already accessible)
- Proper ARIA labels on buttons
- Keyboard navigation supported (Tab, Escape)
- Screen reader friendly

### Error Handling

- Mutation errors handled by existing mutation hooks (toast error message)
- Network errors trigger retry or error toast
- Dialog remains open on error (allows user to retry or cancel)

## Success Metrics

- Zero regressions in existing delete dialog functionality
- All new dialogs follow Component Management patterns
- RTL support verified in Arabic/Hebrew
- No linting or formatting errors
- File sizes remain under 250 lines
- All manual test cases pass
