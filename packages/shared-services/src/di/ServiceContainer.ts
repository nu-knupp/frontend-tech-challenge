import {
	IServiceContainer,
	ServiceDescriptor,
	ServiceLifetime,
	ServiceRegistrationOptions,
} from "./IServiceContainer";

/**
 * Dependency Injection Container implementation
 * Manages service registration, resolution, and lifetimes
 */
export class ServiceContainer implements IServiceContainer {
	private services = new Map<string | symbol, ServiceDescriptor>();
	private singletons = new Map<string | symbol, any>();
	private scoped = new Map<string | symbol, any>();
	private parent?: ServiceContainer;
	private disposed = false;

	/**
	 * Create a new service container
	 */
	constructor(parent?: ServiceContainer) {
		this.parent = parent;
	}

	/**
	 * Register a service implementation class
	 */
	register<T>(
		token: string | symbol,
		implementation: new (...args: any[]) => T,
		options: ServiceRegistrationOptions = {},
	): IServiceContainer {
		this.checkDisposed();

		const key = this.getKey(token);
		const existing = this.services.get(key);

		if (existing && !options.replace) {
			throw new Error(
				`Service "${String(token)}" is already registered. Use replace: true to overwrite.`,
			);
		}

		const descriptor: ServiceDescriptor = {
			token: key,
			implementation,
			lifetime: options.lifetime || ServiceLifetime.Transient,
			factory: options.factory,
			dependencies: options.dependencies || [],
			metadata: options.metadata || {},
		};

		this.services.set(key, descriptor);
		return this;
	}

	/**
	 * Register a service instance
	 */
	registerInstance<T>(
		token: string | symbol,
		instance: T,
		options: ServiceRegistrationOptions = {},
	): IServiceContainer {
		this.checkDisposed();

		const key = this.getKey(token);
		const existing = this.services.get(key);

		if (existing && !options.replace) {
			throw new Error(
				`Service "${String(token)}" is already registered. Use replace: true to overwrite.`,
			);
		}

		this.singletons.set(key, instance);

		const descriptor: ServiceDescriptor = {
			token: key,
			implementation: (instance as object).constructor as new (
				...args: any[]
			) => T,
			lifetime: ServiceLifetime.Singleton,
			dependencies: [],
			metadata: {
				...options.metadata,
				isInstance: true,
			},
		};

		this.services.set(key, descriptor);
		return this;
	}

	/**
	 * Register a service factory function
	 */
	registerFactory<T>(
		token: string | symbol,
		factory: (container: IServiceContainer) => T,
		options: ServiceRegistrationOptions = {},
	): IServiceContainer {
		this.checkDisposed();

		const key = this.getKey(token);
		const existing = this.services.get(key);

		if (existing && !options.replace) {
			throw new Error(
				`Service "${String(token)}" is already registered. Use replace: true to overwrite.`,
			);
		}

		const descriptor: ServiceDescriptor = {
			token: key,
			implementation: null,
			lifetime: options.lifetime || ServiceLifetime.Transient,
			factory,
			dependencies: options.dependencies || [],
			metadata: {
				...options.metadata,
				isFactory: true,
			},
		};

		this.services.set(key, descriptor);
		return this;
	}

	/**
	 * Resolve a service
	 */
	resolve<T>(token: string | symbol): T {
		this.checkDisposed();

		const key = this.getKey(token);
		let descriptor = this.services.get(key);

		// Check parent container if service not found
		if (!descriptor && this.parent) {
			try {
				return this.parent.resolve<T>(token);
			} catch (error) {
				// Service not found in parent either
			}
		}

		if (!descriptor) {
			throw new Error(`Service "${String(token)}" is not registered`);
		}

		return this.createInstance<T>(descriptor);
	}

	/**
	 * Try to resolve a service (returns null if not found)
	 */
	tryResolve<T>(token: string | symbol): T | null {
		try {
			return this.resolve<T>(token);
		} catch {
			return null;
		}
	}

	/**
	 * Check if a service is registered
	 */
	isRegistered(token: string | symbol): boolean {
		const key = this.getKey(token);
		return (
			this.services.has(key) || (this.parent?.isRegistered(token) ?? false)
		);
	}

	/**
	 * Unregister a service
	 */
	unregister(token: string | symbol): IServiceContainer {
		this.checkDisposed();

		const key = this.getKey(token);
		this.services.delete(key);
		this.singletons.delete(key);
		this.scoped.delete(key);

		return this;
	}

	/**
	 * Clear all services
	 */
	clear(): IServiceContainer {
		this.checkDisposed();

		this.services.clear();
		this.singletons.clear();
		this.scoped.clear();

		return this;
	}

	/**
	 * Create a child scope
	 */
	createScope(): IServiceContainer {
		this.checkDisposed();
		return new ServiceContainer(this);
	}

	/**
	 * Get service information
	 */
	getServiceInfo(token: string | symbol): ServiceDescriptor | null {
		const key = this.getKey(token);
		return this.services.get(key) || null;
	}

