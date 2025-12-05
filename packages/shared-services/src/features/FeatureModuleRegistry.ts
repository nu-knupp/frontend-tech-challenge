import { IFeatureModule, IFeatureModuleRegistry } from './IFeatureModule';

/**
 * Registry for managing feature modules
 * Handles initialization, dependencies, and lifecycle management
 */
export class FeatureModuleRegistry implements IFeatureModuleRegistry {
  private modules = new Map<string, IFeatureModule>();
  private initializationOrder: string[] = [];

  /**
   * Register a feature module
   */
  async register(module: IFeatureModule): Promise<void> {
    if (this.modules.has(module.name)) {
      throw new Error(`Feature module "${module.name}" is already registered`);
    }

    // Check dependencies
    for (const dependency of module.dependencies) {
      if (!this.modules.has(dependency)) {
        throw new Error(`Feature module "${module.name}" depends on "${dependency}" which is not registered`);
      }
    }

    this.modules.set(module.name, module);
    this.updateInitializationOrder();
  }

  /**
   * Unregister a feature module
   */
  async unregister(moduleName: string): Promise<void> {
    const module = this.modules.get(moduleName);
    if (!module) {
      throw new Error(`Feature module "${moduleName}" is not registered`);
    }

    // Check if other modules depend on this one
    const dependents = Array.from(this.modules.values()).filter(m =>
      m.dependencies.includes(moduleName)
    );

    if (dependents.length > 0) {
      const dependentNames = dependents.map(m => m.name).join(', ');
      throw new Error(`Cannot unregister "${moduleName}" because it's required by: ${dependentNames}`);
    }

    // Dispose the module
    if (module.isInitialized()) {
      await module.dispose();
    }

    this.modules.delete(moduleName);
    this.updateInitializationOrder();
  }

  /**
   * Get a feature module by name
   */
  get<T extends IFeatureModule>(moduleName: string): T | undefined {
    return this.modules.get(moduleName) as T;
  }

  /**
   * Check if a feature module is registered
   */
  has(moduleName: string): boolean {
    return this.modules.has(moduleName);
  }

  /**
   * Get all registered feature modules
   */
  getAll(): ReadonlyArray<IFeatureModule> {
    return Array.from(this.modules.values());
  }

  /**
   * Initialize all feature modules in dependency order
   */
  async initializeAll(): Promise<void> {
    for (const moduleName of this.initializationOrder) {
      const module = this.modules.get(moduleName);
      if (module && !module.isInitialized()) {
        try {
          await module.initialize();
        } catch (error) {
          console.error(`Failed to initialize feature module "${moduleName}":`, error);
          throw error;
        }
      }
    }
  }

  /**
   * Dispose all feature modules in reverse dependency order
   */
  async disposeAll(): Promise<void> {
    // Dispose in reverse order
    const reverseOrder = [...this.initializationOrder].reverse();

    for (const moduleName of reverseOrder) {
      const module = this.modules.get(moduleName);
      if (module && module.isInitialized()) {
        try {
          await module.dispose();
        } catch (error) {
          console.error(`Failed to dispose feature module "${moduleName}":`, error);
        }
      }
    }
  }

  /**
   * Get dependency graph
   */
  getDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();

    for (const [name, module] of this.modules) {
      graph.set(name, [...module.dependencies]);
    }

    return graph;
  }

  /**
   * Get initialization order
   */
  getInitializationOrder(): ReadonlyArray<string> {
    return [...this.initializationOrder];
  }

  /**
   * Get module statistics
   */
  getStats(): {
    totalModules: number;
    initializedModules: number;
    dependencies: Map<string, number>;
    circularDependencies: string[];
  } {
    const initializedModules = Array.from(this.modules.values())
      .filter(module => module.isInitialized()).length;

    const dependencies = new Map<string, number>();
    for (const [name, module] of this.modules) {
      dependencies.set(name, module.dependencies.length);
    }

    const circularDependencies = this.detectCircularDependencies();

    return {
      totalModules: this.modules.size,
      initializedModules,
      dependencies,
      circularDependencies
    };
  }

  /**
   * Update initialization order based on dependencies
   */
  private updateInitializationOrder(): void {
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const order: string[] = [];

    const visit = (moduleName: string): void => {
      if (visiting.has(moduleName)) {
        throw new Error(`Circular dependency detected involving "${moduleName}"`);
      }

      if (visited.has(moduleName)) {
        return;
      }

      visiting.add(moduleName);

      const module = this.modules.get(moduleName);
      if (module) {
        for (const dependency of module.dependencies) {
          visit(dependency);
        }
      }

      visiting.delete(moduleName);
      visited.add(moduleName);
      order.push(moduleName);
    };

    for (const moduleName of this.modules.keys()) {
      visit(moduleName);
    }

    this.initializationOrder = order;
  }

  /**
   * Detect circular dependencies
   */
  private detectCircularDependencies(): string[] {
    const cycles: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();
    const path: string[] = [];

    const detectCycle = (moduleName: string): void => {
      if (visiting.has(moduleName)) {
        const cycleStart = path.indexOf(moduleName);
        if (cycleStart !== -1) {
          cycles.push(path.slice(cycleStart).concat(moduleName).join(' -> '));
        }
        return;
      }

      if (visited.has(moduleName)) {
        return;
      }

      visiting.add(moduleName);
      path.push(moduleName);

      const module = this.modules.get(moduleName);
      if (module) {
        for (const dependency of module.dependencies) {
          detectCycle(dependency);
        }
      }

      visiting.delete(moduleName);
      visited.add(moduleName);
      path.pop();
    };

    for (const moduleName of this.modules.keys()) {
      detectCycle(moduleName);
    }

    return cycles;
  }
}

/**
 * Singleton instance of the feature module registry
 */
export const featureModuleRegistry = new FeatureModuleRegistry();