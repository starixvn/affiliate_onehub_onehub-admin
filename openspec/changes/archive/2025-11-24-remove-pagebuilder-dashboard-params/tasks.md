# Implementation Tasks

## 1. Database Changes
- [x] 1.1 Update stored procedure `OH_PageBuilder_Dashboard_Sel` to remove all parameters from ALTER PROCEDURE signature
- [x] 1.2 Update stored procedure logic to calculate all-time totals without filtering
- [x] 1.3 Test stored procedure directly in database to verify it returns correct counts

## 2. Backend Infrastructure Layer
- [x] 2.1 Update `GetPageManagementDashboardCriteria.cs` to remove all parameter properties (keep only GetSettingKey and IsValid)
- [x] 2.2 Update `PageManagementRepository.cs` method `GetPageManagementDashboardAsync` to accept no parameters
- [x] 2.3 Update repository method to create criteria without parameters

## 3. Backend Domain Layer
- [x] 3.1 Update or remove `PageManagementDashboardParam` in `PageManagementParam.cs` (remove all filter properties)
- [x] 3.2 Update `IPageManagementRepository.cs` interface method signature to accept no parameters

## 4. Backend Application Layer
- [x] 4.1 Update `GetPageManagementDashboardQuery.cs` to remove all parameter properties
- [x] 4.2 Update `GetPageManagementDashboardHandler` to not map any parameters to the repository call

## 5. Backend WebApi Layer
- [x] 5.1 Update `GetPageManagementDashboardRequest` in `PageManagementModel.cs` to remove all properties (make it an empty record)
- [x] 5.2 Update `PageManagementEndPoint.cs` Summary method to not extract any parameters from request
- [x] 5.3 Remove MiniValidator validation call and ValidationProblem return type
- [x] 5.4 Update endpoint to create query without parameters

## 6. Frontend Types
- [x] 6.1 Update `GetPageManagementDashboardRequest` interface in `client-app/src/features/landing-page-cms/page-management/types/index.ts` to remove all optional properties (empty interface)

## 7. Frontend API Client
- [x] 7.1 Update `landingPageApi.getSummary()` in `client-app/src/features/landing-page-cms/page-management/api/client.ts` to not accept parameters
- [x] 7.2 Remove params from axios GET request

## 8. Frontend Query Hooks
- [x] 8.1 Update `useGetLandingPageSummary` hook in `client-app/src/features/landing-page-cms/page-management/api/queries.ts` to not accept parameters
- [x] 8.2 Update query key to not include params in key array
- [x] 8.3 Update queryFn to call API without parameters

## 9. Frontend Components
- [x] 9.1 Identify all components that call `useGetLandingPageSummary` (found: page-status-dashboard.tsx)
- [x] 9.2 Update component calls to not pass filter parameters
- [x] 9.3 Remove unused route import and parameter extraction code

## 10. Testing and Validation
- [x] 10.1 Run backend build: `dotnet build` (passed with 0 errors)
- [x] 10.2 Test API endpoint manually via Swagger or Postman to verify it works without parameters
- [x] 10.3 Run frontend type checking: `cd client-app && pnpm tsc --noEmit` (passed)
- [x] 10.4 Run frontend linting: `cd client-app && pnpm lint` (no errors in modified files)
- [x] 10.5 Test frontend dashboard page to verify it loads summary without sending parameters
- [x] 10.6 Verify response still returns correct structure: `{ errorCode, errorMessage, data: { total, draft, active, inactive } }`

## 11. Documentation
- [x] 11.1 No API documentation or Swagger comments present to update
- [x] 11.2 No specific documentation mentioning dashboard filters found
