import { describe, it, expect } from 'vitest'
import {
  formatMoney,
  isValidMoneyAmount,
  parseMoneyInput,
  isPositiveAmount,
  isValidAccountId,
} from '../money'

describe('Money Utilities', () => {
  describe('formatMoney', () => {
    it('should format positive amounts correctly', () => {
      expect(formatMoney('100.50')).toBe('$100.50')
      expect(formatMoney('1000')).toBe('$1,000.00')
      expect(formatMoney('1234.56789')).toBe('$1,234.56789')
    })

    it('should handle zero', () => {
      expect(formatMoney('0')).toBe('$0.00')
      expect(formatMoney('0.00')).toBe('$0.00')
    })

    it('should handle decimal precision', () => {
      expect(formatMoney('100.12345')).toBe('$100.12345')
      expect(formatMoney('0.01')).toBe('$0.01')
    })

    it('should handle invalid input gracefully', () => {
      expect(formatMoney('invalid')).toBe('$0.00')
      expect(formatMoney('')).toBe('$0.00')
    })

    it('should handle large numbers', () => {
      expect(formatMoney('1000000.50')).toBe('$1,000,000.50')
      expect(formatMoney('999999999.99')).toBe('$999,999,999.99')
    })
  })

  describe('isValidMoneyAmount', () => {
    it('should accept valid positive amounts', () => {
      expect(isValidMoneyAmount('100')).toBe(true)
      expect(isValidMoneyAmount('100.50')).toBe(true)
      expect(isValidMoneyAmount('0.01')).toBe(true)
      expect(isValidMoneyAmount('1234.56789')).toBe(true)
    })

    it('should reject zero', () => {
      expect(isValidMoneyAmount('0')).toBe(false)
      expect(isValidMoneyAmount('0.00')).toBe(false)
    })

    it('should reject negative amounts', () => {
      expect(isValidMoneyAmount('-100')).toBe(false)
      expect(isValidMoneyAmount('-0.01')).toBe(false)
    })

    it('should reject empty or invalid strings', () => {
      expect(isValidMoneyAmount('')).toBe(false)
      expect(isValidMoneyAmount('   ')).toBe(false)
      expect(isValidMoneyAmount('abc')).toBe(false)
      expect(isValidMoneyAmount('$100')).toBe(false)
    })

    it('should reject multiple decimal points', () => {
      expect(isValidMoneyAmount('100..50')).toBe(false)
      expect(isValidMoneyAmount('100.50.25')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isValidMoneyAmount('.')).toBe(false)
      expect(isValidMoneyAmount('.5')).toBe(false)
      // Trailing decimal without digits is invalid per regex /^\d+(\.\d+)?$/
      expect(isValidMoneyAmount('100.')).toBe(false)
    })
  })

  describe('parseMoneyInput', () => {
    it('should clean currency symbols', () => {
      expect(parseMoneyInput('$100')).toBe('100')
      expect(parseMoneyInput('$100.50')).toBe('100.50')
    })

    it('should remove non-numeric characters except decimal', () => {
      expect(parseMoneyInput('abc123.45')).toBe('123.45')
      expect(parseMoneyInput('1,000.50')).toBe('1000.50')
      expect(parseMoneyInput('100 dollars')).toBe('100')
    })

    it('should handle multiple decimal points', () => {
      expect(parseMoneyInput('100.50.25')).toBe('100.5025')
    })

    it('should handle empty input', () => {
      expect(parseMoneyInput('')).toBe('')
      expect(parseMoneyInput('   ')).toBe('')
    })

    it('should preserve single decimal point', () => {
      expect(parseMoneyInput('100.50')).toBe('100.50')
      expect(parseMoneyInput('0.01')).toBe('0.01')
    })
  })

  describe('isPositiveAmount', () => {
    it('should accept positive amounts', () => {
      expect(isPositiveAmount('100')).toBe(true)
      expect(isPositiveAmount('0.01')).toBe(true)
      expect(isPositiveAmount('1234.56')).toBe(true)
    })

    it('should reject zero', () => {
      expect(isPositiveAmount('0')).toBe(false)
      expect(isPositiveAmount('0.00')).toBe(false)
    })

    it('should reject negative amounts', () => {
      expect(isPositiveAmount('-100')).toBe(false)
      expect(isPositiveAmount('-0.01')).toBe(false)
    })

    it('should reject invalid strings', () => {
      expect(isPositiveAmount('abc')).toBe(false)
      expect(isPositiveAmount('')).toBe(false)
    })
  })

  describe('isValidAccountId', () => {
    it('should accept positive integers', () => {
      expect(isValidAccountId('1')).toBe(true)
      expect(isValidAccountId('123')).toBe(true)
      expect(isValidAccountId('999999')).toBe(true)
    })

    it('should reject zero', () => {
      expect(isValidAccountId('0')).toBe(false)
    })

    it('should reject negative numbers', () => {
      expect(isValidAccountId('-1')).toBe(false)
      expect(isValidAccountId('-123')).toBe(false)
    })

    it('should reject decimals', () => {
      expect(isValidAccountId('123.45')).toBe(false)
      expect(isValidAccountId('1.0')).toBe(false)
    })

    it('should reject empty or invalid strings', () => {
      expect(isValidAccountId('')).toBe(false)
      expect(isValidAccountId('   ')).toBe(false)
      expect(isValidAccountId('abc')).toBe(false)
    })
  })
})
