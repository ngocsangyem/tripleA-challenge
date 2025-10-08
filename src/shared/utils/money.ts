/**
 * Format money string for display
 * @param value - Money value as string (e.g., "100.23344")
 * @returns Formatted string (e.g., "$100.23")
 */
export const formatMoney = (value: string): string => {
  const numValue = parseFloat(value);

  if (isNaN(numValue)) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  }).format(numValue);
};

/**
 * Validate if a string is a valid money amount
 * @param value - String to validate
 * @returns true if valid money format
 */
export const isValidMoneyAmount = (value: string): boolean => {
  if (!value || value.trim() === '') {
    return false;
  }

  // Match positive decimal numbers with optional decimal places
  // Must have digits after decimal point if decimal exists
  const moneyRegex = /^\d+(\.\d+)?$/;

  if (!moneyRegex.test(value.trim())) {
    return false;
  }

  const numValue = parseFloat(value);

  // Must be a valid number and positive
  return !isNaN(numValue) && numValue > 0;
};

/**
 * Parse user input into a valid money string
 * @param input - User input string
 * @returns Cleaned money string or empty string if invalid
 */
export const parseMoneyInput = (input: string): string => {
  if (!input) {
    return '';
  }

  // Remove any non-numeric characters except decimal point
  const cleaned = input.replace(/[^\d.]/g, '');

  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }

  return cleaned;
};

/**
 * Check if amount is greater than zero
 * @param value - Money amount as string
 * @returns true if amount > 0
 */
export const isPositiveAmount = (value: string): boolean => {
  const numValue = parseFloat(value);
  return !isNaN(numValue) && numValue > 0;
};

/**
 * Validate account ID
 * @param value - Account ID as string
 * @returns true if valid positive integer
 */
export const isValidAccountId = (value: string): boolean => {
  if (!value || value.trim() === '') {
    return false;
  }

  // Check if the string contains a decimal point - account IDs must be integers
  if (value.includes('.')) {
    return false;
  }

  const numValue = parseInt(value, 10);
  return !isNaN(numValue) && numValue > 0 && Number.isInteger(numValue);
};
