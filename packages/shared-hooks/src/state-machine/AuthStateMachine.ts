import { StateMachine } from './StateMachine';
import { IState, IEvent, IStateMachineConfig } from './IState';

// Authentication specific types
export interface AuthContext {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  userName?: string;
  error?: string;
  token?: string;
  isGuest?: boolean;
  lastActivity?: Date;
  attempts?: number;
  lockUntil?: Date;
}

// Authentication events
export class AuthEvent implements IEvent {
  public readonly type: string;
  public readonly payload?: Record<string, any>;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;

  constructor(type: string, payload?: Record<string, any>, metadata?: Record<string, any>) {
    this.type = type;
    this.payload = payload;
    this.timestamp = new Date();
    this.metadata = metadata;
  }
}

// Specific auth events
export const AuthEvents = {
  // Auth flow events
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',

  // Registration events
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',

  // Session management
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  SESSION_TIMEOUT: 'SESSION_TIMEOUT',

  // Security events
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED: 'ACCOUNT_UNLOCKED',
  PASSWORD_CHANGE_REQUEST: 'PASSWORD_CHANGE_REQUEST',
  PASSWORD_CHANGE_SUCCESS: 'PASSWORD_CHANGE_SUCCESS',

  // User preference events
  PREFERENCES_UPDATE: 'PREFERENCES_UPDATE',

  // Guest mode events
  ENTER_GUEST_MODE: 'ENTER_GUEST_MODE',
  EXIT_GUEST_MODE: 'EXIT_GUEST_MODE'
} as const;

// Authentication states
export const AuthStates = {
  UNAUTHENTICATED: 'unauthenticated',
  AUTHENTICATING: 'authenticating',
  AUTHENTICATED: 'authenticated',
  REGISTERING: 'registering',
  LOCKED: 'locked',
  GUEST: 'guest',
  LOGGING_OUT: 'logging_out',
  ERROR: 'error'
} as const;

/**
 * Authentication State Machine
 * Manages the complete authentication flow with security features
 */
export class AuthStateMachine {
  private stateMachine: StateMachine<AuthContext>;

