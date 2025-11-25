# Implementation Tasks

## Backend - Infrastructure Layer

- [x] Update `ExternalAuthService.ValidateTokenAsync()` to map password hash
  - [x] Change line 73 from `PasswordHash = string.Empty` to `PasswordHash = resultData.HashPassword`
  - [x] Verify `User` entity returned contains bcrypt password hash from external auth

## Backend - Application Layer

- [x] Update `SsoHandler` to add user sync to database
  - [x] Add `IAuthRepository` injection to `SsoHandler` constructor
  - [x] After successful `ValidateTokenAsync()`, create `CreateUserParam` with user data
  - [x] Map `UserId`, `UserName`, `PasswordHash`, `IsAdmin`, `Roles`, `Avatar` from validated user
  - [x] Map `Ip` and `Host` from command context (auto-injected via `BaseCommand`)
  - [x] Call `authRepository.CreateUserAsync(param)` to sync user to database
  - [x] Wrap `CreateUserAsync()` in try-catch for graceful degradation
  - [x] Log sync errors but continue with JWT token generation
  - [x] Return SSO response with tokens even if sync fails

## Testing & Validation

- [ ] Test SSO with new user (should create in database)
  - [ ] Verify user record created with correct UserId, UserName, PasswordHash, Roles, Avatar, IsAdmin
  - [ ] Verify JWT tokens generated successfully
- [ ] Test SSO with existing user (should update in database)
  - [ ] Verify user record updated with latest data from external auth
  - [ ] Verify JWT tokens generated successfully
- [ ] Test SSO with database unavailable (should still succeed)
  - [ ] Verify error logged
  - [ ] Verify JWT tokens still generated successfully
  - [ ] Verify user can access system
- [x] Run architecture tests
  - [x] Execute `dotnet build`
  - [x] Execute `dotnet test`
  - [x] Verify no layer dependency violations
- [x] Run OpenSpec validation
  - [x] Execute `openspec validate --changes`
  - [x] Verify all requirements have scenarios
  - [x] Verify no validation errors

## Notes

- `CreateUserParam` already exists and includes `PasswordHash` field
- `CreateUserCommand` (Infrastructure) already exists for `OH_UserInfo_Ins` SP
- Email field from external auth is intentionally ignored (not supported by SP)
- SP `OH_UserInfo_Ins` is assumed to handle upsert logic (insert new, update existing)
- Error handling ensures SSO never fails due to database issues
- Password hash stored as-is from external auth (bcrypt format)
