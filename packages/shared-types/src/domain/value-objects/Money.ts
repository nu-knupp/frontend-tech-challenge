import { BaseValueObject } from '../IValueObject';
import { Result, success, failure } from '../../Result';

/**
 * Money Value Object
 * Represents monetary amounts with currency and proper arithmetic operations
 * Handles precision and currency conversion
 */
export class Money extends BaseValueObject<number> {
  private static readonly DEFAULT_CURRENCY = 'USD';
  private static readonly PRECISION = 2; // Decimal places for most currencies
  private static readonly MAX_AMOUNT = 999_999_999_999.99; // Maximum allowed amount

  private readonly _currency: string;

  constructor(amount: number, currency: string = Money.DEFAULT_CURRENCY) {
    super(amount, Money.validateAmount);
    this._currency = currency.toUpperCase();
  }

  /**
   * Create Money instance safely
   */
  static create(amount: number, currency?: string): Result<Money> {
    try {
      const money = new Money(amount, currency);
      return success(money);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Create Money from cents (integer amount)
   */
  static fromCents(cents: number, currency?: string): Money {
    const amount = cents / Math.pow(10, Money.PRECISION);
    return new Money(amount, currency);
  }

  /**
   * Create Money from string representation
   */
  static fromString(amountString: string, currency?: string): Money {
    const amount = parseFloat(amountString);
    if (isNaN(amount)) {
      throw new Error(`Invalid amount string: ${amountString}`);
    }
    return new Money(amount, currency);
  }

  /**
   * Get amount as number
   */
  get amount(): number {
    return this._value;
  }

  /**
   * Get currency code
   */
  get currency(): string {
    return this._currency;
  }

  /**
   * Get amount in cents (integer)
   */
  get cents(): number {
    return Math.round(this._value * Math.pow(10, Money.PRECISION));
  }

  /**
   * Add two Money instances
   */
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._value + other._value, this._currency);
  }

  /**
   * Subtract another Money instance
   */
  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._value - other._value, this._currency);
  }

  /**
   * Multiply by a number
   */
  multiply(factor: number): Money {
    const result = this._value * factor;
    return new Money(result, this._currency);
  }

  /**
   * Divide by a number
   */
  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Division by zero is not allowed');
    }
    const result = this._value / divisor;
    return new Money(result, this._currency);
  }

  /**
   * Calculate percentage
   */
  percentage(percentage: number): Money {
    return this.multiply(percentage / 100);
  }

  /**
   * Check if this is zero
   */
  isZero(): boolean {
    return Math.abs(this._value) < Number.EPSILON;
  }

  /**
   * Check if this is positive
   */
  isPositive(): boolean {
    return this._value > 0;
  }

  /**
   * Check if this is negative
   */
  isNegative(): boolean {
    return this._value < 0;
  }

  /**
   * Check if this is greater than another Money instance
   */
  greaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._value > other._value;
  }

  /**
   * Check if this is greater than or equal to another Money instance
   */
  greaterThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._value >= other._value;
  }

  /**
   * Check if this is less than another Money instance
   */
  lessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._value < other._value;
  }

  /**
   * Check if this is less than or equal to another Money instance
   */
  lessThanOrEqual(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this._value <= other._value;
  }

  /**
   * Get absolute value
   */
  absolute(): Money {
    return new Money(Math.abs(this._value), this._currency);
  }

  /**
   * Round to specified decimal places
   */
  round(decimalPlaces: number = Money.PRECISION): Money {
    const factor = Math.pow(10, decimalPlaces);
    const rounded = Math.round(this._value * factor) / factor;
    return new Money(rounded, this._currency);
  }

  /**
   * Format for display
   */
  format(locale: string = 'en-US', options?: Intl.NumberFormatOptions): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: this._currency,
      minimumFractionDigits: Money.PRECISION,
      maximumFractionDigits: Money.PRECISION,
      ...options
    }).format(this._value);
  }

  /**
   * Compare with another Money instance
   */
  compareTo(other: Money): number {
    this.ensureSameCurrency(other);

    if (this._value < other._value) return -1;
    if (this._value > other._value) return 1;
    return 0;
  }

  /**
   * Clone this Money instance
   */
  clone(): Money {
    return new Money(this._value, this._currency);
  }

  /**
   * String representation
   */
  toString(): string {
    return `${this._currency} ${this._value.toFixed(Money.PRECISION)}`;
  }

  /**
   * JSON representation with currency
   */
  toJSONWithCurrency(): { amount: number; currency: string } {
    return {
      amount: this._value,
      currency: this._currency
    };
  }

  /**
   * Base JSON representation (returns just the amount as expected by BaseValueObject)
   */
  toJSON(): number {
    return this._value;
  }

  /**
   * Validate amount
   */
  private static validateAmount(amount: number): string[] {
    const errors: string[] = [];

    if (typeof amount !== 'number' || isNaN(amount)) {
      errors.push('Amount must be a valid number');
    }

    if (amount < 0) {
      errors.push('Amount cannot be negative');
    }

    if (amount > Money.MAX_AMOUNT) {
      errors.push(`Amount cannot exceed ${Money.MAX_AMOUNT}`);
    }

    if (!isFinite(amount)) {
      errors.push('Amount must be finite');
    }

    return errors;
  }

  /**
   * Ensure currencies match
   */
  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error(`Currency mismatch: ${this._currency} vs ${other._currency}`);
    }
  }

  /**
   * Create zero Money instance
   */
  static zero(currency?: string): Money {
    return new Money(0, currency);
  }

  /**
   * Create Money instance from JSON
   */
  static fromJSON(json: { amount: number; currency: string }): Money {
    return new Money(json.amount, json.currency);
  }

  /**
   * Sum an array of Money instances
   */
  static sum(moneys: Money[]): Money {
    if (moneys.length === 0) {
      throw new Error('Cannot sum empty array');
    }

    const currency = moneys[0].currency;
    const total = moneys.reduce((sum, money) => {
      if (money.currency !== currency) {
        throw new Error('All Money instances must have the same currency');
      }
      return sum + money.amount;
    }, 0);

    return new Money(total, currency);
  }

  /**
   * Find maximum Money instance
   */
  static max(moneys: Money[]): Money {
    if (moneys.length === 0) {
      throw new Error('Cannot find max of empty array');
    }

    return moneys.reduce((max, money) => money.greaterThan(max) ? money : max);
  }

  /**
   * Find minimum Money instance
   */
  static min(moneys: Money[]): Money {
    if (moneys.length === 0) {
      throw new Error('Cannot find min of empty array');
    }

    return moneys.reduce((min, money) => money.lessThan(min) ? money : min);
  }

  /**
   * Calculate average of Money instances
   */
  static average(moneys: Money[]): Money {
    if (moneys.length === 0) {
      throw new Error('Cannot calculate average of empty array');
    }

    const sum = Money.sum(moneys);
    return sum.divide(moneys.length);
  }
}