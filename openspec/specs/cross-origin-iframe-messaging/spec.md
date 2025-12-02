# cross-origin-iframe-messaging Specification

## Purpose
TBD - created by archiving change fix-cross-origin-iframe-messaging. Update Purpose after archive.
## Requirements
### Requirement: Iframe message broadcasting MUST use iframe-specific target origins

The `broadcastToIframes` function MUST send postMessage to each iframe using the iframe's actual origin (extracted from its src attribute) instead of the parent window's origin, enabling cross-origin communication.

#### Scenario: Parent broadcasts theme change to cross-origin iframe

**Given** parent window is at `https://stage.owmkt.com`
**And** page contains iframe with `src="https://onehub.owmkt.com/page"`
**When** parent calls `broadcastToIframes({ type: 'THEME_CHANGE', theme: 'dark' })`
**Then** message is sent with targetOrigin `https://onehub.owmkt.com` (from iframe src)
**And** iframe receives the message successfully

**Rationale**: postMessage requires exact targetOrigin match. Using parent's origin (`stage.owmkt.com`) to send to child origin (`onehub.owmkt.com`) causes message to be silently dropped.

---

#### Scenario: Parent broadcasts to same-origin iframe

**Given** parent window is at `http://localhost:5173`
**And** page contains iframe with `src="http://localhost:5173/preview"`
**When** parent calls `broadcastToIframes({ type: 'LANGUAGE_CHANGE', language: 'zh' })`
**Then** message is sent with targetOrigin `http://localhost:5173`
**And** iframe receives the message successfully

**Rationale**: Same-origin scenarios must continue to work after the fix.

---

#### Scenario: Broadcasting to iframe with invalid src fails gracefully

**Given** page contains iframe with invalid src (e.g., `src="javascript:void(0)"`)
**When** parent calls `broadcastToIframes({ type: 'DIRECTION_CHANGE', direction: 'rtl' })`
**Then** message is NOT sent to that iframe (skip silently)
**And** no exception is thrown
**And** (in dev mode) warning is logged to console

**Rationale**: Some iframes may not have valid src attributes. The system should handle this gracefully without breaking other iframes.

---

### Requirement: Iframe message validation MUST accept messages from trusted parent origins

The `isValidIframeMessage` function MUST validate that incoming postMessage events originate from a trusted parent domain (configured via environment variables), and MUST reject messages from untrusted origins.

#### Scenario: Iframe receives message from trusted parent origin

**Given** iframe is at `https://onehub.owmkt.com`
**And** trusted origins are `['https://stage.owmkt.com', 'https://onehub.owmkt.com']`
**When** message arrives with `event.origin === 'https://stage.owmkt.com'`
**And** message data is `{ type: 'THEME_CHANGE', theme: 'dark' }`
**Then** `isValidIframeMessage(event, trustedOrigins)` returns `true`
**And** theme change is applied

**Rationale**: Cross-origin communication requires iframe to accept messages from parent's origin, not just its own.

---

#### Scenario: Iframe rejects message from untrusted origin

**Given** iframe is at `https://onehub.owmkt.com`
**And** trusted origins are `['https://stage.owmkt.com', 'https://onehub.owmkt.com']`
**When** message arrives with `event.origin === 'https://malicious.com'`
**Then** `isValidIframeMessage(event, trustedOrigins)` returns `false`
**And** message is ignored

**Rationale**: Security requires validating message origin to prevent malicious iframe injection attacks.

---

#### Scenario: Iframe validates message structure and type

**Given** message arrives from trusted origin `https://stage.owmkt.com`
**When** message data is `{ type: 'UNKNOWN_TYPE', payload: {} }`
**Then** `isValidIframeMessage(event, trustedOrigins)` returns `false`
**And** message is ignored

**Rationale**: Even from trusted origins, only valid message types should be processed.

---

### Requirement: Trusted origins MUST be configurable per environment

Trusted iframe parent origins MUST be configurable via the `VITE_TRUSTED_IFRAME_ORIGINS` environment variable, allowing different origins for development, staging, and production without code changes.

#### Scenario: Development environment uses localhost origins

**Given** environment file `.env.development` contains:
```
VITE_TRUSTED_IFRAME_ORIGINS=http://localhost:5173,http://localhost:5174
```
**When** iframe loads in development mode
**Then** messages from `http://localhost:5173` are accepted
**And** messages from `http://localhost:5174` are accepted
**And** messages from `https://stage.owmkt.com` are rejected

**Rationale**: Development uses different origins than production. Configuration must be environment-specific.

---

#### Scenario: Production environment uses production domains

**Given** environment file `.env.production` contains:
```
VITE_TRUSTED_IFRAME_ORIGINS=https://owmkt.com,https://onehub.owmkt.com
```
**When** iframe loads in production mode
**Then** messages from `https://owmkt.com` are accepted
**And** messages from `https://onehub.owmkt.com` are accepted
**And** messages from `http://localhost:5173` are rejected

**Rationale**: Production should only accept messages from production domains for security.

---

#### Scenario: Fallback to current origin when config is missing

**Given** `VITE_TRUSTED_IFRAME_ORIGINS` environment variable is not set
**When** iframe message validation initializes
**Then** trusted origins defaults to `[window.location.origin]`

**Rationale**: Graceful degradation ensures same-origin scenarios work even without explicit configuration.

---

### Requirement: Theme, language, and direction synchronization MUST work across origins

ThemeProvider, LanguageProvider, and DirectionProvider MUST correctly propagate state changes from parent to cross-origin iframes via postMessage, maintaining synchronized UI preferences across different domains.

#### Scenario: Theme changes propagate from parent to cross-origin iframe

**Given** parent is at `https://stage.owmkt.com`
**And** iframe is at `https://onehub.owmkt.com`
**And** both have ThemeProvider active
**When** user changes theme to "dark" in parent
**Then** parent calls `broadcastToIframes({ type: 'THEME_CHANGE', theme: 'dark' })`
**And** iframe receives message and updates theme to "dark"
**And** iframe's theme cookie is set to "dark"

**Rationale**: Core use case - theme must sync across origins.

---

#### Scenario: Language changes propagate from parent to cross-origin iframe

**Given** parent is at `https://stage.owmkt.com`
**And** iframe is at `https://onehub.owmkt.com`
**And** both have LanguageProvider active
**When** user changes language to "zh" in parent
**Then** iframe receives message and updates language to "zh"
**And** iframe's locale cookie is set to "zh"

**Rationale**: Language synchronization must work cross-origin.

---

#### Scenario: Direction changes propagate from parent to cross-origin iframe

**Given** parent is at `https://stage.owmkt.com`
**And** iframe is at `https://onehub.owmkt.com`
**And** both have DirectionProvider active
**When** user changes direction to "rtl" in parent
**Then** iframe receives message and updates direction to "rtl"
**And** iframe's dir cookie is set to "rtl"
**And** iframe's `<html>` element gets `dir="rtl"` attribute

**Rationale**: RTL/LTR direction must sync across origins.

---

