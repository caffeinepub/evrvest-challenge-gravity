/**
 * External store to bridge React auth/profile state into TanStack Router lifecycle hooks.
 * Enables router guards to make redirect decisions without causing blank screens.
 */

interface AuthState {
  isInitializing: boolean;
  identity: any | null;
  profileLoading: boolean;
  profileFetched: boolean;
  userProfile: any | null;
  lastResolvedPhase?: string;
  lastResolvedTimestamp?: number;
  lastError?: string;
}

let authState: AuthState = {
  isInitializing: true,
  identity: null,
  profileLoading: false,
  profileFetched: false,
  userProfile: null,
};

const listeners = new Set<() => void>();

export const routerAuthStore = {
  getState: () => authState,
  
  setState: (newState: Partial<AuthState>) => {
    authState = { ...authState, ...newState };
    listeners.forEach(listener => listener());
  },
  
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  /**
   * Returns a promise that resolves when auth/profile state is deterministically resolved.
   * Used by router guards to wait before making redirect decisions.
   * Throws on timeout or error to trigger router error handling.
   */
  waitUntilResolved: async (timeoutMs = 8000): Promise<AuthState> => {
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
      const checkResolved = () => {
        const state = authState;
        const elapsed = Date.now() - startTime;
        
        // Timeout check with diagnostic context
        if (elapsed > timeoutMs) {
          const phase = state.isInitializing 
            ? 'identity-init' 
            : (state.identity && state.profileLoading && !state.profileFetched)
              ? 'profile-load'
              : 'unknown';
          
          console.warn(`[Router Guard] Timeout after ${elapsed}ms during phase: ${phase}`);
          
          authState = {
            ...authState,
            lastError: `Startup timeout during ${phase}`,
            lastResolvedPhase: phase,
            lastResolvedTimestamp: Date.now(),
          };
          
          reject(new Error(`Application startup timed out while ${phase === 'identity-init' ? 'initializing authentication' : 'loading your profile'}. Please try reloading the application.`));
          return;
        }
        
        // If still initializing identity, wait
        if (state.isInitializing) {
          setTimeout(checkResolved, 50);
          return;
        }
        
        // If authenticated and profile is loading but not fetched, wait
        if (state.identity && state.profileLoading && !state.profileFetched) {
          setTimeout(checkResolved, 50);
          return;
        }
        
        // State is resolved - capture success context
        const phase = state.identity 
          ? (state.userProfile ? 'authenticated-with-profile' : 'authenticated-no-profile')
          : 'unauthenticated';
        
        authState = {
          ...authState,
          lastResolvedPhase: phase,
          lastResolvedTimestamp: Date.now(),
          lastError: undefined,
        };
        
        resolve(state);
      };
      
      checkResolved();
    });
  }
};
