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

