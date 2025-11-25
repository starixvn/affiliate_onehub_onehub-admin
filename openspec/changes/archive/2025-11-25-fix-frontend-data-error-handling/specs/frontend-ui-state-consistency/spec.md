# Frontend UI State Consistency

## ADDED Requirements

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

## MODIFIED Requirements

None. This introduces new consistency requirements for UI state.

## REMOVED Requirements

None. No existing requirements are being removed.
