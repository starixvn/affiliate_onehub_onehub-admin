# Change: Fix Date Range Filter "Entire Period" Preset Reset Issue

## Why

The date range filter in Page Management has two issues:

1. **Preset Persistence**: When "Entire Period" is selected, the preset resets to "This Month" after form submission because the system doesn't preserve preset selection state across navigation
2. **API Response Inconsistency**: The filter API returns `Today`, `DefaultFromDate`, `DefaultToDate`, `MinDate` which is inconsistent - should be `minDate`, `maxDate`, `defaultFromDate`, `defaultToDate` for clarity and consistency

The root cause is:
- The system doesn't preserve preset selection state across navigation
- API response naming doesn't clearly distinguish between min/max date boundaries and default date range

## What Changes

**Frontend:**
- Add preset parameter to URL search params to preserve preset selection state
- Update form submission to include preset identifier when a preset is selected
- Modify date initialization logic to respect preset parameter from URL
- Update DateRangePicker to properly detect and restore "Entire Period" preset from URL params
- **"Entire Period" preset SHALL be disabled when search box is empty**
- **"Entire Period" preset SHALL be enabled when user types into search box**

**Backend:**
- Rename API response properties for consistency: `Today` → `MaxDate`, `MinDate` → `minDate` (lowercase)
- Keep `DefaultFromDate` and `DefaultToDate` as-is for default date range
- Backend returns `minDate` as 2 years ago, `maxDate` as today

**BREAKING**: API response property names changed (affects frontend consumers)

## Impact

- Affected specs: pagebuilder-dashboard (behavioral change to date filtering + API response structure)
- Affected code:
  - **Backend**: `GetPageManagementFiltersQuery.cs`, `PageManagementFiltersResponse` record
  - **Frontend**:
    - `page-table.tsx` (form submission logic)
    - `index.tsx` (initialization logic)
    - `date-range-picker.tsx` (preset detection)
    - `queries.ts` (API response mapping)
    - `page-provider.tsx` (context)
- Affected users: All admin users using Page Management date filters
- Migration: Frontend already updated to use new property names
