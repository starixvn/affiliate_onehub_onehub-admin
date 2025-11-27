# Specification: Link Generator

## Overview
The Link Generator capability provides a form-based interface for creating trackable marketing links with comprehensive targeting, tracking parameters, and domain management.

## Requirements

### Requirement: Generate Link Form Structure
The system SHALL provide a multi-section form for creating trackable links with basic information, landing page targeting, and marketing component configuration.

#### Scenario: Form displays all required sections
- **GIVEN** a user navigates to the link generator
- **WHEN** the form loads
- **THEN** the basic information section is displayed
- **AND** the landing page and targeting section is displayed
- **AND** the marketing components section is displayed

#### Scenario: Form fields are disabled after generation
- **GIVEN** a link has been successfully generated
- **WHEN** the generated result is displayed
- **THEN** all form fields become disabled
- **AND** users cannot modify the form until reset

### Requirement: Basic Information Section
The system SHALL collect link name and optional identifier code in the basic information section.

#### Scenario: Link name is required
- **GIVEN** a user attempts to generate a link
- **WHEN** the link name field is empty
- **THEN** validation error "Link name is required" is displayed
- **AND** link generation is prevented

#### Scenario: Link name has maximum length
- **GIVEN** a user enters a link name
- **WHEN** the name exceeds 200 characters
- **THEN** validation error is displayed
- **AND** input is limited to 200 characters

#### Scenario: Identifier code is alphanumeric only
- **GIVEN** a user enters an identifier code
- **WHEN** non-alphanumeric characters are entered
- **THEN** validation error "Identifier code must contain only letters and numbers" is displayed
- **AND** link generation is prevented

### Requirement: Landing Page Cascade Selection
The system SHALL auto-populate campaign, country, page type, and page code when a landing page is selected.

#### Scenario: Landing page populates campaign
- **GIVEN** a user selects a landing page
- **WHEN** the landing page has an associated campaign ID
- **THEN** the campaign field is auto-populated with the campaign ID
- **AND** the campaign code field is set

#### Scenario: Landing page populates country
- **GIVEN** a user selects a landing page
- **WHEN** the landing page has a target country code
- **THEN** the country field is auto-populated
- **AND** the language field is reset to empty
- **AND** language options are fetched for the new country

#### Scenario: Landing page sets page type and code
- **GIVEN** a user selects a landing page
- **WHEN** the landing page has page type and page code
- **THEN** both hidden fields are set with the values

#### Scenario: Landing page cleared resets dependent fields
- **GIVEN** a landing page was previously selected
- **WHEN** the user clears the landing page selection
- **THEN** page type is reset to 0
- **AND** page code is reset to empty string

### Requirement: Country-Dependent Language Fetching
The system SHALL fetch and display available languages when a country is selected.

#### Scenario: Country selection fetches languages
- **GIVEN** a user selects a country
- **WHEN** the country has associated languages
- **THEN** languages are fetched from the API using the country code
- **AND** the language dropdown is populated with available options

#### Scenario: First language auto-selected
- **GIVEN** languages have been fetched for a country
- **WHEN** no language is currently selected
- **AND** at least one language is available
- **THEN** the first language is automatically selected
- **AND** both language code and shorted language code fields are set

#### Scenario: Existing language preserved
- **GIVEN** a user has manually selected a language
- **WHEN** languages are re-fetched
- **THEN** the existing selection is preserved
- **AND** auto-selection is skipped

#### Scenario: Country change clears language
- **GIVEN** a user changes the country selection
- **WHEN** a new country is selected
- **THEN** the language field is reset to empty
- **AND** the shorted language code field is reset
- **AND** new languages are fetched for the new country

### Requirement: Landing Page Market Language Sync
The system SHALL auto-select language when landing page has a market ID that matches available languages.

#### Scenario: Market ID matches language
- **GIVEN** a landing page with market ID is selected
- **WHEN** languages are available for the country
- **AND** a language exists with matching language code
- **THEN** both language and shorted language code are set from the matched language

#### Scenario: Market ID has no matching language
- **GIVEN** a landing page with market ID is selected
- **WHEN** no language matches the market ID
- **THEN** language fields are set to empty strings

### Requirement: Domain Type Selection
The system SHALL fetch appropriate domains based on country and page type.

#### Scenario: Full link domain type determination
- **GIVEN** a user has selected a country and landing page
- **WHEN** the landing page page type is 3
- **THEN** domain type 0 is used for full link domain query
- **WHEN** the landing page page type is not 3
- **THEN** domain type 1 is used for full link domain query

#### Scenario: Short link domain type
- **GIVEN** domain queries are executed
- **WHEN** fetching short link domains
- **THEN** domain type 2 is always used

