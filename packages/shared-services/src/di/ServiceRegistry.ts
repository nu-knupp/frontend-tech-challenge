import { IServiceContainer, ServiceLifetime } from "./IServiceContainer";
import { ServiceContainer } from "./ServiceContainer";
import {
	Injectable,
	getInjectableMetadata,
	getParameterTokens,
	getParameterTypes,
	getAutoInjectProperties,
	validateInjectable,
} from "./decorators";

/**
 * Service Registry for automatic service registration
 * Handles discovery and registration of injectable services
 */
export class ServiceRegistry {
	private container: IServiceContainer;
	private registeredClasses = new Set<any>();

	constructor(container?: IServiceContainer) {
		this.container = container || new ServiceContainer();
	}

	/**
	 * Get the underlying container
	 */
	getContainer(): IServiceContainer {
		return this.container;
	}

	/**
	 * Register a single class automatically
	 */
	registerClass<T>(
		target: new (...args: any[]) => T,
		token?: string | symbol,
	): IServiceContainer {
		const validation = validateInjectable(target);
		if (!validation.isValid) {
			throw new Error(
				`Cannot register ${target.name}: ${validation.errors.join(", ")}`,
			);
		}

		const metadata = getInjectableMetadata(target);
		const serviceToken = token || metadata.token || target;

		if (this.registeredClasses.has(target)) {
			return this.container;
		}

		this.registeredClasses.add(target);

		// Auto-register dependencies first
		this.autoRegisterDependencies(target);

		// Register with factory to handle constructor injection
		return this.container.registerFactory(
			serviceToken,
			(container) => {
				return this.createInstance(target, container);
			},
			{
				lifetime: metadata.lifetime as any,
				dependencies: metadata.dependencies,
				metadata: metadata.metadata,
			},
		);
	}

	/**
	 * Register multiple classes from an array
	 */
	registerClasses(
		classes: Array<new (...args: any[]) => any>,
	): IServiceContainer {
		classes.forEach((target) => this.registerClass(target));
		return this.container;
	}

	/**
	 * Register all classes from a module/object
	 */
	registerFromModule(module: any): IServiceContainer {
		const classes = this.extractClassesFromModule(module);
		this.registerClasses(classes);
		return this.container;
	}

	/**
	 * Register services with explicit configuration
	 */
	registerServices(
		config: Array<{
			token: string | symbol;
			implementation: any;
			lifetime?: ServiceLifetime;
			dependencies?: string[];
			metadata?: Record<string, any>;
		}>,
	): IServiceContainer {
		config.forEach((service) => {
			this.container.register(service.token, service.implementation, {
				lifetime: service.lifetime,
				dependencies: service.dependencies,
				metadata: service.metadata,
			});
		});

		return this.container;
	}

	/**
	 * Create and register a singleton instance
	 */
	registerSingleton<T>(token: string | symbol, instance: T): IServiceContainer {
		this.container.registerInstance(token, instance);
		return this.container;
	}

	/**
	 * Auto-discover and register services
	 */
	autoDiscover(context: any = window): IServiceContainer {
		// Auto-discovery would typically scan for classes with @Injectable decorator
		// This is a simplified version for demonstration
		return this.container;
	}

	/**
	 * Create instance with dependency injection
	 */
	private createInstance<T>(
		target: new (...args: any[]) => T,
		container: IServiceContainer,
	): T {
		const paramTypes = getParameterTypes(target);
		const paramTokens = getParameterTokens(target);

		// Resolve dependencies
		const dependencies = paramTypes.map((paramType, index) => {
			const token = paramTokens[index];

			if (token) {
				return container.resolve(token);
			}

			// Try to resolve by type if no explicit token
			if (paramType && paramType.name && paramType.name !== "Object") {
				try {
					return container.resolve(paramType);
				} catch {
					// Fallback: try to create instance directly
					if (this.isSimpleClass(paramType)) {
						return new paramType();
					}
				}
			}

			throw new Error(`Cannot resolve dependency ${index} for ${target.name}`);
		});

		// Create instance
		const instance = new target(...dependencies);

		// Inject properties
		this.injectProperties(instance, container);

		return instance;
	}

