# Proposal: Fix Frontend Data and Error Handling

## Context

CodeRabbit AI review of MR #10 (243203-PageManagement-Rebase) identified 5 critical/potential issues in frontend data fetching and error handling patterns that affect application stability and user experience:

1. **Runtime crashes**: `usePageFilters` spreads undefined data causing TypeError on initial load
2. **False success notifications**: Mutation hooks ignore `errorCode` field, showing success toasts for business errors
3. **Inconsistent date period detection**: Hardcoded fallback date doesn't match DateRangePicker logic
4. **UI label mismatch**: Single-select "Expand/Collapse All" button shows incorrect label on first render
5. **Poor hover UX**: iframe-hover-preview closes immediately preventing user interaction

These issues violate established patterns in the codebase (asset-uploader and registration-form-management modules have correct error handling) and create inconsistent user experiences.

## Problem Statement

### Critical Issues

**1. Query Data Safety (usePageFilters)**
- Current code spreads `query.data` without null check: `...query.data`
- When query is loading, `query.data` is `undefined`
- Spreading undefined throws `TypeError: Cannot convert undefined or null to object`
- Application crashes on page load before data is fetched
- Type safety compromised with `any` type in selector function
- Missing optional chaining on `statusInfos` filter

**2. Mutation Error Handling (commands.ts)**
- Three mutation hooks unconditionally treat HTTP 200 as success
- Backend returns `{ errorCode, errorMessage, data }` structure
- `errorCode !== 0` indicates business error (e.g., "Page name already exists")
- Current pattern shows success toast and invalidates queries even for business errors
- Dialogs check `response.errorCode === 0` separately, creating UX conflicts
- Pattern inconsistent with asset-uploader and registration-form-management modules

### Medium Priority Issues

**3. Date Range Period Detection**
- `date-range-filter.tsx` hardcodes fallback: `new Date('2025-01-01')`
- `date-range-picker.tsx` uses dynamic 2-year lookback calculation
- User selects "Entire Period" preset → filter doesn't recognize it as entire period
- Badge shows full date range instead of "Entire Period" label

**4. Single-Select Expansion Label**
- `expandedGroups` initialized as empty `{}`
- `useEffect` populates it after first render
- Label logic: `Object.values(expandedGroups).every((expanded) => expanded)`
- Empty array `.every()` returns `true`
- Shows "Collapse All" when should show "Expand All" with `defaultExpandAll={false}`

**5. Iframe Hover Preview UX**
- `onMouseLeave` immediately calls `setShowPreview(false)`
- User moves cursor from trigger to preview → preview closes
- No delay or hover tracking on preview portal
- Makes preview effectively non-interactive despite portal rendering

## Proposed Solution

### 1. Fix Query Data Safety (Critical)

**File**: `client-app/src/features/landing-page-cms/page-management/api/queries.ts`

- Guard spread operation: `...(query.data ?? {})`
- Import and use `GetPageFiltersResponse` type instead of `any`
- Add optional chaining: `response?.statusInfos?.filter(...) ?? []`

**Impact**: Eliminates runtime crashes, improves type safety

### 2. Align Mutation Error Handling (High Priority)

**File**: `client-app/src/features/landing-page-cms/page-management/api/commands.ts`

Adopt pattern from asset-uploader/registration-form-management:
- Accept optional `onError?: (error: string) => void` parameter
- Check `response.errorCode === 0` in `onSuccess`
- Show success toast and invalidate queries only on true success
- Call `onError?.(response.errorMessage)` for business errors
- Fallback to `toast.error()` if no callback provided

Apply to:
- `useDeleteLandingPage`
- `useDeleteBatchLandingPages`
- `useUpdateBatchLandingPageStatus`

**Impact**: Prevents false success indicators, shows backend error messages, aligns with codebase patterns

### 3. Align Date Period Detection (Medium Priority)

**File**: `client-app/src/components/date-range-filter.tsx`

Replace hardcoded `new Date('2025-01-01')` with dynamic calculation matching DateRangePicker:
```typescript
new Date(
  new Date().getFullYear() - 2,
  new Date().getMonth(),
  new Date().getDate()
)
```

**Impact**: Ensures "Entire Period" preset is recognized correctly

### 4. Fix Single-Select Label Logic (Medium Priority)

**File**: `client-app/src/components/dropdowns/single-select.tsx`

Use same fallback logic as expansion state check:
```typescript
Object.keys(options).every(
  (groupKey) => (expandedGroups[groupKey] ?? defaultExpandAll)
)
```

**Impact**: Eliminates initial render label mismatch

### 5. Improve Iframe Hover UX (Optional - Low Priority)

**File**: `client-app/src/components/iframe-hover-preview.tsx`

Track hover on both trigger and preview with 100ms delay tolerance for smooth cursor transitions.

**Impact**: Allows user interaction with preview, better UX

## Capabilities Affected

- **frontend-query-safety**: Query data handling with proper null guards and type safety
- **frontend-mutation-error-handling**: Mutation response validation with errorCode checks
- **frontend-date-range-consistency**: Consistent date range period detection across components
- **frontend-ui-state-consistency**: UI state rendering matches actual component state

## Out of Scope

- Backend error code standardization (already correct)
- Other mutation hooks outside page-management module (already correct in asset-uploader/registration-form-management)
- Comprehensive iframe hover behavior redesign (keeping minimal fix)
- Refactoring date range logic into shared utilities (future optimization)

## Success Criteria

1. No runtime crashes on page load when usePageFilters is loading
2. TypeScript compilation passes with proper types
3. Success toasts only show when `response.errorCode === 0`
4. Backend error messages displayed to users
5. "Entire Period" preset recognized and displays correct badge
6. "Expand/Collapse All" button shows correct label on first render
7. All fixes align with existing codebase patterns

## Risks & Mitigation

**Risk**: Changing mutation hook signatures breaks existing component usage
**Mitigation**: Review all usages of three mutation hooks, ensure backward compatibility (onError parameter is optional)

**Risk**: Type changes cause TypeScript errors in consuming components
**Mitigation**: Verify GetPageFiltersResponse type exists and matches API response

**Risk**: Date calculation logic doesn't match edge cases
**Mitigation**: Copy exact logic from DateRangePicker, test with various dates

## Dependencies

- No new package dependencies
- No backend changes required
- No database changes required
- Leverages existing types and patterns

## Alternative Approaches Considered

### Alternative 1: Centralize Error Handling in API Client
**Pros**: Single point of truth for errorCode checking
**Cons**: Loses mutation-specific control, harder to customize error handling per operation
**Decision**: Rejected - mutation-level control provides better flexibility

### Alternative 2: Create Shared Date Utilities
**Pros**: DRY principle, easier to maintain
**Cons**: Over-engineering for current scope, can be done later
**Decision**: Deferred - focus on minimal fix now, refactor later if needed

### Alternative 3: Redesign Iframe Hover Behavior Completely
**Pros**: Could improve UX significantly
**Cons**: Larger scope, needs UX review, higher risk
**Decision**: Minimal fix for now, comprehensive redesign can be separate change

## Implementation Notes

- Follow existing patterns from asset-uploader and registration-form-management
- Keep changes minimal and focused
- Preserve backward compatibility where possible
- Add inline validation for type safety
- Test each fix independently before integration
