/**
 * Base interface for all feature modules
 * Provides a standardized way to organize code by business domain
 */
export interface IFeatureModule {
  /**
   * Unique identifier for the feature module
   */
  name: string;

  /**
   * Version of the feature module
   */
  version: string;

  /**
   * Description of what the feature module does
   */
  description: string;

  /**
   * Dependencies on other feature modules
   */
  dependencies: string[];

  /**
   * Initialize the feature module
   */
  initialize(): Promise<void>;

  /**
   * Clean up the feature module
   */
  dispose(): Promise<void>;

  /**
   * Check if the feature module is initialized
   */
  isInitialized(): boolean;

  /**
   * Get feature module metadata
   */
  getMetadata(): {
    name: string;
    version: string;
    description: string;
    dependencies: string[];
    initialized: boolean;
    initializationTime?: Date;
  };
}

/**
 * Base interface for feature module registry
 */
export interface IFeatureModuleRegistry {
  /**
   * Register a feature module
   */
  register(module: IFeatureModule): Promise<void>;

  /**
   * Unregister a feature module
   */
  unregister(moduleName: string): Promise<void>;

  /**
   * Get a feature module by name
   */
  get<T extends IFeatureModule>(moduleName: string): T | undefined;

  /**
   * Check if a feature module is registered
   */
  has(moduleName: string): boolean;

  /**
   * Get all registered feature modules
   */
  getAll(): ReadonlyArray<IFeatureModule>;

  /**
   * Initialize all feature modules
   */
  initializeAll(): Promise<void>;

  /**
   * Dispose all feature modules
   */
  disposeAll(): Promise<void>;

  /**
   * Get dependency graph
   */
  getDependencyGraph(): Map<string, string[]>;
}