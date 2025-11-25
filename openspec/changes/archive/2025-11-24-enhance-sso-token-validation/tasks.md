# Implementation Tasks

## Backend - Domain Layer

- [x] Update `CookieKeys.cs` with new naming convention
  - [x] Add `INTERNAL_ACCESS_TOKEN` constant with value `accessToken` (ONEHub internal token)
  - [x] Add `INTERNAL_REFRESH_TOKEN` constant with value `refreshToken` (ONEHub internal token)
  - [x] Add `EXTERNAL_AUTH_TOKEN` constant with value `AuthToken` (external API's access token)
  - [x] Add `EXTERNAL_REFRESH_TOKEN` constant with value `RefreshToken` (external API's refresh token)
  - [x] Remove old `ACCESS_TOKEN` constant (replaced by `INTERNAL_ACCESS_TOKEN`)
  - [x] Remove old `REFRESH_TOKEN` constant (replaced by `INTERNAL_REFRESH_TOKEN`)
  - [x] Remove old `EXTERNAL_ACCESS_TOKEN` constant (replaced by `EXTERNAL_AUTH_TOKEN`)

## Backend - Infrastructure Layer

- [x] Update `ExternalValidationResponse` record to match external service format
  - [x] Add `Code` property (int)
  - [x] Add `Message` property (string)
  - [x] Wrap existing fields in `Result` nested record
  - [x] Add `IsValid` property to result
  - [x] Add `Email` property to result
  - [x] Add `HashPassword` property to result
  - [x] Add `ExpiresAt` and `IssuedAt` datetime properties to result
- [x] Update `ExternalAuthService.ValidateTokenAsync()` signature
  - [x] Add optional `refreshToken` parameter (string?)
  - [x] Update method to accept both access and refresh tokens
- [x] Update token validation HTTP request in `ExternalAuthService`
  - [x] Set `Authorization` header to `Bearer <accessToken>`
  - [x] Set `X-Refresh-Token` header if refresh token provided
  - [x] Keep POST request to `ValidationApiUrl`
- [x] Update response parsing in `ExternalAuthService`
  - [x] Check `Code == 0` for success
  - [x] Check `Result.IsValid == true` for valid token
  - [x] Extract user info from nested `Result` object
  - [x] Add null checks for all required fields
  - [x] Return `AuthError.InvalidToken` if validation fails
  - [x] Add exception handling for malformed responses
- [x] Map external validation result to internal `User` entity
  - [x] Map `userId`, `username`, `email`, `isAdmin`, `roles`
  - [x] Handle empty roles array

## Backend - Application Layer

- [x] Update `SsoCommand` class
  - [x] Add `ExternalRefreshToken` property (string, nullable)
  - [x] Keep existing `ExternalAccessToken` property
- [x] Update `SsoHandler.Handle()` method
  - [x] Pass both access and refresh tokens to `ValidateTokenAsync()`
  - [x] Handle validation results for both tokens
  - [x] Generate internal tokens on successful validation

## Backend - WebApi Layer

- [x] Update `AuthEndpoints.Login()` method
  - [x] Replace `CookieKeys.ACCESS_TOKEN` with `CookieKeys.INTERNAL_ACCESS_TOKEN`
  - [x] Replace `CookieKeys.REFRESH_TOKEN` with `CookieKeys.INTERNAL_REFRESH_TOKEN`
  - [x] Update `SetCookie()` calls with new constants
- [x] Update `AuthEndpoints.Sso()` method
  - [x] Read from `AuthToken` cookie using `CookieKeys.EXTERNAL_AUTH_TOKEN` constant
  - [x] Read from `RefreshToken` cookie using `CookieKeys.EXTERNAL_REFRESH_TOKEN` constant
  - [x] Pass both tokens to `SsoCommand` (ExternalAccessToken and ExternalRefreshToken properties)
  - [x] Set internal tokens using `CookieKeys.INTERNAL_ACCESS_TOKEN` and `CookieKeys.INTERNAL_REFRESH_TOKEN`
  - [x] Handle cases where only auth token is present (refresh token is optional)
- [x] Update `AuthEndpoints.Refresh()` method
  - [x] Replace `CookieKeys.REFRESH_TOKEN` with `CookieKeys.INTERNAL_REFRESH_TOKEN` for reading cookie
  - [x] Replace `CookieKeys.ACCESS_TOKEN` with `CookieKeys.INTERNAL_ACCESS_TOKEN` for setting new token
- [x] Update `AuthEndpoints.Logout()` method
  - [x] Replace `CookieKeys.REFRESH_TOKEN` with `CookieKeys.INTERNAL_REFRESH_TOKEN`
  - [x] Replace `CookieKeys.ACCESS_TOKEN` with `CookieKeys.INTERNAL_ACCESS_TOKEN`
  - [x] Update `ClearCookie()` calls with new constants

## Other Code Updates

- [x] Update `CurrentUserService.cs` if it references old cookie constants
- [x] Search codebase for any other references to old constants
  - [x] Search for `CookieKeys.ACCESS_TOKEN` and replace with `CookieKeys.INTERNAL_ACCESS_TOKEN`
  - [x] Search for `CookieKeys.REFRESH_TOKEN` and replace with `CookieKeys.INTERNAL_REFRESH_TOKEN`
  - [x] Search for `CookieKeys.EXTERNAL_ACCESS_TOKEN` and replace with `CookieKeys.EXTERNAL_AUTH_TOKEN`
- [x] Verify cache key construction uses correct constants
- [x] Update any hardcoded string references to cookie names

## Testing & Validation

- [x] Test login flow with new internal cookie constants
- [x] Test SSO flow with `AuthToken` cookie only
- [x] Test SSO flow with both `AuthToken` and `RefreshToken` cookies
- [x] Test refresh token flow with new internal constants
- [x] Test logout flow with new internal constants
- [x] Test error handling for invalid tokens
- [x] Test error handling for malformed external service responses
- [x] Test external service timeout scenarios
- [x] Verify internal token generation after successful validation
- [x] Verify user session creation with correct user info
- [x] Test with external service returning `code != 0`
- [x] Test with external service returning `isValid = false`
- [x] Verify all cookie operations use new constant names

## Documentation

- [x] Update API documentation if needed
- [x] Update configuration examples if needed
- [x] Add comments for external response format expectations

## Notes

- **Breaking Change**: This change renames cookie constants for clarity. All code referencing old constants must be updated.
- **Terminology**: External API uses "AuthToken" to mean access token
- **New Naming Convention**:
  - `INTERNAL_*` prefix for ONEHub's own tokens
  - `EXTERNAL_*` prefix for tokens from external authentication system
- Cookie values remain the same (e.g., `accessToken`, `AuthToken`) - only constant names change
- All changes follow Result pattern (no exceptions for business errors)
- External service response format must match specification: `{ code, message, result: { isValid, userId, ... } }`
- External validation endpoint is `POST /api/auth/validate` on the external service
- Refresh token is optional - system should work with auth token (access token) only