### Requirement: Country-Dependent Domain Fetching
The system SHALL fetch full link and short link domains based on selected country and domain type.

#### Scenario: Country selection fetches domains
- **GIVEN** a user selects a country
- **WHEN** the country code is valid
- **THEN** full link domains are fetched with determined domain type
- **AND** short link domains are fetched with domain type 2
- **AND** both domain dropdowns are populated

#### Scenario: Available domains count displayed
- **GIVEN** domains have been fetched
- **WHEN** displaying the domain name field
- **THEN** the count of available domains is shown in green text
- **AND** the text format is "X available domain(s)"

### Requirement: First Domain Auto-Selection
The system SHALL automatically select the first domain when domains become available.

#### Scenario: First full domain auto-selected
- **GIVEN** full link domains have been fetched
- **WHEN** no domain is currently selected
- **AND** at least one domain is available
- **THEN** the first domain's domainName is auto-selected

#### Scenario: First short domain auto-selected
- **GIVEN** short link domains have been fetched
- **WHEN** no short domain is currently selected
- **AND** at least one short domain is available
- **THEN** the first short domain's domainName is auto-selected

#### Scenario: Existing domain preserved
- **GIVEN** a user has manually selected a domain
- **WHEN** domains are re-fetched
- **THEN** the existing selection is preserved
- **AND** auto-selection is skipped

### Requirement: Domain Selection with Scoring
The system SHALL display domain score alongside domain name in the dropdown.

#### Scenario: Domain displayed with score
- **GIVEN** domain options are rendered
- **WHEN** formatting the option label
- **THEN** the format is "domainName --- (Score: score)"

### Requirement: Domain Reserved Note
The system SHALL require a domain reserved note when selecting a full link domain.

#### Scenario: Reserved note is required
- **GIVEN** a user attempts to generate a link
- **WHEN** the domain reserved note is empty
- **THEN** validation error "Domain reserved note is required" is displayed
- **AND** link generation is prevented

#### Scenario: Reserved note has maximum length
- **GIVEN** a user enters a domain reserved note
- **WHEN** the note exceeds 200 characters
- **THEN** validation error is displayed
- **AND** input is limited to 200 characters

### Requirement: Short Link Custom Path
The system SHALL allow optional custom short path with specific format requirements.

#### Scenario: Short path is optional
- **GIVEN** a user is filling the form
- **WHEN** short path is left empty
- **THEN** no validation error is shown
- **AND** link can be generated without custom path

#### Scenario: Short path minimum length
- **GIVEN** a user enters a short path value
- **WHEN** the value is less than 5 characters
- **THEN** validation error "Short path must be at least 5 characters" is displayed

#### Scenario: Short path maximum length
- **GIVEN** a user enters a short path
- **WHEN** the value exceeds 20 characters
- **THEN** input is limited to 20 characters

#### Scenario: Short path format validation
- **GIVEN** a user enters a short path
- **WHEN** characters outside of [a-z0-9\-.] are entered
- **THEN** validation error "Short path must contain only lowercase letters, numbers, hyphens, and dots" is displayed

### Requirement: Event Multi-Selection with Code Computation
The system SHALL allow multiple event selection and automatically compute event codes.

#### Scenario: Multiple events selected
- **GIVEN** a user selects multiple events
- **WHEN** event IDs are comma-separated string
- **THEN** event codes are computed by mapping each ID to its component code
- **AND** the eventCodes field is set to comma-separated codes

#### Scenario: Event selection cleared
- **GIVEN** events were previously selected
- **WHEN** all events are deselected
- **THEN** eventCodes field is set to empty string

#### Scenario: Event not found in list
- **GIVEN** a user has selected events
- **WHEN** an event ID has no matching component
- **THEN** that ID is filtered out from the codes list
- **AND** only valid codes are included

### Requirement: Component Selection with Code Sync
The system SHALL auto-populate component code fields when group, channel, agency, or type is selected.

#### Scenario: Group selection sets code
- **GIVEN** a user selects a group
- **WHEN** the group option has a component code
- **THEN** the groupCode field is automatically set

#### Scenario: Channel selection sets code
- **GIVEN** a user selects a channel
- **WHEN** the channel option has a component code
- **THEN** the channelCode field is automatically set

#### Scenario: Agency selection sets code
- **GIVEN** a user selects an agency
- **WHEN** the agency option has a component code
- **THEN** the agencyCode field is automatically set

#### Scenario: Type selection sets code
- **GIVEN** a user selects a type
- **WHEN** the type option has a component code
- **THEN** the typeCode field is automatically set

### Requirement: Create New Component Dialog Integration
The system SHALL provide "Create New" buttons in component dropdowns that open corresponding creation dialogs.

