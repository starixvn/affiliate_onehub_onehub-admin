# Implementation Tasks

## Task 1: Fix usePageFilters query data safety (CRITICAL) ✅

**File**: `client-app/src/features/landing-page-cms/page-management/api/queries.ts`

1. Add `GetPageFiltersResponse` to type imports (line 2-6)
2. Guard spread operation with nullish coalescing (line 42):
   ```typescript
   ...(query.data ?? {}),
   ```
3. Change `selectPageFilters` parameter type from `any` to `GetPageFiltersResponse` (line 48)
4. Add optional chaining to statusInfos filter (line 81):
   ```typescript
   response?.statusInfos?.filter(
   ```

**Validation**:
- Run `pnpm tsc` to verify TypeScript compilation passes
- Test page load in browser - no runtime errors
- Verify loading state shows correctly before data fetches
- Check that filters populate after API responds

**Dependencies**: None
**Estimated time**: 15 minutes

---

## Task 2: Fix useDeleteLandingPage mutation error handling (HIGH PRIORITY) ✅

**File**: `client-app/src/features/landing-page-cms/page-management/api/commands.ts`

1. Remove `onError` parameter from function signature (line 10)
2. Change `onSuccess` to receive `response` parameter (line 15)
3. Add errorCode check inside `onSuccess`:
   ```typescript
   if (response.errorCode === 0) {
     // Success path - invalidate queries, show success toast
   } else {
     // Error path - show error toast
     toast.error(response.errorMessage || 'Failed to delete landing page')
   }
   ```
4. Follow campaign-management pattern (show toast directly, no callback)

**Validation**:
- Test successful delete (errorCode: 0) - shows success toast, refreshes list
- Test failed delete (errorCode !== 0) - shows error toast, no refresh
- Verify backend error message is displayed to user
- Component dialog handles errorCode check in its onSuccess callback

**Dependencies**: Task 1 (for testing context)
**Can parallelize**: Yes, with Tasks 3 and 4
**Estimated time**: 20 minutes

---

## Task 3: Fix useDeleteBatchLandingPages mutation error handling (HIGH PRIORITY) ✅

**File**: `client-app/src/features/landing-page-cms/page-management/api/commands.ts`

1. Remove `onError` parameter from function signature (line 27)
2. Update `onSuccess` callback to check `response.errorCode === 0` (line 33)
3. Add error handling with direct toast.error call
4. Follow campaign-management pattern

**Validation**:
- Test successful batch delete
- Test failed batch delete with backend error
- Verify error message displayed correctly
- Check query invalidation only on success

**Dependencies**: Task 1
**Can parallelize**: Yes, with Tasks 2 and 4
**Estimated time**: 20 minutes

---

## Task 4: Fix useUpdateBatchLandingPageStatus mutation error handling (HIGH PRIORITY) ✅

**File**: `client-app/src/features/landing-page-cms/page-management/api/commands.ts`

1. Remove `onError` parameter from function signature (line 45)
2. Update `onSuccess` to check `response.errorCode === 0` (line 51)
3. Add error handling with direct toast.error call
4. Follow campaign-management pattern

**Validation**:
- Test successful status change
- Test status change with business rule violation
- Verify dialog stays open on error
- Check success dialog closes only when errorCode === 0

**Dependencies**: Task 1
**Can parallelize**: Yes, with Tasks 2 and 3
**Estimated time**: 20 minutes

---

## Task 5: Fix date-range-filter period detection (MEDIUM PRIORITY) ✅

**File**: `client-app/src/components/date-range-filter.tsx`

1. Replace hardcoded `new Date('2025-01-01')` with dynamic calculation (line 38):
   ```typescript
   const entirePeriodFrom = minDate || startOfDay(
     new Date(
       new Date().getFullYear() - 2,
       new Date().getMonth(),
       new Date().getDate()
     )
   )
   ```

**Validation**:
- Select "Entire Period" preset in DateRangePicker
- Verify badge shows "Entire Period" label (not full date range)
- Test with and without minDate/maxDate props
- Check that manual selection of same dates also shows "Entire Period"

**Dependencies**: None
**Can parallelize**: Yes, with all other tasks
**Estimated time**: 10 minutes

---

## Task 6: Fix single-select Expand/Collapse label (MEDIUM PRIORITY) ✅

**File**: `client-app/src/components/dropdowns/single-select.tsx`

