# Proposal: Add Page Management Confirmation Dialogs

## Change ID
`add-page-management-confirmation-dialogs`

## Problem Statement

Page Management currently lacks confirmation dialogs for status change operations (both single and bulk), leading to potential accidental changes. When users click on a status dropdown or bulk action buttons, the status changes immediately without confirmation. Additionally, the multi-delete dialog has a typing requirement that is inconsistent with Component Management's simpler confirm pattern.

**Current Issues:**
- Single page status changes execute immediately via dropdown (no confirmation)
- Bulk status changes execute immediately via toolbar buttons (no confirmation)
- Users cannot review or cancel accidental status changes
- Multi-delete dialog requires typing confirmation word (inconsistent with Component Management)
- Inconsistent UX compared to Component Management feature

## Proposed Solution

Add confirmation dialogs for page management status change operations and simplify the multi-delete dialog, matching the patterns established in Component Management:

1. **Single Page Status Change Dialog**: Confirm status change for one page (similar to `ComponentStatusChangeDialog`)
2. **Bulk Page Status Change Dialog**: Confirm status change for multiple pages (similar to `ComponentBulkStatusChangeDialog`)
3. **Simplified Multi-Delete Dialog**: Remove typing requirement and use simple confirm button (match `ComponentMultiDeleteDialog`)

**Note**: Single delete dialog is already simple and does not need changes. Multi-delete dialog will be simplified to match Component Management pattern (remove typing requirement).

## Benefits

- **Prevent accidental changes**: Users must explicitly confirm status changes
- **Consistent UX**: All dialogs match Component Management confirmation patterns
- **Better user confidence**: Users can review changes before applying
- **Reduced errors**: Confirmation step catches mistakes before execution
- **Simpler workflow**: Multi-delete no longer requires typing confirmation word

## Scope

**In Scope:**
- Create `page-status-change-dialog.tsx` component
- Create `page-bulk-status-change-dialog.tsx` component
- Update `page-dialogs.tsx` to include new dialog components
- Update `page-status-cell.tsx` to trigger confirmation dialog instead of direct mutation
- Update `page-bulk-actions.tsx` to trigger confirmation dialog instead of direct mutation
- Update `page-provider.tsx` to manage dialog state for status changes
- **Simplify `page-multi-delete-dialog.tsx`** to remove typing requirement (match Component Management pattern)
- Add i18n translations for dialog content

**Out of Scope:**
- Backend API changes (existing endpoints support the feature)
- Single delete dialog (already simple, no changes needed)
- Other page management features

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Extra click adds friction to workflow | Confirmation dialogs are standard UX pattern for state-changing operations |
| Code duplication with Component Management | Follow established patterns; dialogs are feature-specific by design |
| i18n translations missing | Add all required translation keys in proposal phase |

## Dependencies

- Existing `useUpdateBatchLandingPageStatus` mutation hook
- Existing `ConfirmDialog` reusable component
- Existing page provider context pattern
- Component Management implementation as reference

## Success Criteria

1. Status change via dropdown opens confirmation dialog (not immediate execution)
2. Bulk status change via toolbar buttons opens confirmation dialog (not immediate execution)
3. Dialogs display current and new status information
4. Dialogs support pending state during mutation
5. Successful mutation closes dialog and shows success toast
6. Dialog cancellation does not change status
7. Multi-delete dialog uses simple confirm button (no typing required)
8. All dialogs match Component Management patterns
9. All dialogs follow RTL support requirements
10. i18n translations work for all supported languages
