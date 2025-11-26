/**
 * Service lifetime options for dependency injection
 */
export enum ServiceLifetime {
  /**
   * A new instance is created every time the service is requested
   */
  Transient = 'transient',

  /**
   * A single instance is created for the lifetime of the container
   */
  Singleton = 'singleton',

  /**
   * A single instance is created per scope (e.g., per HTTP request)
   */
  Scoped = 'scoped'
}

/**
 * Service descriptor for dependency registration
 */
export interface ServiceDescriptor {
  /**
   * Unique identifier for the service
   */
  token: string | symbol;

  /**
   * Service implementation class or factory function
   */
  implementation: any | (() => any);

  /**
   * Service lifetime
   */
  lifetime: ServiceLifetime;

  /**
   * Optional factory function for creating instances
   */
  factory?: (container: IServiceContainer) => any;

  /**
   * Optional dependencies that this service requires
   */
  dependencies?: string[];

  /**
   * Optional metadata about the service
   */
  metadata?: Record<string, any>;
}

/**
 * Service registration options
 */
export interface ServiceRegistrationOptions {
  /**
   * Service lifetime
   */
  lifetime?: ServiceLifetime;

  /**
   * Factory function for creating instances
   */
  factory?: (container: IServiceContainer) => any;

  /**
   * Dependencies that this service requires
   */
  dependencies?: string[];

  /**
   * Metadata about the service
   */
  metadata?: Record<string, any>;

  /**
   * Whether to replace existing registration
   */
  replace?: boolean;
}

/**
 * Interface for dependency injection container
 */
export interface IServiceContainer {
  /**
   * Register a service
   */
  register<T>(
    token: string | symbol,
    implementation: new (...args: any[]) => T,
    options?: ServiceRegistrationOptions
  ): IServiceContainer;

  /**
   * Register a service instance
   */
  registerInstance<T>(
    token: string | symbol,
    instance: T,
    options?: ServiceRegistrationOptions
  ): IServiceContainer;

  /**
   * Register a service factory
   */
  registerFactory<T>(
    token: string | symbol,
    factory: (container: IServiceContainer) => T,
    options?: ServiceRegistrationOptions
  ): IServiceContainer;

  /**
   * Resolve a service
   */
  resolve<T>(token: string | symbol): T;

  /**
   * Try to resolve a service (returns null if not found)
   */
  tryResolve<T>(token: string | symbol): T | null;

  /**
   * Check if a service is registered
   */
  isRegistered(token: string | symbol): boolean;

  /**
   * Unregister a service
   */
  unregister(token: string | symbol): IServiceContainer;

  /**
   * Clear all services
   */
  clear(): IServiceContainer;

  /**
   * Create a child scope
   */
  createScope(): IServiceContainer;

  /**
   * Get service information
   */
  getServiceInfo(token: string | symbol): ServiceDescriptor | null;

  /**
   * Get all registered services
   */
  getRegisteredServices(): Array<string | symbol>;

  /**
   * Validate dependency graph
   */
  validateDependencies(): {
    isValid: boolean;
    errors: Array<{
      service: string | symbol;
      error: string;
    }>;
  };

  /**
   * Dispose of all disposable services
   */
  dispose(): Promise<void>;
}