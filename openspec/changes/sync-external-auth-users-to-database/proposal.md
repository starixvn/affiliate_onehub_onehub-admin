# Proposal: Sync External Auth Users to Database

## Problem Statement

Currently, the SSO authentication flow validates external tokens and generates internal JWT tokens but does not persist user data to the database. This creates a gap where SSO users exist only in memory during their session, preventing:
- User management and auditing
- Tracking user creation/update timestamps
- Maintaining consistent user records across sessions
- Supporting future features that depend on persistent user data

The external auth service already returns complete user information including `hashPassword` (bcrypt), but this data is discarded after token generation.

## Proposed Solution

Enhance the SSO command handler to automatically synchronize external auth user data with the local database:
- **Create** user record if user doesn't exist (based on UserId from external auth)
- **Update** user record if user exists (sync roles, avatar, admin status, password hash)
- Store the bcrypt password hash from external auth for potential future local authentication
- Maintain a single source of truth by always syncing on SSO login

This approach leverages the existing stored procedure (`OH_UserInfo_Ins`) which handles both insert and update operations automatically.

## Scope

**In Scope:**
- Map `hashPassword` from external auth response to `User.PasswordHash`
- Call `IAuthRepository.CreateUserAsync()` in `SsoHandler` after successful validation
- Update `authentication` spec with user persistence requirements
- Handle sync failures gracefully without blocking SSO login

**Out of Scope:**
- Adding `Email` field to User entity (SP doesn't support it currently)
- Changes to regular login flow (`/api/auth/login`)
- User deletion or deactivation logic
- Password validation using bcrypt (future work)
- Migration of existing SSO users

## Impact Assessment

**Changed Components:**
- `ExternalAuthService.cs` - Map hashPassword to PasswordHash
- `SsoHandler.cs` - Add user sync logic after validation
- `authentication` spec - Add user persistence requirements

**Dependencies:**
- Existing `IAuthRepository.CreateUserAsync()` method
- Existing `CreateUserParam` and `CreateUserCommand` infrastructure
- Stored procedure `OH_UserInfo_Ins` (assumed to support upsert logic)

**Breaking Changes:**
- None - additive feature only

**Risks:**
- Database operation failure could block SSO login (mitigated by error handling)
- SP might not support all fields (acceptable - SP handles what it can)
- Performance impact of additional DB call during login (minimal)

## Success Criteria

1. SSO login successfully creates user record on first login
2. SSO login successfully updates user record on subsequent logins
3. Password hash from external auth is stored correctly
4. SSO login still succeeds even if user sync fails (graceful degradation)
5. User data in database matches external auth system data
6. Architecture tests continue to pass

## Alternatives Considered

**Alternative 1: Separate user sync endpoint**
- Rejected: Requires manual trigger, not automatic

**Alternative 2: Background job for user sync**
- Rejected: Adds complexity, delays user creation

**Alternative 3: Sync on first API call after login**
- Rejected: Unnecessary delay in user-facing operations

**Alternative 4: Store external auth data without password hash**
- Rejected: Loses valuable authentication data for future use

## Open Questions

None - all requirements clarified with user.
