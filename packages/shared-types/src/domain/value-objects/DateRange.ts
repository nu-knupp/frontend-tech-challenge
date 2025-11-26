import { BaseValueObject, IValueObject } from '../IValueObject';
import { Result, success, failure } from '../../Result';

/**
 * DateRange Value Object
 * Represents a range of dates with proper validation and utility methods
 */
export class DateRange extends BaseValueObject<{
  startDate: Date;
  endDate: Date;
}> {
  constructor(startDate: Date, endDate: Date) {
    super({ startDate, endDate }, DateRange.validateDateRange);
  }

  /**
   * Create DateRange instance safely
   */
  static create(startDate: Date, endDate: Date): Result<DateRange> {
    try {
      const dateRange = new DateRange(startDate, endDate);
      return success(dateRange);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Create DateRange from string dates
   */
  static fromStrings(startDateString: string, endDateString: string): DateRange {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date strings provided');
    }

    return new DateRange(startDate, endDate);
  }

  /**
   * Create DateRange for a single day
   */
  static singleDay(date: Date): DateRange {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return new DateRange(startOfDay, endOfDay);
  }

  /**
   * Create DateRange for this week
   */
  static thisWeek(): DateRange {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return new DateRange(startOfWeek, endOfWeek);
  }

  /**
   * Create DateRange for this month
   */
  static thisMonth(): DateRange {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return new DateRange(startOfMonth, endOfMonth);
  }

  /**
   * Create DateRange for this year
   */
  static thisYear(): DateRange {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);

    return new DateRange(startOfYear, endOfYear);
  }

  /**
   * Create DateRange for last N days
   */
  static lastDays(days: number): DateRange {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days + 1);
    startDate.setHours(0, 0, 0, 0);

    return new DateRange(startDate, endDate);
  }

  /**
   * Create DateRange for last N months
   */
  static lastMonths(months: number): DateRange {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setMonth(endDate.getMonth() - months + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    return new DateRange(startDate, endDate);
  }

  /**
   * Get start date
   */
  get startDate(): Date {
    return new Date(this._value.startDate);
  }

  /**
   * Get end date
   */
  get endDate(): Date {
    return new Date(this._value.endDate);
  }

  /**
   * Get duration in days
   */
  get durationInDays(): number {
    const diffTime = Math.abs(this._value.endDate.getTime() - this._value.startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Check if a date is within this range
   */
  contains(date: Date): boolean {
    const checkDate = new Date(date);
    return checkDate >= this._value.startDate && checkDate <= this._value.endDate;
  }

  /**
   * Check if this range overlaps with another
   */
  overlaps(other: DateRange): boolean {
    return this._value.startDate <= other._value.endDate &&
           this._value.endDate >= other._value.startDate;
  }

  /**
   * Check if this range is completely within another
   */
  isWithin(other: DateRange): boolean {
    return this._value.startDate >= other._value.startDate &&
           this._value.endDate <= other._value.endDate;
  }

  /**
   * Check if this range completely contains another
   */
  containsRange(other: DateRange): boolean {
    return this._value.startDate <= other._value.startDate &&
           this._value.endDate >= other._value.endDate;
  }

  /**
   * Get the intersection with another DateRange
   */
  intersection(other: DateRange): DateRange | null {
    if (!this.overlaps(other)) {
      return null;
    }

    const start = this._value.startDate > other._value.startDate
      ? this._value.startDate
      : other._value.startDate;

    const end = this._value.endDate < other._value.endDate
      ? this._value.endDate
      : other._value.endDate;

    return new DateRange(start, end);
  }

  /**
   * Get the union with another DateRange
   */
  union(other: DateRange): DateRange | null {
    if (!this.overlaps(other)) {
      return null; // Cannot union non-overlapping ranges
    }

    const start = this._value.startDate < other._value.startDate
      ? this._value.startDate
      : other._value.startDate;

    const end = this._value.endDate > other._value.endDate
      ? this._value.endDate
      : other._value.endDate;

    return new DateRange(start, end);
  }

  /**
   * Extend this range by N days
   */
  extend(days: number): DateRange {
    const newStartDate = new Date(this._value.startDate);
    const newEndDate = new Date(this._value.endDate);

    if (days > 0) {
      newEndDate.setDate(newEndDate.getDate() + days);
    } else {
      newStartDate.setDate(newStartDate.getDate() + days);
    }

    return new DateRange(newStartDate, newEndDate);
  }

  /**
   * Shift this range by N days
   */
  shift(days: number): DateRange {
    const newStartDate = new Date(this._value.startDate);
    const newEndDate = new Date(this._value.endDate);

    newStartDate.setDate(newStartDate.getDate() + days);
    newEndDate.setDate(newEndDate.getDate() + days);

    return new DateRange(newStartDate, newEndDate);
  }

  /**
   * Expand this range to include a specific date
   */
  expandToInclude(date: Date): DateRange {
    const newStartDate = new Date(this._value.startDate);
    const newEndDate = new Date(this._value.endDate);

    if (date < newStartDate) {
      return new DateRange(date, newEndDate);
    }

    if (date > newEndDate) {
      return new DateRange(newStartDate, date);
    }

    return this.clone();
  }

  /**
   * Get array of dates in this range
   */
  getDates(): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(this._value.startDate);

    while (currentDate <= this._value.endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  /**
   * Split this range by a specific date
   */
  splitBy(date: Date): [DateRange | null, DateRange | null] {
    if (!this.contains(date)) {
      return [null, null];
    }

    if (date.getTime() === this._value.startDate.getTime()) {
      return [null, this.clone()];
    }

    if (date.getTime() === this._value.endDate.getTime()) {
      return [this.clone(), null];
    }

    const firstRange = new DateRange(this._value.startDate, date);
    const secondRange = new DateRange(date, this._value.endDate);

    return [firstRange, secondRange];
  }

  /**
   * Clone this DateRange
   */
  clone(): DateRange {
    return new DateRange(
      new Date(this._value.startDate),
      new Date(this._value.endDate)
    );
  }

  /**
   * Format for display
   */
  format(locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };

    const startFormatted = this._value.startDate.toLocaleDateString(locale, dateOptions);
    const endFormatted = this._value.endDate.toLocaleDateString(locale, dateOptions);

    return `${startFormatted} - ${endFormatted}`;
  }

  /**
   * String representation
   */
  toString(): string {
    return `DateRange(${this._value.startDate.toISOString()} to ${this._value.endDate.toISOString()})`;
  }

  /**
   * JSON representation with ISO strings
   */
  toISOString(): {
    startDate: string;
    endDate: string;
  } {
    return {
      startDate: this._value.startDate.toISOString(),
      endDate: this._value.endDate.toISOString()
    };
  }

  /**
   * Base JSON representation (as expected by BaseValueObject)
   */
  toJSON(): { startDate: Date; endDate: Date } {
    return {
      startDate: this._value.startDate,
      endDate: this._value.endDate
    };
  }

  /**
   * Validate date range
   */
  private static validateDateRange(range: { startDate: Date; endDate: Date }): string[] {
    const errors: string[] = [];

    if (!(range.startDate instanceof Date) || isNaN(range.startDate.getTime())) {
      errors.push('Start date must be a valid Date');
    }

    if (!(range.endDate instanceof Date) || isNaN(range.endDate.getTime())) {
      errors.push('End date must be a valid Date');
    }

    if (range.startDate > range.endDate) {
      errors.push('Start date must be before or equal to end date');
    }

    return errors;
  }

  /**
   * Create DateRange from JSON
   */
  static fromJSON(json: { startDate: string; endDate: string }): DateRange {
    const startDate = new Date(json.startDate);
    const endDate = new Date(json.endDate);

    return new DateRange(startDate, endDate);
  }

  /**
   * Check if two DateRanges are equal
   */
  equals(other: IValueObject<{ startDate: Date; endDate: Date }>): boolean {
    if (!(other instanceof DateRange)) {
      return false;
    }

    return this._value.startDate.getTime() === other._value.startDate.getTime() &&
           this._value.endDate.getTime() === other._value.endDate.getTime();
  }

  /**
   * Get range that covers multiple DateRanges
   */
  static coveringRange(ranges: DateRange[]): DateRange {
    if (ranges.length === 0) {
      throw new Error('Cannot create covering range from empty array');
    }

    const allStartDates = ranges.map(r => r.startDate);
    const allEndDates = ranges.map(r => r.endDate);

    const minStart = new Date(Math.min(...allStartDates.map(d => d.getTime())));
    const maxEnd = new Date(Math.max(...allEndDates.map(d => d.getTime())));

    return new DateRange(minStart, maxEnd);
  }

  /**
   * Check if a collection of DateRanges has any overlaps
   */
  static hasAnyOverlaps(ranges: DateRange[]): boolean {
    for (let i = 0; i < ranges.length; i++) {
      for (let j = i + 1; j < ranges.length; j++) {
        if (ranges[i].overlaps(ranges[j])) {
          return true;
        }
      }
    }
    return false;
  }
}