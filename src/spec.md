# Specification

## Summary
**Goal:** Fix the black screen on first load by moving auth/onboarding redirects out of the App render path and ensuring the app always renders a visible UI state.

**Planned changes:**
- Remove imperative navigation (e.g., `router.navigate(...)`) from `frontend/src/App.tsx` render/conditional return logic.
- Implement auth/onboarding guarding and redirects using TanStack Router route lifecycle mechanisms (e.g., `beforeLoad`/loader redirects) so routing decisions occur within the router.
- Add a dark-theme-consistent fallback UI for unexpected auth/profile/routing errors with clear English messaging and a retry action to avoid any blank screen.

**User-visible outcome:** Opening the app no longer shows a black screen; users reliably see Login, Onboarding, or the main app as appropriate, and unexpected errors show a readable recovery screen instead of a blank page.
