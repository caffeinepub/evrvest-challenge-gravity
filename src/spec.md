# Specification

## Summary
**Goal:** Prevent black/blank screens on app startup by always showing a visible loading or fallback UI while auth and initial profile state resolve, with a deterministic recovery path.

**Planned changes:**
- Render a full-screen startup loading UI from the root route while Internet Identity initialization and the initial profile query are unresolved, regardless of the initial route.
- Update TanStack Router auth/onboarding route guards to fail safely: on timeout/error, render a themed fallback/error UI via router error handling instead of entering routes that may render nothing.
- Add a user-visible recovery action on startup failure (e.g., “Reload Application”) to restart the startup flow and escape broken routing/session states.
- Add lightweight, production-safe console diagnostics to indicate which startup phase is blocked or failed (identity init vs profile load vs router guard), without exposing sensitive user data.

**User-visible outcome:** On hard refresh or direct navigation to any route, users always see a clear full-screen loading screen during startup; if startup fails, they see an error screen with an English explanation and a recovery action (never a black/blank screen).