#### Scenario: Campaign create dialog opens
- **GIVEN** a user clicks "Create New" in campaign dropdown
- **WHEN** the button is clicked
- **THEN** campaign creation dialog opens
- **AND** form remains in background

#### Scenario: Event create dialog opens
- **GIVEN** a user clicks "Create New" in event dropdown
- **WHEN** the button is clicked
- **THEN** event creation dialog opens

#### Scenario: Group create dialog opens
- **GIVEN** a user clicks "Create New" in group dropdown
- **WHEN** the button is clicked
- **THEN** group creation dialog opens

#### Scenario: Channel create dialog opens
- **GIVEN** a user clicks "Create New" in channel dropdown
- **WHEN** the button is clicked
- **THEN** channel creation dialog opens

#### Scenario: Agency create dialog opens
- **GIVEN** a user clicks "Create New" in agency dropdown
- **WHEN** the button is clicked
- **THEN** agency creation dialog opens

#### Scenario: Type create dialog opens
- **GIVEN** a user clicks "Create New" in type dropdown
- **WHEN** the button is clicked
- **THEN** type creation dialog opens

### Requirement: Campaign Selection with Code Display
The system SHALL display campaign code alongside campaign name in the dropdown.

#### Scenario: Campaign option formatted
- **GIVEN** campaign options are rendered
- **WHEN** formatting the option label
- **THEN** the format is "campaignCode | campaignName"

### Requirement: Optional Note Field
The system SHALL provide an optional note field with maximum length.

#### Scenario: Note is optional
- **GIVEN** a user is filling the form
- **WHEN** note field is left empty
- **THEN** no validation error is shown
- **AND** link can be generated without note

#### Scenario: Note maximum length
- **GIVEN** a user enters a note
- **WHEN** the note exceeds 500 characters
- **THEN** input is limited to 500 characters

### Requirement: Form Validation and Required Fields
The system SHALL enforce validation rules on all required fields before allowing link generation.

#### Scenario: All required fields validated
- **GIVEN** a user attempts to generate a link
- **WHEN** any required field is missing or invalid
- **THEN** validation errors are displayed for all invalid fields
- **AND** link generation is prevented
- **AND** the first invalid field is focused

### Requirement: Short Link Path Tooltip
The system SHALL provide a tooltip explaining the short link custom path feature.

#### Scenario: Tooltip displayed on icon hover
- **GIVEN** the short link custom path field is rendered
- **WHEN** user hovers over the info icon
- **THEN** tooltip is displayed explaining the short path feature

## Field Dependencies

### Dependency Chain Overview
```text
Landing Page
├─> Campaign (auto-fill)
├─> Country (auto-fill)
│   ├─> Languages (API fetch)
│   │   └─> First Language (auto-select if none selected)
│   └─> Domains (API fetch by country + page type)
│       └─> First Domain (auto-select if none selected)
├─> Page Type (hidden, affects domain query)
├─> Page Code (hidden)
└─> Market ID
    └─> Language (match and auto-select if found)

Country (manual selection)
├─> Language (reset)
├─> Shorted Language Code (reset)
├─> Languages (API fetch)
└─> Domains (API fetch)

Event (multi-select)
└─> Event Codes (computed from IDs)

Group/Channel/Agency/Type (single select)
└─> Corresponding Code (auto-fill)
```

### API Dependencies
- **useGetLanguages(countryCode)**: Triggered by country selection or landing page country change
- **useGetDomains(countryCode, domainType)**: Triggered by country selection with domain type determined by page type
- **useGetDomains(countryCode, 2)**: Triggered for short link domains independently

## Implementation Notes

### File Location
`client-app/src/features/link-generator/generate-link/components/generate-link-form.tsx`

### Form State Management
- Uses React Hook Form with Zod validation schema
- Uses `useWatch` to observe country and event changes for cascade effects
- Uses local `useState` for landing page selection tracking

### Effect Dependencies
Six `useEffect` hooks manage cascading updates:
1. Event IDs → Event Codes computation
2. Landing Page Market ID → Language sync
3. Languages available → First language auto-selection
4. Domains available → First full domain auto-selection
5. Short domains available → First short domain auto-selection
6. Country change clears language

### Auto-Selection Guards
All auto-selection effects check if a value already exists before setting:
- Language: `if (!currentLanguage || !currentShortedLanguageCode)`
- Domain: `if (currentDomain) return`
- Short Domain: `if (currentShortDomain) return`

This prevents overwriting user selections when data refetches.

## Related Capabilities
- Component Management: Provides creation dialogs for campaign, event, group, channel, agency, type
- Link Management: Displays and manages generated links

