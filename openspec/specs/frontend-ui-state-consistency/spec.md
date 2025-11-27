# frontend-ui-state-consistency Specification

## Purpose
TBD - created by archiving change fix-frontend-data-error-handling. Update Purpose after archive.
## Requirements
### Requirement: UI labels MUST accurately reflect component state including default values

UI elements that display state-based labels MUST account for default values when state hasn't been initialized yet, to prevent incorrect initial rendering.

#### Scenario: Single-select Expand/Collapse label uses fallback logic

```typescript
// client-app/src/components/dropdowns/single-select.tsx (lines 281-283)
{(isGroupedOptions(options) &&
  Object.keys(options).every(
    (groupKey) =>
      (expandedGroups[groupKey] ?? defaultExpandAll)  // Use fallback
  ))
  ? 'Collapse All'
  : 'Expand All'}
```

**Given** `defaultExpandAll={false}` prop
**And** `expandedGroups` state is empty `{}` on first render
**When** button label is computed
**Then** fallback to `defaultExpandAll` for undefined keys
**And** label shows "Expand All" (correct for collapsed state)
**And** no layout shift when state populates

#### Scenario: Label logic matches expansion state logic

```typescript
// Expansion state check (line 177)
const isExpanded = searchValue.trim()
  ? true
  : (expandedGroups[groupKey] ?? defaultExpandAll)

// Label logic - must use same pattern
const allExpanded = Object.keys(options).every(
  (groupKey) => (expandedGroups[groupKey] ?? defaultExpandAll)
)
```

**Given** both expansion state and label use `?? defaultExpandAll`
**When** user opens dropdown
**Then** expansion state matches label
**And** "Collapse All" shown when all groups expanded
**And** "Expand All" shown when any group collapsed
**And** no inconsistency between label and actual state

### Requirement: State initialization MUST NOT cause UI flickering or layout shifts

When component state is initialized via useEffect after first render, UI MUST show correct state from the beginning to prevent visual inconsistencies.

#### Scenario: Expand/Collapse button shows correct label before effect runs

```typescript
// State initialization via useEffect (lines 95-97)
useEffect(() => {
  setExpandedGroups(initialExpandedGroups)
}, [initialExpandedGroups])

// But label must work even when expandedGroups is empty
```

**Given** component renders for first time
**When** expandedGroups is still `{}`
**And** useEffect hasn't run yet
**Then** label computation falls back to `defaultExpandAll`
**And** correct label is shown immediately
**And** no flicker when effect populates state

#### Scenario: Empty object evaluation doesn't cause incorrect true result

```typescript
// BEFORE (incorrect):
Object.values(expandedGroups).every((expanded) => expanded)
// Empty array returns true → shows "Collapse All" incorrectly

// AFTER (correct):
Object.keys(options).every(
  (groupKey) => (expandedGroups[groupKey] ?? defaultExpandAll)
)
// Uses actual group keys and fallback → shows correct label
```

**Given** empty `expandedGroups` object
**When** `Object.values({})` returns `[]`
**Then** `[].every(() => true)` returns `true` (incorrect)
**But** using `Object.keys(options)` with fallback returns correct result

### Requirement: Default prop values MUST be respected in all state-dependent logic

When components accept default value props (e.g., `defaultExpandAll`), all related logic MUST respect these defaults, not just initial state population.

#### Scenario: Toggle all button respects defaultExpandAll

```typescript
const toggleAllGroups = () => {
  const allExpanded = Object.values(expandedGroups).every(
    (expanded) => expanded
  )
  // Toggle all groups to opposite state
  const newState = Object.keys(expandedGroups).reduce(
    (acc, groupKey) => {
      acc[groupKey] = !allExpanded
      return acc
    },
    {} as Record<string, boolean>
  )
  setExpandedGroups(newState)
}
```

**Given** user clicks "Toggle All" button
**When** toggling expansion state
**Then** all groups are set to opposite of current state
**And** `defaultExpandAll` is no longer needed after first toggle
**And** explicit state overrides default

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

### Requirement: Language state MUST be synchronized between LanguageProvider and i18next using a single shared cookie

The application uses both a custom `LanguageProvider` and the `i18next` library for internationalization. To prevent language state desynchronization, both systems MUST read from and write to the same cookie.

#### Scenario: i18next uses the same cookie name as LanguageProvider

```typescript
// client-app/src/lib/i18n.ts
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // ...other config
    detection: {
      order: ['cookie', 'navigator'],
      caches: ['cookie'],
      cookieMinutes: 525600,
      lookupCookie: 'locale',  // Must match LanguageProvider's LANGUAGE_COOKIE_NAME
    },
  })

// client-app/src/context/language-provider.tsx
const LANGUAGE_COOKIE_NAME = 'locale'  // Same as i18next lookupCookie
```

**Given** `LanguageProvider` uses cookie name `locale`
**And** i18next detection config specifies `lookupCookie: 'locale'`
**When** user switches language via `LanguageSwitch` component
**Then** `LanguageProvider` writes new language to `locale` cookie
**And** `i18next.changeLanguage()` also updates the `locale` cookie
**And** both systems read from the same `locale` cookie on page load
**And** no `i18next` cookie is created

#### Scenario: Language persists correctly across page reloads

```typescript
// User workflow
1. User selects Chinese language from dropdown
2. Page reloads (hard refresh or navigation)
3. Check language state
```

**Given** user has selected Chinese language (`zh`)
**When** `LanguageProvider` initializes on page load
**Then** `getCookie('locale')` returns `'zh'`
**When** i18next initializes via LanguageDetector
**Then** i18next reads from `locale` cookie and sets language to `'zh'`
**And** both systems show Chinese translations
**And** no language mismatch occurs

#### Scenario: Subsequent language switches work consistently

```typescript
// User workflow
1. User switches from English to Chinese
2. User switches from Chinese back to English
3. User switches from English to Chinese again
```

**Given** user performs multiple language switches
**When** each switch occurs via `setLanguage()` in LanguageProvider
**Then** cookie `locale` is updated with new language
**And** `i18n.changeLanguage()` is called with new language
**And** i18next internal state matches cookie value
**And** all switches apply immediately without refresh
**And** no desynchronization occurs between LanguageProvider state and i18next state

#### Scenario: Cookie configuration matches between systems

```typescript
// LanguageProvider cookie settings
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365  // 1 year

// i18next cookie settings
detection: {
  cookieMinutes: 525600,  // 365 days = 1 year
  lookupCookie: 'locale',
}
```

**Given** both systems manage the same cookie
**When** checking cookie expiration settings
**Then** LanguageProvider uses 1 year max-age
**And** i18next uses 525600 minutes (also 1 year)
**And** cookie persistence duration is consistent
**And** user language preference persists for same duration regardless of which system wrote it

