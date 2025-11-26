import { IState, IEvent, ITransition, IStateMachineConfig } from './IState';

/**
 * Generic State Machine implementation
 * Provides a robust way to manage complex state transitions
 */
export class StateMachine<TContext = any> {
  private currentState: IState;
  private context: TContext;
  private config: IStateMachineConfig;
  private transitionHistory: Array<{
    from: string;
    to: string;
    event: IEvent;
    timestamp: Date;
  }> = [];

  constructor(config: IStateMachineConfig) {
    this.config = config;
    this.context = (config.context as TContext) || {} as TContext;

    const initialState = this.config.states[config.initial];
    if (!initialState) {
      throw new Error(`Initial state "${config.initial}" not found`);
    }

    this.currentState = initialState;
  }

  /**
   * Get the current state
   */
  getCurrentState(): IState {
    return this.currentState;
  }

  /**
   * Get the current context
   */
  getContext(): TContext {
    return this.context;
  }

  /**
   * Update the context
   */
  updateContext(updater: (context: TContext) => TContext | Partial<TContext> | void): void {
    if (typeof updater === 'function') {
      const updated = updater(this.context);
      if (updated && typeof updated === 'object') {
        this.context = { ...this.context, ...(updated as object) } as TContext;
      }
    } else if (updater && typeof updater === 'object') {
      this.context = { ...this.context, ...(updater as object) } as TContext;
    }
  }

  /**
   * Check if a transition is possible for the given event
   */
  canTransition(event: IEvent): boolean {
    const transition = this.findTransition(event.type);
    if (!transition) {
      return false;
    }

    if (transition.guard) {
      return transition.guard(this.context, event);
    }

    return true;
  }

  /**
   * Execute a state transition
   */
  async transition(event: IEvent): Promise<{
    success: boolean;
    fromState: string;
    toState?: string;
    error?: string;
  }> {
    const transition = this.findTransition(event.type);

    if (!transition) {
      return {
        success: false,
        fromState: this.currentState.name,
        error: `No transition found for event "${event.type}" from state "${this.currentState.name}"`
      };
    }

    if (transition.guard && !transition.guard(this.context, event)) {
      return {
        success: false,
        fromState: this.currentState.name,
        error: `Transition guard blocked event "${event.type}" from state "${this.currentState.name}"`
      };
    }

    try {
      const fromState = this.currentState.name;
      const toState = transition.to;

      // Execute transition action if provided
      if (transition.action) {
        const result = transition.action(this.context, event);
        if (result !== undefined) {
          this.context = { ...this.context, ...result } as TContext;
        }
      }

      // Update current state
      const newState = this.config.states[toState];
      if (!newState) {
        throw new Error(`Target state "${toState}" not found`);
      }

      this.currentState = newState;

      // Record transition in history
      this.transitionHistory.push({
        from: fromState,
        to: toState,
        event: {
          ...event,
          timestamp: event.timestamp || new Date()
        },
        timestamp: new Date()
      });

      // Execute side effects if provided
      if (transition.effects) {
        await transition.effects(this.context, event);
      }

      return {
        success: true,
        fromState,
        toState
      };
    } catch (error) {
      return {
        success: false,
        fromState: this.currentState.name,
        error: error instanceof Error ? error.message : 'Unknown error during transition'
      };
    }
  }

  /**
   * Get all possible transitions from current state
   */
  getPossibleTransitions(): ITransition[] {
    return this.config.transitions.filter(
      transition => transition.from === this.currentState.name
    );
  }

  /**
   * Get transition history
   */
  getTransitionHistory(): ReadonlyArray<{
    from: string;
    to: string;
    event: IEvent;
    timestamp: Date;
  }> {
    return this.transitionHistory;
  }

  /**
   * Check if the machine is in a final state
   */
  isFinal(): boolean {
    return this.currentState.isFinal;
  }

  /**
   * Reset the state machine to initial state
   */
  reset(): void {
    const initialState = this.config.states[this.config.initial];
    if (!initialState) {
      throw new Error(`Initial state "${this.config.initial}" not found`);
    }

    this.currentState = initialState;
    this.context = (this.config.context as TContext) || {} as TContext;
    this.transitionHistory = [];
  }

  /**
   * Get state diagram in DOT format (for visualization)
   */
  getStateDiagram(): string {
    let diagram = 'digraph StateMachine {\n';
    diagram += '  rankdir=LR;\n';
    diagram += '  node [shape=circle];\n\n';

    // Add states
    Object.entries(this.config.states).forEach(([name, state]) => {
      const shape = state.isFinal ? 'doublecircle' : 'circle';
      diagram += `  "${name}" [shape=${shape}];\n`;
    });

    diagram += '\n';

    // Add transitions
    this.config.transitions.forEach(transition => {
      diagram += `  "${transition.from}" -> "${transition.to}" [label="${transition.on}"];\n`;
    });

    diagram += '}';
    return diagram;
  }

  /**
   * Find transition for a given event type
   */
  private findTransition(eventType: string): ITransition | undefined {
    return this.config.transitions.find(
      transition => transition.from === this.currentState.name && transition.on === eventType
    );
  }

  /**
   * Get current state as JSON for debugging
   */
  toJSON(): {
    currentState: string;
    context: TContext;
    history: Array<{
      from: string;
      to: string;
      event: string;
      timestamp: string;
    }>;
    possibleTransitions: string[];
  } {
    return {
      currentState: this.currentState.name,
      context: this.context,
      history: this.transitionHistory.map(h => ({
        from: h.from,
        to: h.to,
        event: h.event.type,
        timestamp: h.timestamp.toISOString()
      })),
      possibleTransitions: this.getPossibleTransitions().map(t => t.on)
    };
  }
}