/**
 * Base interface for all Value Objects
 * Value Objects are immutable objects that are defined by their values rather than their identity
 */
export interface IValueObject<T = any> {
  /**
   * Get the raw value of the value object
   */
  value(): T;

  /**
   * Check if this value object equals another
   */
  equals(other: IValueObject<T>): boolean;

  /**
   * Convert to string representation
   */
  toString(): string;

  /**
   * Convert to JSON representation
   */
  toJSON(): T;

  /**
   * Check if the value object is valid
   */
  isValid(): boolean;

  /**
   * Get validation errors if any
   */
  getValidationErrors(): string[];
}

/**
 * Base abstract class for Value Objects
 * Provides common implementation for value objects
 */
export abstract class BaseValueObject<T> implements IValueObject<T> {
  protected readonly _value: T;
  private readonly _validationErrors: string[];

  constructor(value: T, validator?: (value: T) => string[]) {
    this._value = this.cloneValue(value);
    this._validationErrors = validator ? validator(value) : [];

    if (this._validationErrors.length > 0) {
      throw new Error(`Invalid ${this.constructor.name}: ${this._validationErrors.join(', ')}`);
    }
  }

  /**
   * Get the raw value
   */
  value(): T {
    return this.cloneValue(this._value);
  }

  /**
   * Check equality with another value object
   */
  equals(other: IValueObject<T>): boolean {
    if (this.constructor !== other.constructor) {
      return false;
    }

    return this.deepEqual(this._value, other.value());
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this.constructor.name}(${JSON.stringify(this._value)})`;
  }

  /**
   * JSON representation
   */
  toJSON(): T {
    return this.value();
  }

  /**
   * Check if valid
   */
  isValid(): boolean {
    return this._validationErrors.length === 0;
  }

  /**
   * Get validation errors
   */
  getValidationErrors(): string[] {
    return [...this._validationErrors];
  }

  /**
   * Clone value to ensure immutability
   */
  protected cloneValue(value: T): T {
    if (value === null || value === undefined) {
      return value;
    }

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return [...value] as T;
      } else {
        return { ...value } as T;
      }
    }

    return value;
  }

  /**
   * Deep equality check
   */
  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;

    if (a == null || b == null) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);

      if (keysA.length !== keysB.length) return false;

      for (const key of keysA) {
        if (!keysB.includes(key) || !this.deepEqual(a[key], b[key])) return false;
      }

      return true;
    }

    return false;
  }

  /**
   * Override for custom serialization
   */
  protected serialize(value: T): any {
    return value;
  }

  /**
   * Override for custom deserialization
   */
  protected deserialize(value: any): T {
    return value as T;
  }
}

