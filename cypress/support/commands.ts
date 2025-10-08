/// <reference types="cypress" />

/**
 * Custom Cypress Commands for TripleA Financial Application
 * Following best practices from Cypress documentation
 */

/**
 * Generate a unique account ID using timestamp
 * This helps avoid conflicts in tests since the backend persists data
 */
export const generateUniqueId = () => {
  return Date.now().toString().slice(-8)
}

/**
 * Get element by data-cy attribute (Best Practice)
 * @example cy.getBySel('create-account-form-card')
 */
Cypress.Commands.add('getBySel', (selector: string, ...args) => {
  return cy.get(`[data-cy=${selector}]`, ...args)
})

/**
 * Get element by partial data-cy attribute match
 * @example cy.getBySelLike('account')
 */
Cypress.Commands.add('getBySelLike', (selector: string, ...args) => {
  return cy.get(`[data-cy*=${selector}]`, ...args)
})

/**
 * Create a new account via UI
 * @param accountId - Account ID (positive integer)
 * @param initialBalance - Initial balance (decimal string)
 */
Cypress.Commands.add('createAccount', (accountId: string, initialBalance: string) => {
  cy.getBySel('create-account-form-account-id-input').clear().type(accountId)
  cy.getBySel('create-account-form-initial-balance-input').clear().type(initialBalance)
  cy.getBySel('create-account-form-submit-button').click()
  
  // Wait for success toast
  cy.contains('Account created successfully!', { timeout: 10000 }).should('be.visible')
  cy.wait(2000) // Allow toast to settle
})

/**
 * Check account balance via UI
 * @param accountId - Account ID to check
 * @param expectedBalance - Expected balance to verify (optional)
 */
Cypress.Commands.add('checkBalance', (accountId: string, expectedBalance?: string) => {
  cy.getBySel('account-balance-viewer-account-id-input').clear().type(accountId)
  cy.getBySel('account-balance-viewer-submit-button').click()
  
  if (expectedBalance) {
    cy.getBySel('account-balance-viewer-balance-display', { timeout: 10000 })
      .should('contain', expectedBalance)
  }
})

/**
 * Transfer funds between accounts via UI
 * @param sourceAccountId - Source account ID
 * @param destinationAccountId - Destination account ID
 * @param amount - Amount to transfer
 */
Cypress.Commands.add('transferFunds', (
  sourceAccountId: string,
  destinationAccountId: string,
  amount: string
) => {
  cy.getBySel('transfer-form-source-account-input').clear().type(sourceAccountId)
  cy.getBySel('transfer-form-destination-account-input').clear().type(destinationAccountId)
  cy.getBySel('transfer-form-amount-input').clear().type(amount)
  cy.getBySel('transfer-form-submit-button').click()
  
  // Wait for success toast
  cy.contains('Transfer completed successfully!', { timeout: 10000 }).should('be.visible')
  cy.wait(2000) // Allow toast to settle
})

/**
 * Wait for toast notification with specific text
 * @param text - Text to look for in toast
 * @param shouldExist - Whether toast should exist (default: true)
 */
Cypress.Commands.add('waitForToast', (text: string, shouldExist = true) => {
  if (shouldExist) {
    cy.contains(text, { timeout: 10000 }).should('be.visible')
  } else {
    cy.contains(text).should('not.exist')
  }
})

// TypeScript declarations for custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Get element by data-cy attribute
       * @example cy.getBySel('create-account-form-card')
       */
      getBySel(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>
      
      /**
       * Get element by partial data-cy attribute match
       * @example cy.getBySelLike('account')
       */
      getBySelLike(selector: string, ...args: any[]): Chainable<JQuery<HTMLElement>>
      
      /**
       * Create a new account via UI
       */
      createAccount(accountId: string, initialBalance: string): Chainable<void>
      
      /**
       * Check account balance via UI
       */
      checkBalance(accountId: string, expectedBalance?: string): Chainable<void>
      
      /**
       * Transfer funds between accounts via UI
       */
      transferFunds(
        sourceAccountId: string,
        destinationAccountId: string,
        amount: string
      ): Chainable<void>
      
      /**
       * Wait for toast notification
       */
      waitForToast(text: string, shouldExist?: boolean): Chainable<void>
    }
  }
}
