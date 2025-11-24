# Tasks: Hide Filter-Only Columns from Toggle Menu

**Change ID**: `hide-filter-columns-from-toggle`

## Implementation Tasks

- [x] **Update ColumnMeta type declaration to include hideFromToggle**
  - File: `client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx`
  - Line: ~41-47
  - Add `hideFromToggle?: boolean` to the `ColumnMeta` interface
  - Also made `className` optional to fix type errors

- [x] **Add meta.hideFromToggle to countryCode column**
  - File: `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx`
  - Line: ~142-150
  - Add `meta: { hideFromToggle: true }` to the column definition

- [x] **Add meta.hideFromToggle to languageCode column**
  - File: `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx`
  - Line: ~168-176
  - Add `meta: { hideFromToggle: true }` to the column definition

- [x] **Update DataTableViewOptions filter logic**
  - File: `client-app/src/components/data-table/view-options.tsx`
  - Line: ~37-43
  - Add `&& !column.columnDef.meta?.hideFromToggle` to the filter condition

## Validation Tasks

- [ ] **Manual testing: Verify empty columns are hidden from table**
  - Navigate to Page Management table
  - Confirm no empty columns appear in the table display
  - Visual inspection of table layout

- [ ] **Manual testing: Verify columns are hidden from toggle menu**
  - Click the "View" button to open column visibility dropdown
  - Verify "CountryCode" and "LanguageCode" do NOT appear in the list
  - Verify other columns (LP Code, LP Name, Campaign Code, etc.) still appear

- [ ] **Manual testing: Test country filter**
  - Open country filter dropdown
  - Select one or more countries
  - Click Search
  - Verify results are filtered correctly

- [ ] **Manual testing: Test language filter**
  - Open language filter dropdown
  - Select one or more languages
  - Click Search
  - Verify results are filtered correctly

- [ ] **Manual testing: Test combined filtering**
  - Select both country and language filters
  - Click Search
  - Verify results match both criteria

- [ ] **Manual testing: Test other column visibility toggles**
  - Open column visibility dropdown
  - Toggle visibility for various columns (LP Code, Campaign Name, etc.)
  - Verify columns show/hide correctly
  - Verify no impact on filter-only columns

- [ ] **Manual testing: Test column visibility persistence**
  - Toggle some columns on/off
  - Refresh the page
  - Verify column visibility is restored from localStorage
  - Verify filter-only columns remain hidden

- [ ] **Check browser console for errors**
  - Open browser DevTools console
  - Perform all above tests
  - Verify no React errors or warnings
  - Verify no TanStack Table errors
  - Verify no TypeScript errors

## Rollback Plan

If issues arise:
- Revert changes to `view-options.tsx` (remove filter condition)
- Remove `meta` additions from column definitions
- Revert type declaration change
- This will show the columns in toggle menu again but maintain table display

## Notes

- This change builds upon `fix-empty-filter-columns` without reverting it
- Introduces a reusable pattern via `hideFromToggle` metadata
- Low risk - all changes are additive and optional
- No changes to filtering logic needed
- No changes to core table behavior
