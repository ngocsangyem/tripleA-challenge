/// <reference types="cypress" />

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
 * Create a new account via UI (opens dialog, fills form, submits)
 * @param accountId - Account ID (positive integer)
 * @param initialBalance - Initial balance (decimal string)
 */
Cypress.Commands.add('createAccount', (accountId: string, initialBalance: string) => {
  // Open create account dialog (force click to avoid toast coverage)
  cy.getBySel('open-create-account-dialog').click({ force: true })
  cy.wait(300) // Allow dialog to open
  
  // Wait for form to be visible (dialog opens)
  cy.getBySel('create-account-form-account-id-input', { timeout: 5000 }).should('be.visible')
  
  // Fill and submit form
  cy.getBySel('create-account-form-account-id-input').type(accountId)
  cy.getBySel('create-account-form-initial-balance-input').type(initialBalance)
  cy.getBySel('create-account-form-submit-button').click()
  
  // Wait for success toast and dialog to close
  cy.contains('Account created successfully!', { timeout: 10000 }).should('be.visible')
  cy.wait(500) // Allow dialog close animation
  cy.getBySel('create-account-form-account-id-input').should('not.exist')
  cy.wait(2000) // Allow toast to fully disappear
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
 * Transfer funds between accounts via UI (opens dialog, fills form, submits)
 * @param sourceAccountId - Source account ID
 * @param destinationAccountId - Destination account ID
 * @param amount - Amount to transfer
 */
Cypress.Commands.add('transferFunds', (
  sourceAccountId: string,
  destinationAccountId: string,
  amount: string
) => {
  // Open transfer dialog (force click to avoid toast coverage)
  cy.getBySel('open-transfer-dialog').click({ force: true })
  cy.wait(300) // Allow dialog to open
  
  // Wait for form to be visible (dialog opens)
  cy.getBySel('transfer-form-source-account-input', { timeout: 5000 }).should('be.visible')
  
  // Fill and submit form
  cy.getBySel('transfer-form-source-account-input').type(sourceAccountId)
  cy.getBySel('transfer-form-destination-account-input').type(destinationAccountId)
  cy.getBySel('transfer-form-amount-input').type(amount)
  cy.getBySel('transfer-form-submit-button').click()
  
  // Wait for success toast and dialog to close
  cy.contains('Transfer completed successfully!', { timeout: 10000 }).should('be.visible')
  cy.wait(500) // Allow dialog close animation
  cy.getBySel('transfer-form-source-account-input').should('not.exist')
  cy.wait(2000) // Allow toast to fully disappear
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
