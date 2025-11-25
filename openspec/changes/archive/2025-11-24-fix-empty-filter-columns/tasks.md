# Tasks: Fix Empty Filter Columns

**Change ID**: `fix-empty-filter-columns`

## Implementation Tasks

- [x] **Remove `enableHiding: false` from `countryCode` column definition**
  - File: `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx`
  - Line: ~150
  - Remove the `enableHiding: false` property from the `countryCode` column object

- [x] **Remove `enableHiding: false` from `languageCode` column definition**
  - File: `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx`
  - Line: ~177
  - Remove the `enableHiding: false` property from the `languageCode` column object

## Validation Tasks

- [ ] **Manual testing: Verify empty columns are hidden**
  - Navigate to Page Management table
  - Confirm no empty columns appear between visible columns
  - Visual inspection of table layout

- [ ] **Manual testing: Test country filter**
  - Open country filter dropdown
  - Select one or more countries
  - Click Search
  - Verify results are filtered correctly
  - Verify only pages matching selected countries appear

- [ ] **Manual testing: Test language filter**
  - Open language filter dropdown
  - Select one or more languages
  - Click Search
  - Verify results are filtered correctly
  - Verify only pages matching selected languages appear

- [ ] **Manual testing: Test combined filtering**
  - Select both country and language filters
  - Click Search
  - Verify results match both criteria
  - Test with multiple selections in each filter

- [ ] **Manual testing: Test column visibility persistence**
  - Change column visibility via DataTableViewOptions
  - Refresh the page
  - Verify column visibility is restored from localStorage
  - Confirm `countryCode` and `languageCode` remain hidden

- [ ] **Manual testing: Test column visibility toggle**
  - Open DataTableViewOptions (column visibility dropdown)
  - Verify `countryCode` and `languageCode` appear in the list
  - Toggle visibility for these columns
  - Verify they can be shown (though they will still display empty due to null header/cell)
  - Toggle back to hidden
  - Verify they hide again

- [ ] **Check browser console for errors**
  - Open browser DevTools console
  - Perform all above tests
  - Verify no React errors or warnings
  - Verify no TanStack Table errors

## Rollback Plan

If filtering breaks:
- Revert the two line changes (restore `enableHiding: false`)
- The table will return to showing empty columns but filtering will work

## Notes

- This is a two-line change with low risk
- TanStack Table is designed to support filtering on hidden columns
- The existing `columnVisibility` state initialization already expects these columns to be hidden
- No changes to filtering logic are needed
- No changes to the `page-table.tsx` file are needed
