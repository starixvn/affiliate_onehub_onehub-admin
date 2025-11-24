# Proposal: Fix Empty Filter Columns in Page Management Table

**Change ID**: `fix-empty-filter-columns`

**Status**: Proposed

**Author**: AI Assistant

**Date**: 2025-11-24

## Problem Statement

The Page Management table currently displays two empty columns for `countryCode` and `languageCode`. These columns are configured as filter-only columns (they have `header: () => null` and `cell: () => null`) but are still rendered in the table DOM because they have `enableHiding: false`, which prevents the `columnVisibility` state from hiding them.

### Current Behavior

In [page-columns.tsx:143-151](client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx#L143-L151) and [page-columns.tsx:170-178](client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx#L170-L178):

- `countryCode` column has `enableHiding: false`, `header: () => null`, `cell: () => null`
- `languageCode` column has the same configuration
- These columns are used only for filtering via `filterFn`
- [page-table.tsx:74-81](client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx#L74-L81) attempts to hide them via `columnVisibility` state, but this is ineffective due to `enableHiding: false`

### Impact

- Two empty table columns are visible to users
- Wastes horizontal space
- Creates visual confusion
- Poor user experience

## Proposed Solution

Remove `enableHiding: false` from both `countryCode` and `languageCode` column definitions to allow the existing `columnVisibility` state to hide them.

### Why This Works

1. The columns are already configured with `header: () => null` and `cell: () => null`, indicating they should not render any UI
2. The `columnVisibility` initialization in [page-table.tsx:74-81](client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx#L74-L81) already sets `{ countryCode: false, languageCode: false }`
3. The columns will still be available for filtering because TanStack Table maintains column state even when hidden
4. This is a minimal change that leverages existing code

### Alternative Considered

Mark columns as "display: false" or remove them from the DOM entirely via custom rendering logic. This was rejected because:
- More complex implementation
- The existing `columnVisibility` mechanism is designed for this exact use case
- Would require more code changes

## Scope

**Affected Files:**
- `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx`

**Affected Capabilities:**
- Page Management Table Display

## Dependencies

None. This is an isolated frontend change.

## Risks

**Low Risk:**
- Filtering functionality might break if hidden columns can't be filtered
  - **Mitigation**: TanStack Table explicitly supports filtering on hidden columns. This is a documented and tested feature.

## Success Criteria

- No empty columns visible in Page Management table
- Country and language filters continue to work correctly
- Column visibility can be toggled via DataTableViewOptions (though these columns should remain hidden by default)
- No console errors or warnings
- Existing column visibility localStorage preferences are respected

## Testing Checklist

- [ ] Verify no empty columns appear in the table
- [ ] Test country filter functionality
- [ ] Test language filter functionality
- [ ] Test combined country + language filtering
- [ ] Verify localStorage persistence of column visibility
- [ ] Check that columns remain hidden after page refresh
- [ ] Test column visibility toggle (ensure these columns can be shown/hidden via UI)
- [ ] Verify no console errors

## Related Changes

None. This is a standalone fix.
