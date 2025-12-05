// Import reflect-metadata only when not in browser/Next.js environment
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  try {
    require('reflect-metadata');
  } catch (e) {
    // reflect-metadata not available, decorators will still work without metadata
  }
}

/**
 * Metadata keys for dependency injection
 */
export const INJECTABLE_METADATA_KEY = Symbol('injectable');
export const INJECT_METADATA_KEY = Symbol('inject');
export const INJECT_MANY_METADATA_KEY = Symbol('inject_many');

/**
 * Mark a class as injectable
 */
export function Injectable(options?: {
  lifetime?: 'transient' | 'singleton' | 'scoped';
  token?: string | symbol;
  dependencies?: string[];
  metadata?: Record<string, any>;
}): ClassDecorator {
  return function (target: any) {
    const existingMetadata = Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};

    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, {
      ...existingMetadata,
      lifetime: options?.lifetime || 'transient',
      token: options?.token,
      dependencies: options?.dependencies,
      metadata: options?.metadata || {}
    }, target);

    // Store constructor parameters for dependency resolution
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    Reflect.defineMetadata('design:paramtypes', paramTypes, target);
  };
}

/**
 * Inject a dependency by token
 */
export function Inject(token: string | symbol): ParameterDecorator {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingTokens = Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECT_METADATA_KEY, existingTokens, target);
  };
}

/**
 * Inject all dependencies matching the token
 */
export function InjectMany(token: string | symbol): ParameterDecorator {
  return function (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) {
    const existingTokens = Reflect.getMetadata(INJECT_MANY_METADATA_KEY, target) || [];
    existingTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECT_MANY_METADATA_KEY, existingTokens, target);
  };
}

/**
 * Auto-inject decorator for property injection
 */
export function AutoInject(token: string | symbol): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const existingProperties = Reflect.getMetadata('autoinject_properties', target) || {};
    existingProperties[propertyKey] = token;
    Reflect.defineMetadata('autoinject_properties', existingProperties, target);
  };
}

/**
 * Service configuration decorator
 */
export function Service(config: {
  token: string | symbol;
  lifetime?: 'transient' | 'singleton' | 'scoped';
  dependencies?: string[];
  metadata?: Record<string, any>;
}): ClassDecorator {
  return function (target: any) {
    Reflect.defineMetadata(INJECTABLE_METADATA_KEY, {
      token: config.token,
      lifetime: config.lifetime || 'transient',
      dependencies: config.dependencies,
      metadata: config.metadata || {}
    }, target);
  };
}

/**
 * Get injectable metadata for a class
 */
export function getInjectableMetadata(target: any): any {
  return Reflect.getMetadata(INJECTABLE_METADATA_KEY, target) || {};
}

/**
 * Get parameter tokens for injection
 */
export function getParameterTokens(target: any): (string | symbol)[] {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target) || [];
}

/**
 * Get parameter types for a constructor
 */
export function getParameterTypes(target: any): any[] {
  return Reflect.getMetadata('design:paramtypes', target) || [];
}

/**
 * Get auto-inject properties
 */
export function getAutoInjectProperties(target: any): Record<string | symbol, string | symbol> {
  return Reflect.getMetadata('autoinject_properties', target) || {};
}

/**
 * Validate that a class has proper metadata for injection
 */
export function validateInjectable(target: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const metadata = getInjectableMetadata(target);
  const paramTypes = getParameterTypes(target);
  const paramTokens = getParameterTokens(target);

  // Check if class is marked as injectable
  if (!metadata || !Object.keys(metadata).length) {
    errors.push('Class is not marked as @Injectable or @Service');
  }

  // Check parameter count mismatch
  if (paramTypes.length !== paramTokens.length && paramTokens.length > 0) {
    errors.push(`Parameter count mismatch: ${paramTypes.length} types vs ${paramTokens.length} tokens`);
  }

  // Check for missing parameter types
  if (paramTypes.some(type => type === undefined || type === null)) {
    errors.push('Missing parameter type information. Ensure "emitDecoratorMetadata": true in tsconfig.json');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}