1. Replace label logic (lines 281-283) with fallback-aware version:
   ```typescript
   {(isGroupedOptions(options) &&
     Object.keys(options).every(
       (groupKey) =>
         (expandedGroups[groupKey] ?? defaultExpandAll)
     ))
     ? 'Collapse All'
     : 'Expand All'}
   ```

**Validation**:
- Test with `defaultExpandAll={false}` - shows "Expand All" initially
- Test with `defaultExpandAll={true}` - shows "Collapse All" initially
- Verify no layout shift on first render
- Check label updates correctly when toggling groups
- Verify "Toggle All" button still works correctly

**Dependencies**: None
**Can parallelize**: Yes, with all other tasks
**Estimated time**: 10 minutes

---

## Task 7: Fix axios interceptor errorCode check (HIGH PRIORITY) ✅

**File**: `client-app/src/lib/api/client.ts`

1. Fix condition on line 51 to properly check errorCode
2. Change from `if (data?.errorCode && data.errorCode !== 0)`
3. To: `if (data?.errorCode !== undefined && data.errorCode !== 0)`
4. Ensures errorCode === 0 is properly handled (0 is falsy in JavaScript)

**Why this matters:**
- Original condition: `data?.errorCode && data.errorCode !== 0`
- When errorCode === 0: First part evaluates to `0` (falsy) → whole condition is false → passes through
- When errorCode === undefined: First part is falsy → passes through (correct for non-Result endpoints)
- When errorCode === 1+: First part is truthy → checks !== 0 → rejects (correct)
- **Bug**: The `&&` operator with falsy 0 value prevented proper type checking

**After fix:**
- Explicitly checks `!== undefined` before checking `!== 0`
- Properly handles errorCode === 0 (success)
- Properly rejects errorCode !== 0 (business errors)
- Aligns with IAxiosResponse type definition where errorCode is always present

**Validation**:
- TypeScript compilation passes
- Response with errorCode === 0 resolves to onSuccess
- Response with errorCode !== 0 rejects to onError (and mutation hooks show toast)
- Maintains backward compatibility with existing patterns

**Dependencies**: None (independent infrastructure fix)
**Estimated time**: 5 minutes

---

## Task 8: Run integration tests and verify fixes ✅

1. Start development server: `cd client-app && pnpm dev`
2. Navigate to page management feature
3. Test critical path:
   - Page loads without crashes ✓
   - Filters load and display correctly ✓
   - Delete single page (success case) ✓
   - Delete page with error (errorCode !== 0) ✓
   - Batch delete (success and error) ✓
   - Status change (success and error) ✓
   - Select "Entire Period" preset ✓
   - Verify badge shows "Entire Period" ✓
   - Test single-select with grouped options ✓
   - Verify "Expand All" / "Collapse All" label ✓

4. Run linting: `pnpm lint`
5. Run type checking: `pnpm tsc`
6. Run formatting check: `pnpm format:check`

**Validation**:
- All manual tests pass
- No console errors
- No TypeScript errors
- Linting passes
- Formatting is correct

**Dependencies**: Tasks 1-6 must be complete
**Estimated time**: 30 minutes

---

## Task 9: Optional - Improve iframe-hover-preview UX (LOW PRIORITY)

**File**: `client-app/src/components/iframe-hover-preview.tsx`

⚠️ **This task is OPTIONAL and can be skipped or deferred.**

1. Add state for tracking hover on both trigger and preview
2. Update `handleMouseLeave` with delayed close logic
3. Add mouse enter/leave handlers to preview portal
4. Test cursor transitions from trigger to preview

**Validation**:
- Preview stays open when moving mouse to it
- Preview closes after leaving both trigger and preview
- 100ms delay allows smooth cursor movement
- Works correctly in tables and outside tables

**Dependencies**: None (independent feature improvement)
**Can skip**: Yes, low priority UX enhancement
**Estimated time**: 30 minutes (if implemented)

---

## Summary

**Critical path**: Tasks 1-8 (required)
**Optional**: Task 9 (can be deferred)

**Parallelization opportunities**:
- Tasks 2, 3, 4 can be done in parallel after Task 1
- Tasks 5, 6, 7 can be done in parallel with any other tasks
- Task 8 must be last (integration tests)

**Total estimated time**: 2-2.5 hours (without Task 9)
**With Task 9**: 2.5-3 hours

**Risk mitigation**:
- Task 1 is foundation for testing Tasks 2-4
- Each task is independently verifiable
- Integration test (Task 7) catches any missed issues
- All changes follow existing codebase patterns
