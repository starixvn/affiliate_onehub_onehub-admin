# PageBuilder Dashboard Specification Delta

## ADDED Requirements

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
