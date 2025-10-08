import { describe, it, expect } from 'vitest'
import { required, moneyAmount, accountId, differentFrom } from '../validation'

describe('Validation Rules', () => {
  describe('required', () => {
    it('should pass for non-empty strings', () => {
      expect(required('test')).toBe(true)
      expect(required('123')).toBe(true)
      expect(required('a')).toBe(true)
    })

    it('should fail for empty values', () => {
      // vee-validate's required returns false for invalid, not an error message
      expect(required('')).toBe(false)
      expect(required('   ')).toBe(false)
      expect(required(null)).toBe(false)
      expect(required(undefined)).toBe(false)
    })

    it('should handle different value types', () => {
      // vee-validate's required accepts truthy values
      expect(required(0)).toBe(true) // 0 is considered valid in vee-validate
      expect(required(false)).toBe(false) // false is falsy
      expect(required('0')).toBe(true) // string '0' is truthy
    })
  })

  describe('moneyAmount', () => {
    it('should pass for valid positive amounts', () => {
      expect(moneyAmount('100')).toBe(true)
      expect(moneyAmount('100.50')).toBe(true)
      expect(moneyAmount('0.01')).toBe(true)
      expect(moneyAmount('1234.56789')).toBe(true)
    })

    it('should fail for empty values', () => {
      expect(moneyAmount('')).toBe('Amount is required')
      expect(moneyAmount(null)).toBe('Amount is required')
      expect(moneyAmount(undefined)).toBe('Amount is required')
    })

    it('should fail for non-string values', () => {
      expect(moneyAmount(100)).toBe('Amount must be a valid number')
      expect(moneyAmount(100.5)).toBe('Amount must be a valid number')
    })

    it('should fail for invalid money formats', () => {
      const result = moneyAmount('abc')
      expect(result).toBe('Please enter a valid amount (e.g., 100.50)')
    })

    it('should fail for zero', () => {
      const result = moneyAmount('0')
      expect(result).toBe('Please enter a valid amount (e.g., 100.50)')
    })

    it('should fail for negative amounts', () => {
      const result = moneyAmount('-100')
      expect(result).toBe('Please enter a valid amount (e.g., 100.50)')
    })

    it('should fail for amounts with currency symbols', () => {
      const result = moneyAmount('$100')
      expect(result).toBe('Please enter a valid amount (e.g., 100.50)')
    })
  })

  describe('accountId', () => {
    it('should pass for valid positive integers', () => {
      expect(accountId('1')).toBe(true)
      expect(accountId('123')).toBe(true)
      expect(accountId('999999')).toBe(true)
    })

    it('should fail for empty values', () => {
      expect(accountId('')).toBe('Account ID is required')
      expect(accountId(null)).toBe('Account ID is required')
      expect(accountId(undefined)).toBe('Account ID is required')
    })

    it('should fail for non-string values', () => {
      // Non-string values fail the type check, which returns empty check first
      expect(accountId(123)).toBe('Account ID must be a valid number')
      expect(accountId(0)).toBe('Account ID is required') // 0 is falsy
    })

    it('should fail for invalid formats', () => {
      const result = accountId('abc')
      expect(result).toBe('Please enter a valid account ID (positive integer)')
    })

    it('should fail for zero', () => {
      const result = accountId('0')
      expect(result).toBe('Please enter a valid account ID (positive integer)')
    })

    it('should fail for negative numbers', () => {
      const result = accountId('-123')
      expect(result).toBe('Please enter a valid account ID (positive integer)')
    })

    it('should fail for decimal numbers', () => {
      expect(accountId('123.45')).toBe('Please enter a valid account ID (positive integer)')
      expect(accountId('1.0')).toBe('Please enter a valid account ID (positive integer)')
    })
  })

  describe('differentFrom', () => {
    it('should pass when values are different', () => {
      const validator = differentFrom('123')
      expect(validator('456')).toBe(true)
      expect(validator('789')).toBe(true)
      expect(validator('1')).toBe(true)
    })

    it('should fail when values are the same', () => {
      const validator = differentFrom('123')
      expect(validator('123')).toBe('Source and destination accounts must be different')
    })

    it('should fail for non-string values', () => {
      const validator = differentFrom('123')
      expect(validator(123)).toBe('Invalid value')
      expect(validator(null)).toBe('Invalid value')
      expect(validator(undefined)).toBe('Invalid value')
    })

    it('should work with different reference values', () => {
      const validator1 = differentFrom('100')
      const validator2 = differentFrom('200')

      expect(validator1('100')).toBe('Source and destination accounts must be different')
      expect(validator1('200')).toBe(true)

      expect(validator2('200')).toBe('Source and destination accounts must be different')
      expect(validator2('100')).toBe(true)
    })

    it('should be case sensitive', () => {
      const validator = differentFrom('abc')
      expect(validator('ABC')).toBe(true)
      expect(validator('abc')).toBe('Source and destination accounts must be different')
    })
  })
})
