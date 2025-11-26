# frontend-ui-state-consistency Specification Delta

## ADDED Requirements

### Requirement: Search box clear button MUST reset all search-dependent filter state

When users clear the search input using the clear button (X icon), all filters and state that depend on having search text MUST reset to their default values to maintain UI consistency.

#### Scenario: Clear search button resets date range to default

```typescript
// page-table.tsx - handleClearSearch function
const handleClearSearch = () => {
  setSearchValue('')
  setFromDate(defaultFromDate)
  setToDate(defaultToDate)
  setSelectedPreset(null)
}
```

**Given** user has typed text in search box
**And** "Entire Period" preset is enabled (because search is not empty)
**And** user selects "Entire Period" preset
**When** user clicks the clear button (X icon) in search input
**Then** search value is cleared
**And** date range resets to `defaultFromDate` and `defaultToDate`
**And** `selectedPreset` is cleared to `null`
**And** date range no longer shows "Entire Period" label

#### Scenario: Clear search with custom date selection resets to default

```typescript
// User workflow
1. Type search text
2. Manually select a custom date range (not a preset)
3. Click clear search button
```

**Given** user has search text entered
**And** user has manually selected a custom date range
**When** user clicks the clear button in search input
**Then** search value is cleared
**And** date range resets to `defaultFromDate` and `defaultToDate`
**And** custom date selection is discarded

#### Scenario: Clear search without date changes has no side effects

```typescript
// User workflow
1. Type search text
2. Do not change date range
3. Click clear search button
```

**Given** user has search text entered
**And** date range is still at default values
**When** user clicks the clear button in search input
**Then** search value is cleared
**And** date range remains at default values (no unnecessary re-renders)
**And** no other filter state is affected

#### Scenario: Clear button is distinct from Reset button

```typescript
// Two different buttons with different behaviors
// Clear button (X icon): Clears search + resets date range
// Reset button: Resets ALL filters to defaults
```

**Given** user has modified search, filters, and date range
**When** user clicks the clear button (X icon) in search input
**Then** only search text is cleared
**And** only date range is reset
**And** other filters (status, country, language) remain unchanged

**Given** user has modified search, filters, and date range
**When** user clicks the Reset button
**Then** all filters reset to defaults (existing behavior)
**And** search is cleared
**And** date range is reset
**And** status/country/language filters are reset

### Requirement: Disabled presets MUST not remain selected when conditions change

When a preset becomes disabled due to external conditions (e.g., search box is empty), the UI MUST clear any active selection of that preset to prevent showing inconsistent state.

#### Scenario: Entire Period preset selection clears when search is cleared

```typescript
// DateRangePicker props
disabledPresets={searchValue.trim() === '' ? ['entirePeriod'] : []}
```

**Given** user has search text entered
**And** "Entire Period" preset is enabled and selected
**When** user clears the search text
**Then** `selectedPreset` state is set to `null`
**And** "Entire Period" preset becomes disabled
**And** date range resets to default values
**And** UI no longer shows "Entire Period" label

#### Scenario: Preset state consistency with disabled prop

```typescript
// Ensure preset selection state matches disabled state
if (searchValue.trim() === '') {
  // Entire Period should not be selected
  assert(selectedPreset !== 'entirePeriod')
}
```

**Given** a preset is marked as disabled in `disabledPresets` prop
**When** rendering the date range picker
**Then** that preset SHALL NOT be in selected state
**And** if it was previously selected, it MUST be cleared
**And** appropriate default date range MUST be shown instead
