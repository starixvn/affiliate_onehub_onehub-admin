# pagebuilder-dashboard Specification

## Purpose
Provides a dashboard summary endpoint that displays all-time aggregate statistics for PageBuilder entities without any filtering parameters.
## Requirements
### Requirement: Dashboard Summary Data Retrieval

The system SHALL provide a parameterless endpoint to retrieve PageBuilder dashboard summary statistics showing all-time aggregate counts.

#### Scenario: Get all-time dashboard summary

- **WHEN** a user requests the PageBuilder dashboard summary
- **THEN** the system returns aggregate counts without requiring any filter parameters
- **AND** the response includes Total, Draft, Active, and Inactive page builder counts

#### Scenario: No filters applied

- **WHEN** the dashboard summary endpoint is called
- **THEN** the system calculates statistics across all time periods
- **AND** the system ignores any query parameters that may be sent

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

