# authentication Specification

## Purpose
TBD - created by archiving change enhance-sso-token-validation. Update Purpose after archive.
## Requirements
### Requirement: Cookie key constants must clearly distinguish internal and external tokens

The system MUST use cookie key names that clearly distinguish between internal ONEHub tokens and external authentication tokens. The naming convention should explicitly prefix internal tokens with `INTERNAL_` and external tokens with `EXTERNAL_`.

#### Scenario: Cookie constants use clear naming conventions

**Given** the system handles both internal ONEHub tokens and external authentication tokens

**And** the external authentication API uses terms "AuthToken" and "RefreshToken"

**When** defining cookie key constants

**Then**:
- MUST define `EXTERNAL_AUTH_TOKEN` constant with value `AuthToken` (external API's access token)
- MUST define `EXTERNAL_REFRESH_TOKEN` constant with value `RefreshToken` (external API's refresh token)
- MUST define `INTERNAL_ACCESS_TOKEN` constant with value `accessToken` (ONEHub's internal access token)
- MUST define `INTERNAL_REFRESH_TOKEN` constant with value `refreshToken` (ONEHub's internal refresh token)
- MUST remove or deprecate old `ACCESS_TOKEN` and `REFRESH_TOKEN` constants (replaced by `INTERNAL_*` variants)
- MUST remove or deprecate old `EXTERNAL_ACCESS_TOKEN` constant (replaced by `EXTERNAL_AUTH_TOKEN`)

**Implementation Note**: Update `Domain/Constants/CookieKeys.cs` with new naming convention. This breaking change improves code clarity by making it explicit whether a token is internal or external.

### Requirement: SSO endpoint must read external tokens from multiple cookie sources

The SSO endpoint MUST support reading external tokens from multiple cookie names to accommodate different external authentication system configurations.

#### Scenario: SSO reads external auth token from AuthToken cookie

**Given** an external authentication system stores auth token in `AuthToken` cookie

**When** a user requests `/api/auth/sso`

**Then** the endpoint:
- MUST read token from `AuthToken` cookie using `EXTERNAL_AUTH_TOKEN` constant
- MUST pass the token to `SsoCommand.ExternalAccessToken` property

**Implementation Note**: Update `AuthEndpoints.Sso()` method to use `CookieKeys.EXTERNAL_AUTH_TOKEN` constant.

#### Scenario: SSO reads external refresh token from RefreshToken cookie

**Given** an external authentication system stores refresh token in `RefreshToken` cookie

**When** a user requests `/api/auth/sso`

**Then** the endpoint:
- MUST read refresh token from `RefreshToken` cookie using `EXTERNAL_REFRESH_TOKEN` constant
- MUST pass the refresh token to `SsoCommand` if present
- MUST handle cases where refresh token is not provided (optional)

**Implementation Note**: Add `ExternalRefreshToken` property to `SsoCommand` and use `CookieKeys.EXTERNAL_REFRESH_TOKEN` constant.

### Requirement: External validation service must accept tokens via HTTP headers

The external authentication validation service integration MUST send tokens using standard HTTP headers to comply with the external API contract. The external API refers to the access token as "auth token" in its terminology.

#### Scenario: Validation request sends auth token in Authorization header

**Given** an external auth token (access token) needs validation

**When** calling the external validation API at `/api/auth/validate`

**Then**:
- MUST set `Authorization` header to `Bearer <token>` (where token is the auth token from external system)
- MUST send POST request to configured `ValidationApiUrl` (e.g., `https://external-service.com/api/auth/validate`)
- MUST include timeout from configuration (`TimeoutSeconds`)

**Implementation Note**: Update `ExternalAuthService.ValidateTokenAsync()` to set Authorization header. The external API endpoint is `/api/auth/validate` and it accepts the auth token via Authorization Bearer header.

#### Scenario: Validation request sends refresh token in X-Refresh-Token header

**Given** an external refresh token is provided

**When** calling the external validation API

**Then**:
- MUST set `X-Refresh-Token` header to the refresh token value
- MUST send both access and refresh tokens if both are available
- MUST handle validation even if refresh token is not provided

**Implementation Note**: Add optional `refreshToken` parameter to `ValidateTokenAsync()` method

### Requirement: External validation response must be parsed correctly

The system MUST correctly parse the external authentication service's validation response format to extract user information and validation status.

#### Scenario: Successful validation response is parsed

**Given** the external service returns validation response:
```json
{
  "code": 0,
  "message": "",
  "result": {
    "isValid": true,
    "userId": 3,
    "username": "starix1",
    "email": "starix1@example.com",
    "isAdmin": true,
    "hashPassword": "zzzzzz",
    "roles": [],
    "expiresAt": "2025-11-24T01:22:53Z",
    "issuedAt": "2025-11-24T01:07:53Z"
  }
}
```

**When** parsing the response

**Then**:
- MUST check `code` field equals 0 for success
- MUST check `result.isValid` equals true
- MUST extract `userId`, `username`, `email`, `isAdmin` from result
- MUST extract `roles` array (may be empty)
- MUST map to internal `User` entity
- MUST return `Result.Failure` if `code != 0` or `isValid != true`

**Implementation Note**: Update `ExternalValidationResponse` record and parsing logic in `ExternalAuthService`

#### Scenario: Failed validation response is handled

**Given** the external service returns error response with `code != 0` or `isValid = false`

**When** parsing the response

**Then**:
- MUST return `Result<User>.Failure(AuthError.InvalidToken)`
- MUST log the error message from response
- MUST NOT create user session

**Implementation Note**: Add error code checking before processing result

#### Scenario: Malformed response is handled gracefully

**Given** the external service returns malformed JSON or missing required fields

**When** parsing the response

**Then**:
- MUST catch deserialization exceptions
- MUST return `Result<User>.Failure(AuthError.InvalidToken)`
- MUST log parsing error details
- MUST NOT crash the application

**Implementation Note**: Add null checks and exception handling for response parsing

### Requirement: SSO command must support both access and refresh token validation

The SSO command handler MUST support validating both external access tokens and optional refresh tokens.

#### Scenario: SSO validates with access token only

**Given** only external access token is provided

**When** processing SSO command

**Then**:
- MUST validate access token via external service
- MUST generate new internal access and refresh tokens on success
- MUST store refresh token in cache
- MUST return tokens in response

**Implementation Note**: Current behavior - no changes needed

#### Scenario: SSO validates with both access and refresh tokens

**Given** both external access token and refresh token are provided

**When** processing SSO command

**Then**:
- MUST validate both tokens via external service
- MUST pass refresh token to validation service if available
- MUST generate new internal tokens on successful validation
- MUST handle cases where refresh token validation fails

**Implementation Note**: Update `SsoHandler` to pass refresh token to `ValidateTokenAsync()`

### Requirement: All existing code must use new cookie constant names

All existing code that references the old cookie key constants MUST be updated to use the new naming convention with `INTERNAL_` and `EXTERNAL_` prefixes.

#### Scenario: Authentication endpoints use new internal token constants

**Given** authentication endpoints set internal ONEHub tokens in cookies

**When** handling login, SSO, or token refresh operations

**Then**:
- MUST use `CookieKeys.INTERNAL_ACCESS_TOKEN` instead of `CookieKeys.ACCESS_TOKEN`
- MUST use `CookieKeys.INTERNAL_REFRESH_TOKEN` instead of `CookieKeys.REFRESH_TOKEN`
- MUST update all `SetCookie()`, `GetCookie()`, and `ClearCookie()` calls

**Implementation Note**: Update `AuthEndpoints.cs` methods: `Login()`, `Sso()`, `Refresh()`, `Logout()`

#### Scenario: Current user service uses new internal token constants

**Given** the current user service extracts user context from tokens

**When** reading tokens from HTTP context

**Then**:
- MUST use `CookieKeys.INTERNAL_REFRESH_TOKEN` instead of `CookieKeys.REFRESH_TOKEN`
- MUST update token extraction logic

**Implementation Note**: Update `CurrentUserService.cs` if it references old constants

#### Scenario: Cache keys use new internal token constants

**Given** refresh tokens are cached with user context

**When** building cache keys

**Then**:
- MUST use updated constant references in cache key construction
- MUST ensure cache key format remains consistent

**Implementation Note**: Verify cache key construction in handlers doesn't hardcode old constant values

### Requirement: SSO route must bypass automatic token refresh in AuthProvider

The `AuthProvider` component MUST NOT attempt automatic token refresh when users navigate to SSO routes. SSO authentication uses external tokens and handles its own authentication flow independently from internal token management.

#### Scenario: SSO route is treated as public route

**Given** a user navigates to `/sso?target=campaign-management`

**And** the user has no access token in localStorage

**When** the `AuthProvider` component mounts and runs initialization

**Then**:
- MUST detect the current path is `/sso`
- MUST treat `/sso` as a public route (like `/sign-in`, `/forgot-password`)
- MUST set `isLoading = false` without attempting token refresh
- MUST NOT call `/api/auth/refresh` endpoint
- MUST allow `SsoPage` component to handle authentication independently

**Implementation Note**: Add `/sso` to the `publicRoutes` array in `auth-provider.tsx` and skip `attemptTokenRefresh()` for public routes.

#### Scenario: SSO route bypasses refresh even with expired token

**Given** a user navigates to `/sso?target=campaign-management`

**And** the user has an expired or invalid access token in localStorage

**When** the `AuthProvider` component mounts and runs initialization

**Then**:
- MUST detect the current path is `/sso`
- MUST NOT attempt to refresh the expired token
- MUST NOT call `/api/auth/refresh` endpoint
- MUST set `isLoading = false` and allow SSO flow to proceed
- SSO authentication MUST replace expired token with new token from external auth

**Implementation Note**: Path detection happens before token refresh logic, so expired tokens are ignored on SSO routes.

#### Scenario: Normal routes still trigger token refresh

**Given** a user navigates to a protected route (e.g., `/campaign-management`)

**And** the user has no access token in localStorage

**When** the `AuthProvider` component mounts and runs initialization

**Then**:
- MUST detect the path is NOT a public route
- MUST attempt token refresh via `attemptTokenRefresh()`
- MUST call `/api/auth/refresh` endpoint
- On refresh failure, MUST redirect to `/sign-in` with redirect parameter
- Existing token refresh behavior MUST remain unchanged for non-SSO routes

**Implementation Note**: Ensure adding SSO to public routes doesn't affect normal authentication flow for protected routes.

#### Scenario: Public route list includes SSO

**Given** the `AuthProvider` initialization logic

**When** defining the list of public routes that don't require authentication

**Then**:
- MUST include `/sign-in` in public routes
- MUST include `/forgot-password` in public routes
- MUST include `/sso` in public routes
- Public route detection MUST use `startsWith()` to match paths with query parameters (e.g., `/sso?target=...`)

**Implementation Note**: Update the `publicRoutes` array constant in `initializeAuth()` function.

### Requirement: External authentication service must eliminate blanket exception handling

The external authentication service MUST remove blanket try-catch blocks and rely on Polly for resilience, allowing specific errors to be handled appropriately and improving debuggability.

#### Scenario: Polly handles transient failures instead of try-catch

**Given** the external service experiences network timeout

**When** calling `ValidateTokenAsync()`

**Then**:
- MUST allow Polly policy to catch and retry `TaskCanceledException`
- MUST NOT wrap entire method in try-catch block
- MUST allow transient exceptions to be handled by Polly middleware
- MUST return `Result<User>.Failure(AuthError.InvalidToken)` only after Polly retries exhausted

#### Scenario: JSON deserialization errors are handled specifically

**Given** the external service returns malformed JSON response

**When** parsing the validation or refresh response

**Then**:
- MUST catch `JsonException` specifically at deserialization point
- MUST log the parsing error with response content for debugging
- MUST return `Result<User>.Failure(AuthError.InvalidToken)`
- MUST NOT use blanket `catch (Exception)` that masks root cause

#### Scenario: Null response validation is explicit

**Given** the external service returns null or invalid response structure

**When** validating the parsed response

**Then**:
- MUST check for null response explicitly (not via exception catching)
- MUST check for null result object explicitly
- MUST check for invalid code values explicitly
- MUST return appropriate failure result without throwing exceptions
- MUST log specific validation failure reason for debugging

#### Scenario: HTTP client exceptions bubble up to Polly

**Given** the HTTP request fails with `HttpRequestException`

**When** calling `ValidateTokenAsync()` or `RefreshTokenAsync()`

**Then**:
- MUST NOT catch `HttpRequestException` in method body
- MUST allow exception to bubble up to Polly policy handler
- MUST let Polly determine whether to retry based on exception type
- MUST only handle business logic errors (invalid response structure, validation failures) in method

### Requirement: External auth service must return complete user data including password hash

The external authentication validation service MUST map all user data from the external API response to the internal User entity, including the password hash for future local authentication scenarios.

#### Scenario: User entity includes password hash from external auth

**Given** the external validation API returns successful response with user data

**And** the response includes `hashPassword` field (bcrypt hash)

**When** mapping external validation result to internal User entity

**Then**:
- MUST set `User.PasswordHash` to `resultData.HashPassword` value
- MUST NOT set `User.PasswordHash` to empty string
- MUST preserve the bcrypt hash exactly as received
- MUST return User with complete data including UserId, UserName, Roles, Avatar, IsAdmin, PasswordHash

**Implementation Note**: Update `ExternalAuthService.ValidateTokenAsync()` line 73 from `PasswordHash = string.Empty` to `PasswordHash = resultData.HashPassword`

**Related**: This enables SSO user data persistence in subsequent requirement

---

### Requirement: SSO login must automatically sync user data to database

The SSO authentication flow MUST persist validated user data to the local database, creating new users or updating existing users based on the external auth UserId. This ensures SSO users have persistent records for auditing, user management, and future feature support.

#### Scenario: New SSO user is created in database

**Given** a user authenticates via SSO with external tokens

**And** external auth validation succeeds

**And** the user does not exist in the local database (checked by UserId)

**When** processing the SSO command

**Then**:
- MUST call `IAuthRepository.CreateUserAsync()` with user data from external auth
- MUST map User entity to CreateUserParam with all fields (UserName, PasswordHash, IsAdmin, Roles, Avatar)
- MUST pass UserId, Ip, Host from command context
- MUST create user record in database via `OH_UserInfo_Ins` stored procedure
- MUST continue with JWT token generation after user creation
- MUST return SSO response with tokens even if user creation fails

**Implementation Note**: Add `IAuthRepository` injection to `SsoHandler` and call `CreateUserAsync()` after `ValidateTokenAsync()` succeeds

#### Scenario: Existing SSO user is updated in database

**Given** a user authenticates via SSO with external tokens

**And** external auth validation succeeds

**And** the user already exists in the local database (same UserId)

**When** processing the SSO command

**Then**:
- MUST call `IAuthRepository.CreateUserAsync()` with updated user data
- MUST update UserName, PasswordHash, IsAdmin, Roles, Avatar fields
- MUST let stored procedure handle update logic (upsert behavior)
- MUST continue with JWT token generation after update
- MUST return SSO response with tokens even if update fails

**Implementation Note**: The `OH_UserInfo_Ins` stored procedure is assumed to handle both insert and update based on UserId presence

#### Scenario: User sync failure does not block SSO login

**Given** a user authenticates via SSO with external tokens

**And** external auth validation succeeds

**And** user data sync to database fails (e.g., database unavailable, SP error)

**When** processing the SSO command

**Then**:
- MUST catch user sync exceptions
- MUST log the sync error with appropriate details
- MUST continue with JWT token generation despite sync failure
- MUST return SSO response with tokens successfully
- MUST NOT throw exception or return error result to user

**Implementation Note**: Wrap `CreateUserAsync()` in try-catch, log errors, but always proceed with token generation for graceful degradation

**Rationale**: SSO authentication should not fail due to database issues. User can authenticate and access the system even if persistence temporarily fails.

#### Scenario: User data mapping includes all available fields

**Given** the external auth service returns validated user data

**When** mapping to CreateUserParam for database sync

**Then**:
- MUST map `UserId` from validated user
- MUST map `UserName` from validated user
- MUST map `PasswordHash` from validated user (bcrypt hash)
- MUST map `IsAdmin` from validated user
- MUST map `Roles` from validated user (string format)
- MUST map `Avatar` from validated user
- MUST map `Ip` from SSO command context (auto-injected via BaseCommand)
- MUST map `Host` from SSO command context (auto-injected via BaseCommand)
- MUST NOT map `Email` field (not supported by CreateUserParam and SP)

**Implementation Note**: Build CreateUserParam with complete user data from validation result and command context

---

