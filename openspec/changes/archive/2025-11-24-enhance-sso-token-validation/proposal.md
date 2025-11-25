# Enhance SSO Token Validation

## Problem Statement

Currently, the SSO authentication flow has several limitations:

1. **Unclear Cookie Constant Naming**: The current constants (`ACCESS_TOKEN`, `REFRESH_TOKEN`, `EXTERNAL_ACCESS_TOKEN`) don't clearly distinguish between internal ONEHub tokens and external authentication tokens, leading to potential confusion.

2. **Limited External Token Support**: Only retrieves external access tokens from `externalAccessToken` cookie. The external authentication service's `/api/auth/validate` endpoint uses different terminology:
   - External API uses `AuthToken` cookie name (not `externalAccessToken`)
   - External API uses `RefreshToken` cookie name
   - External API accepts tokens via HTTP headers (`Authorization: Bearer` and `X-Refresh-Token`)

3. **Incomplete Token Validation**: Doesn't support validating both external access and refresh tokens together.

4. **Response Format Mismatch**: Current parsing doesn't handle the external service's full response format with validation status and detailed user information.

## Proposed Solution

Refactor cookie constants and enhance SSO validation flow:

1. **Clear Naming Convention**: Rename constants to explicitly distinguish internal vs external tokens:
   - `ACCESS_TOKEN` → `INTERNAL_ACCESS_TOKEN`
   - `REFRESH_TOKEN` → `INTERNAL_REFRESH_TOKEN`
   - `EXTERNAL_ACCESS_TOKEN` → `EXTERNAL_AUTH_TOKEN` (aligns with external API terminology)
   - Add `EXTERNAL_REFRESH_TOKEN`

2. **External Cookie Support**: Read external tokens using names that match external API:
   - Read from `AuthToken` cookie (external access token)
   - Read from `RefreshToken` cookie (external refresh token)

3. **Header-Based Validation**: Send tokens to external validation service via standard HTTP headers (`Authorization: Bearer` and `X-Refresh-Token`)

4. **Enhanced Response Parsing**: Parse the external service's full response format including validation status, user details, and token metadata

## Benefits

- **Code Clarity**: Explicit `INTERNAL_` and `EXTERNAL_` prefixes eliminate ambiguity about token ownership
- **Standards Compliance**: Use standard HTTP Authorization header for token validation
- **Improved Integration**: Cookie names and API terminology align with external authentication service
- **Maintainability**: Clear naming convention makes code more readable and less error-prone
- **Terminology Alignment**: External API's "AuthToken" terminology properly reflected in constant names

## Scope

### In Scope
- **Breaking Change**: Rename all cookie constants to use `INTERNAL_` and `EXTERNAL_` prefixes
- Update all code references to use new constant names (AuthEndpoints, CurrentUserService, etc.)
- Add support for external refresh token (`EXTERNAL_REFRESH_TOKEN`)
- Update `ExternalAuthService` to support header-based token validation
- Update `SsoCommand` to read both external access and refresh tokens
- Parse enhanced validation response from external service (including `code`, `isValid` fields)
- Update all cookie operations throughout the codebase

### Out of Scope
- Changing actual cookie values (e.g., `accessToken` stays as `accessToken`, only constant name changes)
- Modifying token generation logic
- Adding new authentication endpoints (work with existing endpoints)
- Frontend changes (cookies are managed by external system and ONEHub backend)
- Changes to JWT token structure or claims

## Dependencies

- External authentication service must be available at configured `ValidationApiUrl`
- External service response format must match the structure: `{ code, message, result: { isValid, userId, username, email, ... } }`

## Risks and Mitigations

**Risk**: Breaking change to cookie constants requires updating all code references
**Mitigation**:
- Comprehensive search for all usages of old constants
- Thorough testing of all authentication flows (login, SSO, refresh, logout)
- Update all affected files in a single changeset to avoid partial updates

**Risk**: External service API response format mismatch
**Mitigation**:
- Add robust error handling and null checks for response parsing
- Validate response structure before processing
- Log detailed error information for debugging

**Risk**: Cookie name mismatch between external system and ONEHub
**Mitigation**:
- Use constants that exactly match external API terminology (`AuthToken`, `RefreshToken`)
- Document the cookie name expectations clearly
- Test with actual external authentication system

## Related Changes

This change touches the `authentication` capability specification.