  constructor(initialContext?: Partial<AuthContext>) {
    const config: IStateMachineConfig = {
      initial: AuthStates.UNAUTHENTICATED,
      context: {
        attempts: 0,
        isGuest: false,
        ...initialContext
      },
      states: {
        [AuthStates.UNAUTHENTICATED]: {
          name: AuthStates.UNAUTHENTICATED,
          isFinal: false,
          metadata: {
            description: 'User is not logged in',
            allowedEvents: ['LOGIN_REQUEST', 'REGISTER_REQUEST', 'ENTER_GUEST_MODE']
          }
        },
        [AuthStates.AUTHENTICATING]: {
          name: AuthStates.AUTHENTICATING,
          isFinal: false,
          metadata: {
            description: 'Authentication process in progress',
            allowedEvents: ['LOGIN_SUCCESS', 'LOGIN_FAILURE']
          }
        },
        [AuthStates.AUTHENTICATED]: {
          name: AuthStates.AUTHENTICATED,
          isFinal: false,
          metadata: {
            description: 'User is successfully authenticated',
            allowedEvents: ['LOGOUT', 'TOKEN_EXPIRED', 'SESSION_TIMEOUT', 'PASSWORD_CHANGE_REQUEST']
          }
        },
        [AuthStates.REGISTERING]: {
          name: AuthStates.REGISTERING,
          isFinal: false,
          metadata: {
            description: 'Registration process in progress',
            allowedEvents: ['REGISTER_SUCCESS', 'REGISTER_FAILURE']
          }
        },
        [AuthStates.LOCKED]: {
          name: AuthStates.LOCKED,
          isFinal: false,
          metadata: {
            description: 'Account is locked due to security reasons',
            allowedEvents: ['ACCOUNT_UNLOCKED']
          }
        },
        [AuthStates.GUEST]: {
          name: AuthStates.GUEST,
          isFinal: false,
          metadata: {
            description: 'User is in guest mode',
            allowedEvents: ['EXIT_GUEST_MODE', 'LOGIN_REQUEST']
          }
        },
        [AuthStates.LOGGING_OUT]: {
          name: AuthStates.LOGGING_OUT,
          isFinal: false,
          metadata: {
            description: 'Logout process in progress',
            allowedEvents: ['LOGOUT']
          }
        },
        [AuthStates.ERROR]: {
          name: AuthStates.ERROR,
          isFinal: false,
          metadata: {
            description: 'Error state during authentication',
            allowedEvents: ['LOGIN_REQUEST', 'REGISTER_REQUEST']
          }
        }
      },
      transitions: [
        // Login flow
        {
          from: AuthStates.UNAUTHENTICATED,
          to: AuthStates.AUTHENTICATING,
          on: AuthEvents.LOGIN_REQUEST,
          action: (context, event) => ({
            ...context,
            error: undefined,
            userName: event.payload?.userName
          })
        },
        {
          from: AuthStates.AUTHENTICATING,
          to: AuthStates.AUTHENTICATED,
          on: AuthEvents.LOGIN_SUCCESS,
          action: (context, event) => ({
            ...context,
            user: event.payload?.user,
            token: event.payload?.token,
            error: undefined,
            attempts: 0,
            lockUntil: undefined,
            lastActivity: new Date()
          }),
          effects: async (context, event) => {
            // Store authentication token
            if (event.payload?.token) {
              localStorage.setItem('auth_token', event.payload.token);
            }

            // Update last activity
            localStorage.setItem('last_activity', new Date().toISOString());
          }
        },
        {
          from: AuthStates.AUTHENTICATING,
          to: AuthStates.ERROR,
          on: AuthEvents.LOGIN_FAILURE,
          action: (context, event) => ({
            ...context,
            error: event.payload?.error || 'Authentication failed',
            attempts: (context.attempts || 0) + 1,
            user: undefined,
            token: undefined
          }),
          guard: (context) => (context.attempts || 0) < 5 // Allow up to 5 attempts
        },
        {
          from: AuthStates.AUTHENTICATING,
          to: AuthStates.LOCKED,
          on: AuthEvents.LOGIN_FAILURE,
          action: (context, event) => ({
            ...context,
            error: 'Account locked due to too many failed attempts',
            lockUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
            user: undefined,
            token: undefined
          }),
          guard: (context) => (context.attempts || 0) >= 5 // Lock after 5 attempts
        },

        // Logout flow
        {
          from: AuthStates.AUTHENTICATED,
          to: AuthStates.LOGGING_OUT,
          on: AuthEvents.LOGOUT
        },
        {
          from: AuthStates.LOGGING_OUT,
          to: AuthStates.UNAUTHENTICATED,
          on: AuthEvents.LOGOUT,
          action: (context) => ({
            user: undefined,
            token: undefined,
            error: undefined,
            userName: undefined,
            lastActivity: undefined
          }),
          effects: async () => {
            // Clear authentication data
            localStorage.removeItem('auth_token');
            localStorage.removeItem('last_activity');
          }
        },

        // Registration flow
        {
          from: AuthStates.UNAUTHENTICATED,
          to: AuthStates.REGISTERING,
          on: AuthEvents.REGISTER_REQUEST,
          action: (context) => ({
            ...context,
            error: undefined
          })
        },
        {
          from: AuthStates.REGISTERING,
          to: AuthStates.AUTHENTICATED,
          on: AuthEvents.REGISTER_SUCCESS,
          action: (context, event) => ({
            ...context,
            user: event.payload?.user,
            token: event.payload?.token,
            error: undefined,
            lastActivity: new Date()
          }),
          effects: async (context, event) => {
            if (event.payload?.token) {
              localStorage.setItem('auth_token', event.payload.token);
            }
            localStorage.setItem('last_activity', new Date().toISOString());
          }
        },
        {
          from: AuthStates.REGISTERING,
          to: AuthStates.ERROR,
          on: AuthEvents.REGISTER_FAILURE,
          action: (context, event) => ({
            ...context,
            error: event.payload?.error || 'Registration failed'
          })
        },

        // Guest mode
        {
          from: AuthStates.UNAUTHENTICATED,
          to: AuthStates.GUEST,
          on: AuthEvents.ENTER_GUEST_MODE,
          action: (context) => ({
            ...context,
            isGuest: true,
            error: undefined
          })
        },
        {
          from: AuthStates.GUEST,
          to: AuthStates.UNAUTHENTICATED,
          on: AuthEvents.EXIT_GUEST_MODE,
          action: (context) => ({
            ...context,
            isGuest: false
          })
        },

        // Session management
        {
          from: AuthStates.AUTHENTICATED,
          to: AuthStates.UNAUTHENTICATED,
          on: AuthEvents.TOKEN_EXPIRED,
          action: (context) => ({
            ...context,
            user: undefined,
            token: undefined,
            error: 'Session expired. Please login again.'
          }),
          effects: async () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('last_activity');
          }
        },
        {
          from: AuthStates.AUTHENTICATED,
          to: AuthStates.UNAUTHENTICATED,
          on: AuthEvents.SESSION_TIMEOUT,
          action: (context) => ({
            ...context,
            user: undefined,
            token: undefined,
            error: 'Session timed out. Please login again.'
          }),
          effects: async () => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('last_activity');
          }
        },

        // Account locking
        {
          from: AuthStates.LOCKED,
          to: AuthStates.UNAUTHENTICATED,
          on: AuthEvents.ACCOUNT_UNLOCKED,
          guard: (context) => {
            return !context.lockUntil || context.lockUntil <= new Date();
          },
          action: (context) => ({
            ...context,
            error: undefined,
            attempts: 0,
            lockUntil: undefined
          })
        },

        // Error recovery
        {
          from: AuthStates.ERROR,
          to: AuthStates.UNAUTHENTICATED,
          on: AuthEvents.LOGIN_REQUEST,
          action: (context) => ({
            ...context,
            error: undefined
          })
        },
        {
          from: AuthStates.ERROR,
          to: AuthStates.UNAUTHENTICATED,
          on: AuthEvents.REGISTER_REQUEST,
          action: (context) => ({
            ...context,
            error: undefined
          })
        }
      ]
    };

    this.stateMachine = new StateMachine<AuthContext>(config);
  }

  /**
   * Get current state
   */
  getCurrentState() {
    return this.stateMachine.getCurrentState();
  }

  /**
   * Get current context
   */
  getContext() {
    return this.stateMachine.getContext();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentState().name === AuthStates.AUTHENTICATED;
  }

  /**
   * Check if user is in guest mode
   */
  isGuest(): boolean {
    const context = this.getContext();
    return this.getCurrentState().name === AuthStates.GUEST || context.isGuest === true;
  }

  /**
   * Check if account is locked
   */
  isLocked(): boolean {
    return this.getCurrentState().name === AuthStates.LOCKED;
  }

  /**
   * Get user information
   */
  getUser() {
    return this.getContext().user;
  }

  /**
   * Get authentication error
   */
  getError() {
    return this.getContext().error;
  }

  /**
   * Transition to new state
   */
  async transition(eventType: string, payload?: Record<string, any>) {
    const event = new AuthEvent(eventType, payload);
    return this.stateMachine.transition(event);
  }

  /**
   * Check if transition is possible
   */
  canTransition(eventType: string): boolean {
    const event = new AuthEvent(eventType);
    return this.stateMachine.canTransition(event);
  }

  /**
   * Get all possible transitions from current state
   */
  getPossibleTransitions() {
    return this.stateMachine.getPossibleTransitions();
  }

  /**
   * Reset state machine
   */
  reset() {
    this.stateMachine.reset();
  }

  /**
   * Get state as JSON for debugging
   */
  toJSON() {
    return this.stateMachine.toJSON();
  }

  /**
   * Export state diagram
   */
  getStateDiagram() {
    return this.stateMachine.getStateDiagram();
  }

  /**
   * Check if session is valid (not expired)
   */
  isSessionValid(): boolean {
    const context = this.getContext();
    const lastActivity = context.lastActivity;

    if (!lastActivity) return false;

    const sessionTimeout = 30 * 60 * 1000; // 30 minutes
    const now = new Date();
    const timeDiff = now.getTime() - lastActivity.getTime();

    return timeDiff < sessionTimeout;
  }

  /**
   * Update context
   */
  updateContext(updater: (context: any) => any) {
    this.stateMachine.updateContext(updater);
  }

  /**
   * Update last activity time
   */
  updateLastActivity() {
    this.updateContext((context) => ({
      ...context,
      lastActivity: new Date()
    }));

    localStorage.setItem('last_activity', new Date().toISOString());
  }

  /**
   * Get time until account unlock
   */
  getTimeUntilUnlock(): number | null {
    const context = this.getContext();
    if (!context.lockUntil) return null;

    return context.lockUntil.getTime() - Date.now();
  }
}