	/**
	 * Get all registered services
	 */
	getRegisteredServices(): Array<string | symbol> {
		return Array.from(this.services.keys());
	}

	/**
	 * Validate dependency graph
	 */
	validateDependencies(): {
		isValid: boolean;
		errors: Array<{
			service: string | symbol;
			error: string;
		}>;
	} {
		const errors: Array<{ service: string | symbol; error: string }> = [];
		const visited = new Set<string | symbol>();
		const visiting = new Set<string | symbol>();

		const validate = (serviceToken: string | symbol): void => {
			if (visiting.has(serviceToken)) {
				errors.push({
					service: serviceToken,
					error: "Circular dependency detected",
				});
				return;
			}

			if (visited.has(serviceToken)) {
				return;
			}

			visiting.add(serviceToken);
			visited.add(serviceToken);

			const descriptor = this.services.get(this.getKey(serviceToken));
			if (descriptor?.dependencies) {
				descriptor.dependencies.forEach((dep) => {
					if (!this.isRegistered(dep)) {
						errors.push({
							service: serviceToken,
							error: `Dependency "${String(dep)}" is not registered`,
						});
					} else {
						validate(dep);
					}
				});
			}

			visiting.delete(serviceToken);
		};

		for (const serviceToken of this.services.keys()) {
			validate(serviceToken);
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Dispose of all disposable services
	 */
	async dispose(): Promise<void> {
		if (this.disposed) {
			return;
		}

		// Dispose singletons
		for (const [key, instance] of this.singletons) {
			if (instance && typeof instance.dispose === "function") {
				try {
					await instance.dispose();
				} catch (error) {
					console.error(`Error disposing service "${String(key)}":`, error);
				}
			}
		}

		// Dispose scoped instances
		for (const [key, instance] of this.scoped) {
			if (instance && typeof instance.dispose === "function") {
				try {
					await instance.dispose();
				} catch (error) {
					console.error(
						`Error disposing scoped service "${String(key)}":`,
						error,
					);
				}
			}
		}

		this.services.clear();
		this.singletons.clear();
		this.scoped.clear();
		this.disposed = true;
	}

	/**
	 * Create instance based on descriptor
	 */
	private createInstance<T>(descriptor: ServiceDescriptor): T {
		const key = descriptor.token;

		// Handle singleton instances
		if (descriptor.lifetime === ServiceLifetime.Singleton) {
			if (this.singletons.has(key)) {
				return this.singletons.get(key);
			}

			const instance = this.createNewInstance<T>(descriptor);
			this.singletons.set(key, instance);
			return instance as T;
		}

		// Handle scoped instances
		if (descriptor.lifetime === ServiceLifetime.Scoped) {
			if (this.scoped.has(key)) {
				return this.scoped.get(key);
			}

			const instance = this.createNewInstance<T>(descriptor);
			this.scoped.set(key, instance);
			return instance as T;
		}

		// Handle transient instances (always create new)
		return this.createNewInstance<T>(descriptor);
	}

	/**
	 * Create new instance of service
	 */
	private createNewInstance<T>(descriptor: ServiceDescriptor): T {
		try {
			// Handle factory functions
			if (descriptor.factory) {
				return descriptor.factory(this);
			}

			// Handle factory registered service
			if (descriptor.metadata?.isFactory) {
				return descriptor.implementation(this);
			}

			// Handle class implementation
			if (
				descriptor.implementation &&
				typeof descriptor.implementation === "function"
			) {
				const dependencies = this.resolveDependencies(
					descriptor.dependencies || [],
				);
				return new descriptor.implementation(...dependencies);
			}

			throw new Error(
				`Invalid service configuration for "${String(descriptor.token)}"`,
			);
		} catch (error) {
			throw new Error(
				`Failed to create instance of service "${String(descriptor.token)}": ${error}`,
			);
		}
	}

	/**
	 * Resolve dependencies
	 */
	private resolveDependencies(dependencies: string[]): any[] {
		return dependencies.map((dep) => this.resolve(dep));
	}

	/**
	 * Get consistent key for service
	 */
	private getKey(token: string | symbol): string | symbol {
		return token;
	}

	/**
	 * Check if container is disposed
	 */
	private checkDisposed(): void {
		if (this.disposed) {
			throw new Error("ServiceContainer has been disposed");
		}
	}

	/**
	 * Get container statistics
	 */
	getStats(): {
		totalServices: number;
		singletons: number;
		scoped: number;
		transients: number;
		disposed: boolean;
		hasParent: boolean;
	} {
		let singletons = 0;
		let scoped = 0;
		let transients = 0;

		for (const descriptor of this.services.values()) {
			switch (descriptor.lifetime) {
				case ServiceLifetime.Singleton:
					singletons++;
					break;
				case ServiceLifetime.Scoped:
					scoped++;
					break;
				case ServiceLifetime.Transient:
					transients++;
					break;
			}
		}

		return {
			totalServices: this.services.size,
			singletons,
			scoped,
			transients,
			disposed: this.disposed,
			hasParent: !!this.parent,
		};
	}
}
