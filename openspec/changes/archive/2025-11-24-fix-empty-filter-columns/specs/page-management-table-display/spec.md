# Spec: Page Management Table Display

**Capability**: `page-management-table-display`

**Owner**: Frontend Team

**Last Updated**: 2025-11-24

## Overview

Defines how the Page Management table displays data, including which columns are visible, hidden, or used exclusively for filtering.

## ADDED Requirements

### Requirement: Filter-only columns must not render empty table columns

Filter-only columns (columns used exclusively for filtering via `filterFn` without visible UI) MUST NOT render empty table columns in the Page Management table. These columns MUST remain hidden while still being available for filtering operations.

#### Scenario: Country code filter column is hidden from display

**Given** the Page Management table is rendered

**When** the table initializes

**Then** the `countryCode` column:
- MUST NOT render a visible table header cell
- MUST NOT render visible table body cells
- MUST remain available for filtering operations
- MUST be toggleable via column visibility controls

**Implementation Note**: Remove `enableHiding: false` from `countryCode` column definition to allow `columnVisibility` state to control visibility.

#### Scenario: Language code filter column is hidden from display

**Given** the Page Management table is rendered

**When** the table initializes

**Then** the `languageCode` column:
- MUST NOT render a visible table header cell
- MUST NOT render visible table body cells
- MUST remain available for filtering operations
- MUST be toggleable via column visibility controls

**Implementation Note**: Remove `enableHiding: false` from `languageCode` column definition to allow `columnVisibility` state to control visibility.

#### Scenario: Filtering works on hidden filter-only columns

**Given** the `countryCode` and `languageCode` columns are hidden

**When** a user selects country or language filter values

**And** clicks the Search button

**Then** the table:
- MUST filter results based on the selected filter values
- MUST use the hidden column's `filterFn` for filtering
- MUST display only rows matching the filter criteria
- MUST maintain the hidden state of filter-only columns

**Technical Context**: TanStack Table supports filtering on hidden columns. The `filterFn` operates on column data regardless of visibility state.

#### Scenario: Column visibility state persists for filter-only columns

**Given** the `countryCode` and `languageCode` columns are hidden

**When** the user changes other column visibility settings

**And** refreshes the page

**Then**:
- MUST restore column visibility from localStorage
- MUST keep `countryCode` and `languageCode` hidden by default
- MUST allow user to manually show these columns via column visibility controls (though they will display empty due to null header/cell)

**Implementation Note**: Existing localStorage key `table-column-visibility:page-management` stores visibility state.

## Related Capabilities

None. This is an isolated table display concern.

## Technical References

- **Files**:
  - `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx` (column definitions)
  - `client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx` (columnVisibility state)

- **Libraries**:
  - `@tanstack/react-table` - Table library with built-in support for hidden column filtering

- **Documentation**:
  - [TanStack Table Column Visibility](https://tanstack.com/table/latest/docs/guide/column-visibility)
  - [TanStack Table Filtering](https://tanstack.com/table/latest/docs/guide/filtering)
