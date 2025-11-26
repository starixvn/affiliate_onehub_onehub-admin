# pagebuilder-dashboard Specification

## Purpose
Provides a dashboard summary endpoint that displays all-time aggregate statistics for PageBuilder entities without any filtering parameters.
## Requirements
### Requirement: Page Management Date Range Filtering

The system SHALL provide date range filtering for page management with preset support that persists across navigation and form submissions.

#### Scenario: Apply "Entire Period" preset and submit form

- **WHEN** user selects "Entire Period" date preset
- **AND** user submits the search form
- **THEN** the system SHALL preserve the "Entire Period" selection after navigation
- **AND** the date range SHALL display "Entire Period" label
- **AND** the actual date range SHALL span from minimum date to maximum date

#### Scenario: "Entire Period" preset disabled when search is empty

- **WHEN** the search text input is empty
- **THEN** the "Entire Period" preset SHALL be disabled and not selectable
- **AND** clicking on "Entire Period" SHALL have no effect

#### Scenario: "Entire Period" preset enabled when search has text

- **WHEN** user types any text into the search input field
- **THEN** the "Entire Period" preset SHALL be enabled and selectable
- **AND** user can click to select the "Entire Period" preset
- **AND** the preset selection SHALL persist when submitting the form with search text

#### Scenario: Manual date range selection clears preset

- **WHEN** user manually selects a custom date range via calendar
- **AND** user submits the search form
- **THEN** the system SHALL clear any preset selection
- **AND** the date range SHALL display the specific date range selected
- **AND** no preset SHALL be highlighted

#### Scenario: Preset state persists across page reload

- **WHEN** user selects any date preset
- **AND** user submits the form
- **AND** user reloads the page or navigates back
- **THEN** the system SHALL restore the selected preset
- **AND** the date range SHALL match the preset's defined range
- **AND** the preset SHALL be visually indicated as selected

#### Scenario: Reset filters clears preset

- **WHEN** user has an active date preset selected
- **AND** user clicks the "Reset" button
- **THEN** the system SHALL clear the preset selection
- **AND** the date range SHALL revert to default (first day of current month to today)
- **AND** no preset SHALL be highlighted

### Requirement: Page Management Filter API Response Structure

The system SHALL provide consistent date boundary properties in the filter API response with clear naming conventions that distinguish between date range boundaries and default values.

#### Scenario: Retrieve filter configuration

- **WHEN** frontend requests page management filters from `/api/page-management/filters`
- **THEN** the system SHALL return a response containing:
  - `minDate` (DateTime) - minimum selectable date (2 years ago from today)
  - `maxDate` (DateTime) - maximum selectable date (today)
  - `defaultFromDate` (DateTime) - default start date for filtering (first day of current month)
  - `defaultToDate` (DateTime) - default end date for filtering (today)
  - `landingPageUrl` (string) - base URL for landing pages
  - `targetCountries` (array) - available country options
  - `languages` (array) - available language options
  - `statusInfos` (array) - available status options
- **AND** all date properties SHALL use consistent camelCase naming
- **AND** `minDate` SHALL be calculated as today minus 2 years
- **AND** `maxDate` SHALL be equal to today's date

#### Scenario: Date range boundaries for calendar widget

- **WHEN** frontend displays the date range picker calendar
- **THEN** the system SHALL use `minDate` to disable dates before 2 years ago
- **AND** the system SHALL use `maxDate` to disable dates after today
- **AND** the "Entire Period" preset SHALL use `minDate` to `maxDate` range

#### Scenario: Default date range initialization

- **WHEN** user visits page management for the first time without URL parameters
- **THEN** the system SHALL initialize date range with `defaultFromDate` to `defaultToDate`
- **AND** `defaultFromDate` SHALL be the first day of current month
- **AND** `defaultToDate` SHALL be today's date

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

