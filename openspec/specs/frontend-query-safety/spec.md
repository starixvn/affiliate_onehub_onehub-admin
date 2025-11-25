# frontend-query-safety Specification

## Purpose
TBD - created by archiving change fix-frontend-data-error-handling. Update Purpose after archive.
## Requirements
### Requirement: Query hooks MUST guard against undefined data when spreading

Query hooks that spread `query.data` into return objects MUST use nullish coalescing to prevent runtime crashes when data is undefined during loading state.

#### Scenario: usePageFilters guards spread operation

```typescript
// client-app/src/features/landing-page-cms/page-management/api/queries.ts
export const usePageFilters = () => {
  const query = useQuery({
    queryKey: landingPageKeys.filters(),
    queryFn: () => landingPageApi.getPageFilters(),
    select: selectPageFilters,
  })

  return {
    ...(query.data ?? {}),  // Guard with nullish coalescing
    isLoading: query.isLoading,
    error: query.error,
  }
}
```

**Given** query is in loading state
**When** `query.data` is `undefined`
**Then** spread operation uses empty object `{}`
**And** no TypeError is thrown
**And** `isLoading` and `error` are still returned correctly

### Requirement: Selector functions MUST use proper TypeScript types instead of any

Query selector functions MUST be typed with actual response types to ensure type safety and catch type mismatches at compile time.

#### Scenario: selectPageFilters uses GetPageFiltersResponse type

```typescript
// Import type from types file
import type {
  GetLandingPagesRequest,
  GetPageManagementDashboardRequest,
  PageStatus,
  GetPageFiltersResponse,  // Proper type
} from '../types'

// Type selector parameter
const selectPageFilters = (data: GetPageFiltersResponse) => {
  const response = data.data
  // ... rest of function
}
```

**Given** API response structure is defined in types
**When** selector function is called
**Then** TypeScript validates response structure at compile time
**And** IDE provides autocomplete for response properties
**And** type errors are caught before runtime

### Requirement: Selector functions MUST use optional chaining for nested property access

When accessing nested properties that may be undefined, selector functions MUST use optional chaining to prevent runtime errors.

#### Scenario: selectPageFilters uses optional chaining for statusInfos

```typescript
const selectPageFilters = (data: GetPageFiltersResponse) => {
  const response = data.data

  return {
    countries: response?.targetCountries ?? [],
    languages: response?.languages ?? [],
    pageStatus:
      response?.statusInfos?.filter(  // Optional chaining
        (status: PageStatus) => status.statusId !== undefined
      ) ?? [],
    landingPageUrl: response?.landingPageUrl ?? '',
    // ... dates
  }
}
```

**Given** response may have undefined statusInfos
**When** filtering statusInfos
**Then** optional chaining prevents TypeError
**And** empty array fallback is used if statusInfos is undefined
**And** filter only runs if statusInfos exists