	/**
	 * Inject properties marked with @AutoInject
	 */
	private injectProperties(instance: any, container: IServiceContainer): void {
		const properties = getAutoInjectProperties(instance.constructor);

		for (const [propertyKey, token] of Object.entries(properties)) {
			try {
				instance[propertyKey] = container.resolve(token);
			} catch (error) {
				console.warn(
					`Failed to inject property ${String(propertyKey)}:`,
					error,
				);
			}
		}
	}

	/**
	 * Auto-register dependencies of a class
	 */
	private autoRegisterDependencies(target: any): void {
		const paramTypes = getParameterTypes(target);
		const paramTokens = getParameterTokens(target);

		paramTypes.forEach((paramType, index) => {
			const token = paramTokens[index] || paramType;

			// Try to auto-register if not already registered
			if (!this.container.isRegistered(token)) {
				try {
					// Check if paramType has Injectable metadata
					if (
						paramType &&
						paramType !== Object &&
						this.hasInjectableMetadata(paramType)
					) {
						this.registerClass(paramType, paramTokens[index]);
					}
				} catch {
					// Skip auto-registration if it fails
				}
			}
		});
	}

	/**
	 * Extract classes from a module
	 */
	private extractClassesFromModule(
		module: any,
	): Array<new (...args: any[]) => any> {
		const classes: Array<new (...args: any[]) => any> = [];

		for (const key in module) {
			const exported = module[key];

			if (
				this.isClassConstructor(exported) &&
				this.hasInjectableMetadata(exported)
			) {
				classes.push(exported);
			}
		}

		return classes;
	}

	/**
	 * Check if something is a class constructor
	 */
	private isClassConstructor(obj: any): boolean {
		return (
			typeof obj === "function" &&
			obj.prototype !== undefined &&
			obj.prototype.constructor === obj &&
			obj.name !== "" // Exclude anonymous classes
		);
	}

	/**
	 * Check if a class has injectable metadata
	 */
	private hasInjectableMetadata(target: any): boolean {
		try {
			const metadata = getInjectableMetadata(target);
			return Object.keys(metadata).length > 0;
		} catch {
			return false;
		}
	}

	/**
	 * Check if a class is simple enough to create without dependencies
	 */
	private isSimpleClass(target: any): boolean {
		// Simple heuristic: check if constructor has no parameters
		const paramTypes = getParameterTypes(target);
		return paramTypes.length === 0;
	}

	/**
	 * Get registration statistics
	 */
	getStats(): {
		registeredClasses: number;
		containerStats: any;
	} {
		return {
			registeredClasses: this.registeredClasses.size,
			containerStats: (this.container as any).getStats?.() || {},
		};
	}

	/**
	 * Validate all registered services
	 */
	validateRegistration(): {
		isValid: boolean;
		errors: Array<{
			service: string | symbol;
			error: string;
		}>;
	} {
		return this.container.validateDependencies();
	}

	/**
	 * Create a child registry with a new scope
	 */
	createScope(): ServiceRegistry {
		const newContainer = this.container.createScope();
		return new ServiceRegistry(newContainer);
	}

	/**
	 * Dispose of the registry and container
	 */
	async dispose(): Promise<void> {
		await this.container.dispose();
		this.registeredClasses.clear();
	}
}

/**
 * Global service registry instance
 */
export const globalRegistry = new ServiceRegistry();

/**
 * Convenience functions for working with the global registry
 */
export function registerService<T>(
	target: new (...args: any[]) => T,
	token?: string | symbol,
): IServiceContainer {
	return globalRegistry.registerClass(target, token);
}

export function resolveService<T>(token: string | symbol): T {
	return globalRegistry.getContainer().resolve<T>(token);
}

export function tryResolveService<T>(token: string | symbol): T | null {
	return globalRegistry.getContainer().tryResolve<T>(token);
}
