'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AuthStateMachine, AuthEvents, AuthStates } from './state-machine/AuthStateMachine';

/**
 * React hook for managing authentication state with state machine
 * Provides a robust way to handle authentication flows
 */
export function useAuthStateMachine() {
  const [stateMachine] = useState(() => new AuthStateMachine());
  const [state, setState] = useState(() => ({
    currentState: stateMachine.getCurrentState().name,
    context: stateMachine.getContext(),
    isAuthenticated: stateMachine.isAuthenticated(),
    isGuest: stateMachine.isGuest(),
    isLocked: stateMachine.isLocked(),
    user: stateMachine.getUser(),
    error: stateMachine.getError()
  }));

  const sessionCheckInterval = useRef<NodeJS.Timeout | undefined>(undefined);

  // Update state when state machine changes
  const updateState = useCallback(() => {
    setState({
      currentState: stateMachine.getCurrentState().name,
      context: stateMachine.getContext(),
      isAuthenticated: stateMachine.isAuthenticated(),
      isGuest: stateMachine.isGuest(),
      isLocked: stateMachine.isLocked(),
      user: stateMachine.getUser(),
      error: stateMachine.getError()
    });
  }, [stateMachine]);

  // Handle state transitions
  const transition = useCallback(async (eventType: string, payload?: Record<string, any>) => {
    const result = await stateMachine.transition(eventType, payload);
    updateState();
    return result;
  }, [stateMachine, updateState]);

  // Authentication methods
  const login = useCallback(async (userName: string, password: string) => {
    return transition(AuthEvents.LOGIN_REQUEST, { userName, password });
  }, [transition]);

  const logout = useCallback(async () => {
    return transition(AuthEvents.LOGOUT);
  }, [transition]);

  const register = useCallback(async (userData: any) => {
    return transition(AuthEvents.REGISTER_REQUEST, { userData });
  }, [transition]);

  const enterGuestMode = useCallback(async () => {
    return transition(AuthEvents.ENTER_GUEST_MODE);
  }, [transition]);

  const exitGuestMode = useCallback(async () => {
    return transition(AuthEvents.EXIT_GUEST_MODE);
  }, [transition]);

  const refreshToken = useCallback(async (token: string) => {
    return transition(AuthEvents.TOKEN_REFRESH, { token });
  }, [transition]);

  const clearError = useCallback(() => {
    stateMachine.updateContext((context: any) => ({
      ...context,
      error: undefined
    }));
    updateState();
  }, [stateMachine, updateState]);

  const reset = useCallback(() => {
    stateMachine.reset();
    updateState();
  }, [stateMachine, updateState]);

  // Session management
  const updateLastActivity = useCallback(() => {
    stateMachine.updateLastActivity();
  }, [stateMachine]);

  const isSessionValid = useCallback(() => {
    return stateMachine.isSessionValid();
  }, [stateMachine]);

  const getTimeUntilUnlock = useCallback(() => {
    return stateMachine.getTimeUntilUnlock();
  }, [stateMachine]);

  // Check if transition is possible
  const canTransition = useCallback((eventType: string) => {
    return stateMachine.canTransition(eventType);
  }, [stateMachine]);

  const getPossibleTransitions = useCallback(() => {
    return stateMachine.getPossibleTransitions();
  }, [stateMachine]);

  // Initialize state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const lastActivity = localStorage.getItem('last_activity');

    if (token && lastActivity) {
      const lastActivityDate = new Date(lastActivity);
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes
      const now = new Date();

      if (now.getTime() - lastActivityDate.getTime() < sessionTimeout) {
        // Session is still valid, transition to authenticated state
        transition(AuthEvents.LOGIN_SUCCESS, {
          token,
          user: {
            id: 'current-user', // This would come from decoded token
            email: 'user@example.com',
            firstName: 'User',
            lastName: 'Name'
          }
        });
      } else {
        // Session expired
        localStorage.removeItem('auth_token');
        localStorage.removeItem('last_activity');
      }
    }
  }, [transition]);

  // Set up session monitoring
  useEffect(() => {
    sessionCheckInterval.current = setInterval(() => {
      if (state.isAuthenticated) {
        if (!stateMachine.isSessionValid()) {
          transition(AuthEvents.SESSION_TIMEOUT);
        }
      }
    }, 60 * 1000); // Check every minute

    return () => {
      if (sessionCheckInterval.current) {
        clearInterval(sessionCheckInterval.current);
      }
    };
  }, [state.isAuthenticated, stateMachine, transition]);

  // Monitor user activity and update last activity time
  useEffect(() => {
    const handleActivity = () => {
      if (state.isAuthenticated) {
        updateLastActivity();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [state.isAuthenticated, updateLastActivity]);

  return {
    // State
    currentState: state.currentState,
    context: state.context,
    isAuthenticated: state.isAuthenticated,
    isGuest: state.isGuest,
    isLocked: state.isLocked,
    user: state.user,
    error: state.error,

    // Auth methods
    login,
    logout,
    register,
    enterGuestMode,
    exitGuestMode,
    refreshToken,
    clearError,
    reset,

    // Session management
    updateLastActivity,
    isSessionValid,
    getTimeUntilUnlock,

    // State machine methods
    transition,
    canTransition,
    getPossibleTransitions,

    // Debug methods
    getStateDiagram: () => stateMachine.getStateDiagram(),
    toJSON: () => stateMachine.toJSON(),

    // Constants
    AuthEvents,
    AuthStates
  };
}