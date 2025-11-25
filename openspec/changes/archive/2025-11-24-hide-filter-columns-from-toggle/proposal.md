# Proposal: Hide Filter-Only Columns from Toggle Menu and Table Display

**Change ID**: `hide-filter-columns-from-toggle`

**Status**: Proposed

**Author**: AI Assistant

**Date**: 2025-11-24

**Related Changes**: Supersedes and reverts `fix-empty-filter-columns`

## Problem Statement

After implementing `fix-empty-filter-columns`, there are TWO issues:

1. **Empty columns still visible in table**: Despite removing `enableHiding: false` and setting `columnVisibility: { countryCode: false, languageCode: false }`, the empty columns are still rendered in the table
2. **Columns appear in toggle menu**: The columns now appear in the "Toggle columns" dropdown as "CountryCode" and "LanguageCode", which shouldn't be user-controllable

### Root Cause Analysis

The `columnVisibility` state is initialized with `{ countryCode: false, languageCode: false }`, but TanStack Table requires columns to have `enableHiding: true` (or not explicitly set to `false`) for `columnVisibility` to take effect.

However, when `enableHiding` is not `false`, the columns become visible in the toggle menu via `column.getCanHide()` returning `true`.

**The Contradiction:**
- To hide columns from table: Need `enableHiding` to NOT be `false` + set `columnVisibility: false`
- To hide from toggle menu: Need `enableHiding: false`

We need a solution that satisfies both requirements.

## Proposed Solution

**Add custom metadata flag and modify toggle menu filter**

1. Add `meta: { hideFromToggle: true }` to both `countryCode` and `languageCode` columns
2. Modify `DataTableViewOptions` component to filter out columns with `hideFromToggle: true`
3. Keep the existing `columnVisibility` state to hide columns from table
4. Do NOT add `enableHiding: false` back

This approach:
- ✅ Hides columns from table display (via `columnVisibility`)
- ✅ Hides columns from toggle menu (via custom filter)
- ✅ Maintains filtering functionality
- ✅ Provides a reusable pattern for other tables

### Implementation Details

**In page-columns.tsx:**
```typescript
{
  accessorKey: 'countryCode',
  header: () => null,
  cell: () => null,
  meta: {
    hideFromToggle: true,  // Add this
  },
  filterFn: (row, id, value) => {
    return value.includes(String(row.getValue(id)))
  },
  enableSorting: false,
  // Do NOT add enableHiding: false
},
{
  accessorKey: 'languageCode',
  header: () => null,
  cell: () => null,
  meta: {
    hideFromToggle: true,  // Add this
  },
  filterFn: (row, id, value) => {
    return value.includes(String(row.getValue(id)))
  },
  enableSorting: false,
  // Do NOT add enableHiding: false
}
```

**In view-options.tsx:**
```typescript
table
  .getAllColumns()
  .filter(
    (column) =>
      typeof column.accessorFn !== 'undefined' &&
      column.getCanHide() &&
      !column.columnDef.meta?.hideFromToggle  // Add this condition
  )
```

### Alternative Considered and Rejected

**Alternative: Restore `enableHiding: false`**
- Would remove from toggle menu
- BUT would break `columnVisibility` state, keeping empty columns visible
- NOT a solution

## Scope

**Affected Files:**
- `client-app/src/components/data-table/view-options.tsx` - Add filter for `hideFromToggle`
- `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx` - Add metadata

**Affected Capabilities:**
- Column Visibility Toggle (new filtering logic)
- Page Management Table Display (maintains existing behavior)

## Type System Updates

Need to extend the TanStack Table ColumnMeta type declaration:

```typescript
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string
    displayName?: string
    hideFromToggle?: boolean  // Add this
  }
}
```

This declaration already exists in [page-table.tsx:41-47](client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx#L41-L47), but needs to be updated or moved to a shared location if used in multiple places.

## Dependencies

- Supersedes `fix-empty-filter-columns`
- Does NOT revert the code changes from `fix-empty-filter-columns`
- Builds upon those changes by adding the missing piece

## Risks

**Low Risk:**
- New metadata property is optional and won't break existing columns
- Filter in toggle menu is additive (adds one more condition)
- If `hideFromToggle` is undefined, behavior is unchanged
- Pattern can be adopted by other tables as needed

## Success Criteria

- ✅ No empty columns visible in Page Management table
- ✅ `countryCode` and `languageCode` do NOT appear in toggle menu
- ✅ Other columns remain visible and toggleable
- ✅ Country and language filtering continues to work
- ✅ Column visibility localStorage persistence still works
- ✅ No console errors or warnings

## Testing Checklist

- [ ] Verify no empty columns in table display
- [ ] Verify "CountryCode" and "LanguageCode" do NOT appear in toggle menu
- [ ] Test country filter functionality
- [ ] Test language filter functionality
- [ ] Test combined country + language filtering
- [ ] Toggle visibility of other columns (should work normally)
- [ ] Refresh page and verify column visibility is restored
- [ ] Check browser console for errors

## Migration Path for Other Tables

If other tables need this pattern:

1. Add `meta: { hideFromToggle: true }` to any filter-only columns
2. Ensure `enableHiding` is not explicitly set to `false`
3. Set `columnVisibility: { columnId: false }` in table initialization
4. The updated `DataTableViewOptions` component will automatically filter them out

## Related Changes

- `fix-empty-filter-columns` - This change completes that implementation
