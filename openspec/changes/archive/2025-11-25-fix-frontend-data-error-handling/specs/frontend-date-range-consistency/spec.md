# Frontend Date Range Consistency

## ADDED Requirements

### Requirement: Date range components MUST use consistent period calculation logic

When multiple components calculate the same "entire period" date range, they MUST use identical logic for fallback dates to ensure preset detection works correctly.

#### Scenario: DateRangeFilter uses same fallback calculation as DateRangePicker

```typescript
// client-app/src/components/date-range-filter.tsx
const detectEntirePeriod = (
  currentFrom: Date | undefined,
  currentTo: Date | undefined
): boolean => {
  if (!currentFrom || !currentTo) return false

  // Same logic as DateRangePicker (lines 120-127)
  const entirePeriodFrom = minDate || startOfDay(
    new Date(
      new Date().getFullYear() - 2,
      new Date().getMonth(),
      new Date().getDate()
    )
  )
  const entirePeriodTo = maxDate || endOfDay(new Date())

  return (
    isSameDay(currentFrom, entirePeriodFrom) &&
    isSameDay(currentTo, entirePeriodTo)
  )
}
```

**Given** user selects "Entire Period" preset in DateRangePicker
**When** DateRangePicker calculates range using 2-year lookback
**And** DateRangeFilter detects entire period using same calculation
**Then** both components agree on what "entire period" means
**And** badge displays "Entire Period" label instead of full date range

#### Scenario: Dynamic date calculation prevents hardcoded date drift

```typescript
// BEFORE (hardcoded):
const entirePeriodFrom = minDate || startOfDay(new Date('2025-01-01'))

// AFTER (dynamic):
const entirePeriodFrom = minDate || startOfDay(
  new Date(
    new Date().getFullYear() - 2,
    new Date().getMonth(),
    new Date().getDate()
  )
)
```

**Given** current date is 2025-11-25
**When** calculating 2-year lookback
**Then** start date is 2023-11-25
**And** date updates automatically as current date changes
**And** no manual updates needed for hardcoded dates

### Requirement: Entire period detection MUST match picker preset behavior

The `detectEntirePeriod` function MUST use the exact same date boundaries as the "Entire Period" preset in DateRangePicker to ensure correct label display.

#### Scenario: Preset selection is recognized as entire period

```typescript
// DateRangePicker preset definition (lines 116-130)
{
  id: 'entirePeriod',
  label: 'Entire Period',
  getValue: () => ({
    from: minDate || startOfDay(new Date(...)),  // 2-year lookback
    to: maxDate || endOfDay(new Date()),
  }),
}
```

**Given** user clicks "Entire Period" preset
**When** DateRangePicker sets range to preset values
**And** DateRangeFilter receives `from` and `to` dates
**Then** `detectEntirePeriod(from, to)` returns `true`
**And** `formatDateRange()` returns "Entire Period"
**And** badge shows "Entire Period" label

#### Scenario: Manual selection of same dates is recognized

```typescript
// User manually selects same date range as entire period
const manualFrom = new Date(2023, 10, 25)  // 2 years ago
const manualTo = new Date(2025, 10, 25)     // Today
```

**Given** user manually selects dates matching entire period range
**When** dates match minDate/maxDate or fallback calculation
**Then** `detectEntirePeriod()` returns `true`
**And** badge shows "Entire Period" label
**And** behavior is same as preset selection

### Requirement: Date range filter MUST support both minDate/maxDate props and fallbacks

Filter MUST work correctly whether parent provides `minDate`/`maxDate` props or relies on default fallback calculations.

#### Scenario: Filter uses provided minDate and maxDate

```typescript
<DateRangeFilter
  from={from}
  to={to}
  onSelect={handleSelect}
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2025, 11, 31)}
/>
```

**Given** parent provides specific min/max dates
**When** detecting entire period
**Then** provided dates are used instead of fallback calculation
**And** entire period is from 2024-01-01 to 2025-12-31

#### Scenario: Filter uses fallback calculation when props not provided

```typescript
<DateRangeFilter
  from={from}
  to={to}
  onSelect={handleSelect}
  // No minDate/maxDate provided
/>
```

**Given** no minDate/maxDate props provided
**When** detecting entire period
**Then** 2-year lookback calculation is used
**And** current date is used as maxDate
**And** behavior matches DateRangePicker defaults

## MODIFIED Requirements

None. This adds consistency requirements for date range calculations.

## REMOVED Requirements

None. No existing requirements are being removed.
