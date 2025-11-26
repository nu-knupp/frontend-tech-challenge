import { BaseValueObject } from '../IValueObject';
import { Result, success, failure } from '../../Result';

/**
 * Email Value Object
 * Represents an email address with validation and utility methods
 */
export class Email extends BaseValueObject<string> {
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(email: string) {
    super(email.toLowerCase().trim(), Email.validateEmail);
  }

  /**
   * Create Email instance safely
   */
  static create(email: string): Result<Email> {
    try {
      const emailObj = new Email(email);
      return success(emailObj);
    } catch (error) {
      return failure(error instanceof Error ? error : new Error('Unknown error'));
    }
  }

  /**
   * Get username part (before @)
   */
  get username(): string {
    const atIndex = this._value.indexOf('@');
    return atIndex > 0 ? this._value.substring(0, atIndex) : '';
  }

  /**
   * Get domain part (after @)
   */
  get domain(): string {
    const atIndex = this._value.indexOf('@');
    return atIndex > 0 && atIndex < this._value.length - 1
      ? this._value.substring(atIndex + 1)
      : '';
  }

  /**
   * Check if this is from a specific domain
   */
  isFromDomain(domain: string): boolean {
    return this.domain.toLowerCase() === domain.toLowerCase();
  }

  /**
   * Check if this is from a specific domain list
   */
  isFromAnyDomain(domains: string[]): boolean {
    return domains.some(domain => this.isFromDomain(domain));
  }

