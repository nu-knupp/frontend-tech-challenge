/**
 * Base interface for all states in the state machine
 */
export interface IState {
  /**
   * Unique identifier for the state
   */
  name: string;

  /**
   * Context data associated with the state
   */
  context?: Record<string, any>;

  /**
   * Whether this state is a final state (no further transitions)
   */
  isFinal: boolean;

  /**
   * Optional metadata about the state
   */
  metadata?: Record<string, any>;
}

/**
 * Base interface for all events that can trigger state transitions
 */
export interface IEvent {
  /**
   * Type/name of the event
   */
  type: string;

  /**
   * Payload data for the event
   */
  payload?: Record<string, any>;

  /**
   * Optional timestamp when the event was created
   */
  timestamp?: Date;

  /**
   * Optional metadata about the event
   */
  metadata?: Record<string, any>;
}

/**
 * Base interface for state transition
 */
export interface ITransition {
  /**
   * Source state
   */
  from: string;

  /**
   * Target state
   */
  to: string;

  /**
   * Event that triggers this transition
   */
  on: string;

  /**
   * Optional guard function that determines if transition should occur
   */
  guard?: (context: any, event: IEvent) => boolean;

  /**
   * Optional action to execute during transition
   */
  action?: (context: any, event: IEvent) => any;

  /**
   * Optional side effects to execute after transition
   */
  effects?: (context: any, event: IEvent) => Promise<void> | void;
}

/**
 * Configuration for state machine
 */
export interface IStateMachineConfig {
  /**
   * Initial state name
   */
  initial: string;

  /**
   * All possible states
   */
  states: Record<string, IState>;

  /**
   * All possible transitions
   */
  transitions: ITransition[];

  /**
   * Optional context for the state machine
   */
  context?: Record<string, any>;
}