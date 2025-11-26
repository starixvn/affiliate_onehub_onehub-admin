# Change: Fix search clear button to reset date range to default

## Why

When users type in the search box, the "Entire Period" preset becomes enabled. If they select it and then clear the search box, the date range remains as "Entire Period" instead of resetting to the default date range. This creates UI state inconsistency because:

1. The "Entire Period" preset is disabled when search is empty (indicating it shouldn't be active)
2. The date range still shows "Entire Period" even though the preset is now disabled
3. Users expect clearing the search to reset all search-dependent filters to their defaults

This violates the principle that clearing the search input should reset dependent state.

## What Changes

- Modify `handleClearSearch` in [page-table.tsx](client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx) to reset date range to default values when clearing search
- Ensure date range resets to `defaultFromDate` and `defaultToDate` when search box is cleared
- Clear the `selectedPreset` state to remove "Entire Period" selection

## Impact

- **Affected specs**: `frontend-ui-state-consistency`
- **Affected code**: `client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx`
- **User impact**: Users will now see date range reset to default when clearing the search box, maintaining consistent UI state
- **Breaking changes**: None - this is a bug fix that restores expected behavior