  /**
   * Check if this is from a common email provider
   */
  isFromCommonProvider(): boolean {
    const commonProviders = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'protonmail.com',
      'zoho.com'
    ];
    return this.isFromAnyDomain(commonProviders);
  }

  /**
   * Check if this is a business email (not from common providers)
   */
  isBusinessEmail(): boolean {
    return !this.isFromCommonProvider();
  }

  /**
   * Check if this is a disposable email
   */
  isDisposable(): boolean {
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'yopmail.com',
      'throwaway.email'
    ];
    return this.isFromAnyDomain(disposableDomains);
  }

  /**
   * Check if this is a valid corporate email format
   */
  isCorporateFormat(): boolean {
    // Corporate emails typically have first.last, flast, or similar formats
    const corporatePatterns = [
      /^[a-z]+\.[a-z]+@/, // first.last
      /^[a-z]{1,2}[a-z]+\.[a-z]+@/, // initials.last
      /^[a-z]+[0-9]*@/, // name with optional numbers
    ];

    return corporatePatterns.some(pattern => pattern.test(this._value));
  }

  /**
   * Mask the email for display (e.g., jo***@example.com)
   */
  mask(showCharacters: number = 2): string {
    const atIndex = this._value.indexOf('@');
    if (atIndex <= 0) return this._value;

    const username = this._value.substring(0, atIndex);
    const domain = this._value.substring(atIndex);

    if (username.length <= showCharacters) {
      return '*'.repeat(username.length) + domain;
    }

    const visiblePart = username.substring(0, showCharacters);
    const maskedPart = '*'.repeat(username.length - showCharacters);

    return visiblePart + maskedPart + domain;
  }

  /**
   * Get initials from email username
   */
  getInitials(): string {
    const parts = this.username.split(/[._-]/);
    return parts
      .filter(part => part.length > 0)
      .map(part => part[0].toUpperCase())
      .join('')
      .substring(0, 2);
  }

  /**
   * Generate a gravatar URL
   */
  getGravatarUrl(size: number = 80, defaultImage: string = 'identicon'): string {
    const hash = require('crypto')
      .createHash('md5')
      .update(this._value.toLowerCase())
      .digest('hex');

    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
  }

  /**
   * Check if email looks like it might be a test email
   */
  isTestEmail(): boolean {
    const testIndicators = [
      'test',
      'demo',
      'sample',
      'example',
      'dummy',
      'fake'
    ];

    const lowerEmail = this._value.toLowerCase();
    return testIndicators.some(indicator => lowerEmail.includes(indicator));
  }

  /**
   * Get suggested variations for common typos
   */
  getSuggestions(): string[] {
    const suggestions: string[] = [];
    const commonTypos: Record<string, string> = {
      'gnail': 'gmail',
      'gamil': 'gmail',
      'gmial': 'gmail',
      'yahooo': 'yahoo',
      'yhoo': 'yahoo',
      'hotmial': 'hotmail',
      'hotmai': 'hotmail',
      'outlok': 'outlook',
      'outloo': 'outlook'
    };

    for (const [typo, correct] of Object.entries(commonTypos)) {
      if (this._value.includes(typo)) {
        suggestions.push(this._value.replace(typo, correct));
      }
    }

    // Suggest removing extra dots
    if ((this._value.match(/\./g) || []).length > 2) {
      const cleaned = this._value.replace(/\.{2,}/g, '.');
      if (cleaned !== this._value) {
        suggestions.push(cleaned);
      }
    }

    return [...new Set(suggestions)]; // Remove duplicates
  }

  /**
   * Clone this Email instance
   */
  clone(): Email {
    return new Email(this._value);
  }

  /**
   * String representation
   */
  toString(): string {
    return this._value;
  }

  /**
   * JSON representation
   */
  toJSON(): string {
    return this._value;
  }

  /**
   * Validate email format
   */
  private static validateEmail(email: string): string[] {
    const errors: string[] = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
      return errors;
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (trimmedEmail.length === 0) {
      errors.push('Email cannot be empty');
      return errors;
    }

    if (trimmedEmail.length > 254) {
      errors.push('Email is too long (max 254 characters)');
    }

    if (!Email.EMAIL_REGEX.test(trimmedEmail)) {
      errors.push('Invalid email format');
    }

    const atIndex = trimmedEmail.indexOf('@');
    const dotIndex = trimmedEmail.lastIndexOf('.');

    if (atIndex === 0) {
      errors.push('Email cannot start with @');
    }

    if (atIndex === trimmedEmail.length - 1) {
      errors.push('Email cannot end with @');
    }

    if (atIndex !== trimmedEmail.lastIndexOf('@')) {
      errors.push('Email can only contain one @ symbol');
    }

    if (dotIndex < atIndex) {
      errors.push('Email must have a domain extension after @');
    }

    const domain = trimmedEmail.substring(atIndex + 1);
    if (domain.length > 63) {
      errors.push('Domain part is too long (max 63 characters)');
    }

    const username = trimmedEmail.substring(0, atIndex);
    if (username.length > 64) {
      errors.push('Username part is too long (max 64 characters)');
    }

    // Check for consecutive dots
    if (trimmedEmail.includes('..')) {
      errors.push('Email cannot contain consecutive dots');
    }

    // Check for invalid characters
    const invalidChars = /[<>()[\]\\.,;:"']/;
    if (invalidChars.test(trimmedEmail)) {
      errors.push('Email contains invalid characters');
    }

    return errors;
  }

  /**
   * Create Email from JSON
   */
  static fromJSON(json: string): Email {
    return new Email(json);
  }

  /**
   * Extract domain from multiple emails and get the most common one
   */
  static getMostCommonDomain(emails: Email[]): string | null {
    if (emails.length === 0) return null;

    const domainCount = new Map<string, number>();

    emails.forEach(email => {
      const domain = email.domain;
      domainCount.set(domain, (domainCount.get(domain) || 0) + 1);
    });

    let maxCount = 0;
    let mostCommonDomain = '';

    for (const [domain, count] of domainCount) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonDomain = domain;
      }
    }

    return mostCommonDomain || null;
  }

  /**
   * Group emails by domain
   */
  static groupByDomain(emails: Email[]): Map<string, Email[]> {
    const groups = new Map<string, Email[]>();

    emails.forEach(email => {
      const domain = email.domain;
      if (!groups.has(domain)) {
        groups.set(domain, []);
      }
      groups.get(domain)!.push(email);
    });

    return groups;
  }

  /**
   * Filter out disposable emails
   */
  static filterNonDisposable(emails: Email[]): Email[] {
    return emails.filter(email => !email.isDisposable());
  }

  /**
   * Filter only business emails
   */
  static filterBusiness(emails: Email[]): Email[] {
    return emails.filter(email => email.isBusinessEmail());
  }
}