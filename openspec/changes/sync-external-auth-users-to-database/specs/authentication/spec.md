# authentication Specification Changes

## MODIFIED Requirements

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

## Notes

- Email field from external auth is intentionally ignored as the stored procedure and domain entities do not support it
- Password hash is stored as-is from external auth (bcrypt format) for potential future local authentication scenarios
- The stored procedure `OH_UserInfo_Ins` is assumed to handle upsert logic (insert if new, update if exists)
- User sync failures are logged but do not block SSO login flow (graceful degradation pattern)
- This change only affects SSO authentication (`/api/auth/sso`), not regular login (`/api/auth/login`)
