# Implementation Tasks

## 1. Domain Layer Updates
- [x] 1.1 Create `PagingDataWithDashboard<T, TDashboard>` generic class in `src/ONEHub.Domain/Entities/PagingData.cs` with `where TDashboard : new()` constraint
- [x] 1.2 Update `IPageManagementRepository.GetLandingPageListAsync` signature to return `Result<PagingDataWithDashboard<LandingPage, PageManagementDashboard>>`

## 2. Infrastructure Layer Updates
- [x] 2.1 Add `FetchPagingDataWithDashboardAsync<T, TDashboard>` method to `BaseRepository` using `dynamicRepository.FetchMultipleAsync<T, TDashboard>`
- [x] 2.2 Update `PageManagementRepository.GetLandingPageListAsync` to use new `FetchPagingDataWithDashboardAsync` method
- [x] 2.3 Remove `GetPageManagementDashboardCriteria` class from `src/ONEHub.Infrastructure/Repositories/Criterias/LandingPages/`
- [x] 2.4 Remove `GetPageManagementDashboardAsync` method from `PageManagementRepository`

## 3. Application Layer Updates
- [x] 3.1 Update `GetLandingPageListQuery` handler to map dashboard data from repository result
- [x] 3.2 Update `GetLandingPageListQuery` response model to include dashboard data
- [x] 3.3 Remove `GetPageManagementDashboardQuery` and handler from `src/ONEHub.Application/Features/LandingPages/PageManagement/Queries/`
- [x] 3.4 Remove `IPageManagementRepository.GetPageManagementDashboardAsync` interface method
- [x] 3.5 Create `PagingQueryWithDashboard<TResponse, TDashboard>` base class in Application/Features/Shared
- [x] 3.6 Convert `PageManagementDashboardResponse` from record to class

## 4. WebApi Layer Updates
- [x] 4.1 Update `PageManagementModels.cs` to include dashboard in list response
- [x] 4.2 Remove `Summary` endpoint method from `PageManagementEndPoint`
- [x] 4.3 Update endpoint registration to remove summary route

## 5. Database Changes
- [x] 5.1 Document required changes to `OH_PageBuilder_ManageSel` stored procedure in DATABASE_CHANGES.md
- [x] 5.2 Verify `SpNames.xml` configuration for stored procedure mapping

## 6. Frontend Updates
- [x] 6.1 Update TypeScript types to include dashboard in list response structure
- [x] 6.2 Remove separate dashboard API call from `client-app/src/features/landing-page-cms/page-management/api/client.ts`
- [x] 6.3 Update `client-app/src/features/landing-page-cms/page-management/api/queries.ts` to remove `useGetLandingPageSummary` hook
- [x] 6.4 Update `page-provider.tsx` to expose dashboard data from list response
- [x] 6.5 Update `page-status-dashboard.tsx` to consume dashboard from provider context

## 7. Testing and Validation
- [x] 7.1 Run `dotnet build` to ensure clean compilation
- [x] 7.2 Verify backend builds successfully with no errors
- [x] 7.3 Test list endpoint returns both data grid and dashboard (requires DB changes)
- [x] 7.4 Test frontend displays dashboard correctly from combined response (requires DB changes)
- [x] 7.5 Run architecture tests to ensure layer dependencies remain valid

## Notes

- ✅ Backend implementation complete and compiling successfully
- ✅ Database stored procedure changes applied successfully
- ✅ Frontend changes complete and tested with combined response
- ✅ End-to-end testing completed - list endpoint returns both data grid and dashboard
- ⚠️ The `/api/page-management/summary` endpoint has been removed - ensure no external clients depend on it
