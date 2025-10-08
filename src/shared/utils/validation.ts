import { isValidMoneyAmount, isValidAccountId } from './money';
import { required as requiredRule } from '@vee-validate/rules';

export const required = requiredRule;

/**
 * Validates that the value is a positive decimal number in string format
 */
export const moneyAmount = (value: unknown): string | boolean => {
  if (!value) {
    return 'Amount is required';
  }

  if (typeof value !== 'string') {
    return 'Amount must be a valid number';
  }

  if (!isValidMoneyAmount(value)) {
    return 'Please enter a valid amount (e.g., 100.50)';
  }

  return true;
};

/**
 * Validates that the value is a positive integer in string format
 */
export const accountId = (value: unknown): string | boolean => {
  if (!value) {
    return 'Account ID is required';
  }

  if (typeof value !== 'string') {
    return 'Account ID must be a valid number';
  }

  if (!isValidAccountId(value)) {
    return 'Please enter a valid account ID (positive integer)';
  }

  return true;
};

/**
 * Used for transfer validation (source !== destination)
 */
export const differentFrom = (otherValue: string) => {
  return (value: unknown): string | boolean => {
    if (typeof value !== 'string') {
      return 'Invalid value';
    }

    if (value === otherValue) {
      return 'Source and destination accounts must be different';
    }

    return true;
  };
};
