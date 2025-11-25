# Spec: Column Visibility Toggle

**Capability**: `column-visibility-toggle`

**Owner**: Frontend Team

**Last Updated**: 2025-11-24

## Overview

Defines how the column visibility toggle menu (DataTableViewOptions component) determines which columns should be user-controllable and which should be excluded from the toggle interface.

## ADDED Requirements

### Requirement: Filter-only columns must not appear in visibility toggle menu

Filter-only columns (columns used exclusively for filtering without visible UI) MUST NOT appear in the column visibility toggle menu. Users MUST NOT be able to control visibility of columns that have no displayable content.

#### Scenario: Columns with hideFromToggle metadata are excluded from toggle menu

**Given** a table has columns with `meta: { hideFromToggle: true }`

**When** the user opens the column visibility toggle menu

**Then** the menu:
- MUST NOT display columns with `hideFromToggle: true` in the list
- MUST display all other hideable columns normally
- MUST maintain existing toggle functionality for visible columns

**Implementation Note**: The `DataTableViewOptions` component filters columns using:
```typescript
column.getCanHide() && !column.columnDef.meta?.hideFromToggle
```

#### Scenario: Filter-only columns remain hidden despite toggle capability

**Given** filter-only columns have `meta: { hideFromToggle: true }`

**And** the columns do not have `enableHiding: false`

**When** the table renders

**Then** the columns:
- MUST remain hidden from table display via `columnVisibility` state
- MUST NOT appear in the toggle menu
- MUST remain available for filtering operations
- MUST allow `columnVisibility` state to control their display

**Technical Context**: Removing `enableHiding: false` allows `columnVisibility` to work, but requires `hideFromToggle` to prevent toggle menu appearance.

#### Scenario: Type system supports hideFromToggle metadata

**Given** the TanStack Table ColumnMeta type declaration

**When** defining column metadata

**Then**:
- MUST support `hideFromToggle?: boolean` property
- MUST maintain type safety for metadata access
- MUST not break existing metadata properties (className, displayName)

**Implementation Note**: Extend the existing module declaration in `page-table.tsx`:
```typescript
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string
    displayName?: string
    hideFromToggle?: boolean  // New property
  }
}
```

## MODIFIED Requirements

None. This is a new capability specification.

## REMOVED Requirements

None.

## Related Capabilities

- `page-management-table-display` (from `fix-empty-filter-columns` change) - This capability complements table display by controlling toggle menu behavior

## Technical References

- **Files**:
  - `client-app/src/components/data-table/view-options.tsx` (toggle menu component)
  - `client-app/src/features/landing-page-cms/page-management/components/table/page-columns.tsx` (column definitions with metadata)
  - `client-app/src/features/landing-page-cms/page-management/components/table/page-table.tsx` (ColumnMeta type declaration)

- **Libraries**:
  - `@tanstack/react-table` - Table library with column visibility and metadata support

- **Patterns**:
  - Metadata-driven UI filtering - Using column metadata to control component behavior
  - Optional boolean flags - `hideFromToggle` is optional and defaults to false/undefined

## Migration Notes

This pattern can be adopted by other tables that use `DataTableViewOptions`:

1. The `DataTableViewOptions` component change applies globally to all tables
2. Tables that want to hide specific columns from the toggle menu add `meta: { hideFromToggle: true }`
3. Existing tables without this metadata are unaffected (backward compatible)
