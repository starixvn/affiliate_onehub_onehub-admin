# pagebuilder-dashboard Spec Delta

## REMOVED Requirements

### Requirement: Dashboard Summary Data Retrieval

**Removed**: The system SHALL provide a parameterless endpoint to retrieve PageBuilder dashboard summary statistics showing all-time aggregate counts.

**Reason**: Dashboard data is now returned inline with the paginated list query to reduce API calls and improve performance.

**Migration**: Frontend should consume dashboard from `GET /api/page-management` response `data.dashboard` property instead of calling `GET /api/page-management/summary`.

## ADDED Requirements

### Requirement: Dashboard Summary with Paginated List

The system SHALL provide dashboard summary statistics as part of the page management list query response, eliminating the need for a separate endpoint.

#### Scenario: Get dashboard with paginated list

- **WHEN** a user requests the PageBuilder list via `GET /api/page-management`
- **THEN** the system returns both paginated results AND dashboard summary in a single response
- **AND** the response includes a `dashboard` property with Total, Draft, Active, and Inactive page builder counts
- **AND** the dashboard counts reflect the current filter criteria applied to the list

#### Scenario: Dashboard reflects filtered dataset

- **WHEN** the list query includes filter parameters (search, status, date range, country, language)
- **THEN** the dashboard aggregates SHALL be calculated from the same filtered dataset
- **AND** the dashboard counts SHALL match the total counts of the filtered results by status

#### Scenario: Export endpoint includes dashboard

- **WHEN** a user requests the export endpoint with `IsExportExcel=true`
- **THEN** the system returns dashboard data alongside the export data
- **AND** the frontend MAY ignore the dashboard data for export operations

### Requirement: Combined Paging and Dashboard Response Structure

The system SHALL return dashboard data as part of the paginated list response using a type-safe generic structure `PagingDataWithDashboard<T, TDashboard>` that includes both items and dashboard metadata.

#### Scenario: Response structure includes dashboard property

- **WHEN** the list endpoint returns data
- **THEN** the response SHALL follow the structure:
```json
{
  "errorCode": 0,
  "errorMessage": "",
  "data": {
    "items": [],
    "totalItem": 0,
    "pageIndex": 1,
    "pageSize": 20,
    "dashboard": {
      "total": 0,
      "draft": 0,
      "active": 0,
      "inactive": 0
    }
  }
}
```
- **AND** all properties SHALL be present even if values are zero
- **AND** the response type SHALL be `Result<PagingDataWithDashboard<LandingPageResponse, PageManagementDashboardResponse>>`

#### Scenario: Type safety with generic dashboard

- **WHEN** the system uses `PagingDataWithDashboard<T, TDashboard>`
- **THEN** `T` SHALL represent the data item type (e.g., `LandingPage`, `LandingPageResponse`)
- **AND** `TDashboard` SHALL represent the dashboard model type (e.g., `PageManagementDashboard`, `PageManagementDashboardResponse`)
- **AND** `TDashboard` SHALL have a `new()` constraint to ensure safe instantiation
- **AND** the pattern SHALL be reusable for other features with different dashboard types

### Requirement: Multiple Result Set Database Query

The system SHALL execute a single stored procedure that returns multiple result sets for paging data and dashboard aggregates.

#### Scenario: Stored procedure returns two result sets

- **WHEN** `OH_PageBuilder_ManageSel` stored procedure executes
- **THEN** the first result set SHALL contain paginated landing page records
- **AND** the second result set SHALL contain a single row with dashboard aggregates (TotalPageBuilders, DraftPageBuilders, ActivePageBuilders, InactivePageBuilders)
- **AND** both result sets SHALL be derived from the same filtered `#Data` temp table

#### Scenario: Repository handles multiple result sets

- **WHEN** the repository calls `FetchPagingDataWithDashboardAsync<LandingPage, PageManagementDashboard>`
- **THEN** the system SHALL use `IDynamicRepository.FetchMultipleAsync<T1, T2>` to consume both result sets
- **AND** the system SHALL populate `PagingDataWithDashboard<T, TDashboard>` with items from the first result set and dashboard from the second result set
- **AND** the paging metadata (TotalItem, PageIndex, PageSize) SHALL be populated from the `@NRows` output parameter
- **AND** if the dashboard result set is empty, the system SHALL instantiate a new `TDashboard` instance using the default constructor

### Requirement: Endpoint Consolidation

The system SHALL provide page management list and dashboard data through a single API endpoint.

#### Scenario: Summary endpoint removed

- **WHEN** a client attempts to call `GET /api/page-management/summary`
- **THEN** the endpoint SHALL NOT exist and return 404 Not Found
- **AND** clients SHALL use `GET /api/page-management` to retrieve dashboard data

#### Scenario: List endpoint returns dashboard

- **WHEN** a client calls `GET /api/page-management` with query parameters
- **THEN** the response SHALL include both paginated items and dashboard summary
- **AND** the dashboard SHALL be calculated based on the same filters as the list query
