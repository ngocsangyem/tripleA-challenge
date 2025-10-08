/**
 * Comprehensive E2E Tests for TripleA Financial Application
 * 
 * These tests use unique account IDs to avoid conflicts with backend state.
 * Tests are self-contained and can run independently.
 */

describe('TripleA Financial - Complete Workflows', () => {
  // Generate unique account IDs using timestamp
  const generateId = (suffix: string) => {
    return `${Date.now()}${suffix}`.slice(-9) // 9-digit unique ID
  }

  beforeEach(() => {
    cy.visit('/')
  })

  describe('Account Management', () => {
    it('should create a new account successfully', () => {
      const accountId = generateId('1')
      
      // Open create account dialog
      cy.getBySel('open-create-account-dialog').click()
      cy.wait(300) // Allow dialog to open
      
      // Wait for form to be visible
      cy.getBySel('create-account-form-account-id-input', { timeout: 5000 }).should('be.visible')

      // Fill form
      cy.getBySel('create-account-form-account-id-input').type(accountId)
      cy.getBySel('create-account-form-initial-balance-input').type('5000')
      cy.getBySel('create-account-form-submit-button').click()

      // Wait for success toast
      cy.contains('Account created successfully!', { timeout: 10000 }).should('be.visible')
      
      // Dialog should close (form inputs no longer exist)
      cy.wait(500) // Allow dialog close animation
      cy.getBySel('create-account-form-account-id-input').should('not.exist')
    })

    it('should check account balance', () => {
      const accountId = generateId('2')
      
      // Create account first
      cy.createAccount(accountId, '7500')
      
      // Check balance
      cy.getBySel('account-balance-viewer-account-id-input').type(accountId)
      cy.getBySel('account-balance-viewer-submit-button').click()

      // Verify balance display
      cy.getBySel('account-balance-viewer-balance-display', { timeout: 10000 })
        .should('be.visible')
        .and('contain', '$7,500.00')
    })

    it('should show UI elements correctly', () => {
      // Verify dialog trigger buttons exist
      cy.getBySel('open-create-account-dialog').should('be.visible')
      cy.getBySel('open-transfer-dialog').should('be.visible')
      cy.getBySel('account-balance-viewer-card').should('be.visible')
    })
  })

  describe('Fund Transfers', () => {
    it('should transfer funds between accounts', () => {
      const sourceId = generateId('3')
      const destId = generateId('4')
      
      // Create two accounts
      cy.createAccount(sourceId, '10000')
      cy.createAccount(destId, '5000')

      // Open transfer dialog
      cy.getBySel('open-transfer-dialog').click()
      cy.wait(300) // Allow dialog to open
      
      // Wait for form to be visible
      cy.getBySel('transfer-form-source-account-input', { timeout: 5000 }).should('be.visible')

      // Perform transfer
      cy.getBySel('transfer-form-source-account-input').type(sourceId)
      cy.getBySel('transfer-form-destination-account-input').type(destId)
      cy.getBySel('transfer-form-amount-input').type('2500')
      cy.getBySel('transfer-form-submit-button').click()

      // Verify success toast
      cy.contains('Transfer completed successfully!', { timeout: 10000 }).should('be.visible')

      // Dialog should close (form no longer exists)
      cy.wait(500) // Allow dialog close animation
      cy.getBySel('transfer-form-source-account-input').should('not.exist')
    })

    it('should handle multiple transfers correctly', () => {
      const account1 = generateId('5')
      const account2 = generateId('6')
      
      // Set up accounts
      cy.createAccount(account1, '20000')
      cy.createAccount(account2, '10000')

      // First transfer: account1 -> account2
      cy.transferFunds(account1, account2, '5000')

      // Verify updated balance
      cy.checkBalance(account1, '$15,000.00')
      cy.checkBalance(account2, '$15,000.00')

      // Second transfer: account2 -> account1
      cy.transferFunds(account2, account1, '3000')

      // Verify final balances
      cy.checkBalance(account1, '$18,000.00')
      cy.checkBalance(account2, '$12,000.00')
    })

    it('should handle complex multi-account scenario', () => {
      const acc1 = generateId('7')
      const acc2 = generateId('8')
      const acc3 = generateId('9')

      // Create accounts
      cy.createAccount(acc1, '50000')
      cy.createAccount(acc2, '30000')
      cy.createAccount(acc3, '20000')

      // Multiple transfers
      cy.transferFunds(acc1, acc2, '10000') // acc1: 40000, acc2: 40000
      cy.transferFunds(acc1, acc3, '5000')  // acc1: 35000, acc3: 25000
      cy.transferFunds(acc2, acc3, '8000')  // acc2: 32000, acc3: 33000

      // Verify final balances
      cy.checkBalance(acc1, '$35,000.00')
      cy.checkBalance(acc2, '$32,000.00')
      cy.checkBalance(acc3, '$33,000.00')
    })
  })

  describe('Form Validation', () => {
    it('should prevent account creation with invalid account ID', () => {
      // Open dialog
      cy.getBySel('open-create-account-dialog').click()
      
      // Wait for form to be visible
      cy.getBySel('create-account-form-account-id-input', { timeout: 5000 }).should('be.visible')

      // Try invalid input
      cy.getBySel('create-account-form-account-id-input').type('abc')
      cy.getBySel('create-account-form-initial-balance-input').type('1000')
      cy.getBySel('create-account-form-submit-button').click()

      // Form should not submit successfully (no success toast)
      cy.contains('Account created successfully!').should('not.exist')
      
      // Dialog should still be open (form still visible)
      cy.getBySel('create-account-form-account-id-input').should('be.visible')
    })

    it('should prevent negative amount transfers', () => {
      const acc1 = generateId('11')
      const acc2 = generateId('12')
      
      cy.createAccount(acc1, '10000')
      cy.createAccount(acc2, '5000')

      // Open transfer dialog
      cy.getBySel('open-transfer-dialog').click()
      
      // Wait for form to be visible
      cy.getBySel('transfer-form-source-account-input', { timeout: 5000 }).should('be.visible')

      cy.getBySel('transfer-form-source-account-input').type(acc1)
      cy.getBySel('transfer-form-destination-account-input').type(acc2)
      cy.getBySel('transfer-form-amount-input').type('-500')
      cy.getBySel('transfer-form-submit-button').click()

      // Should not show success toast
      cy.contains('Transfer completed successfully!').should('not.exist')
      
      // Dialog should still be open (form still visible)
      cy.getBySel('transfer-form-source-account-input').should('be.visible')
    })
  })

  describe('UI Elements', () => {
    it('should have all required form elements', () => {
      // Verify dialog trigger buttons
      cy.getBySel('open-create-account-dialog').should('be.visible')
      cy.getBySel('open-transfer-dialog').should('be.visible')
      
      // Verify balance viewer is visible
      cy.getBySel('account-balance-viewer-account-id-input').should('exist')
      cy.getBySel('account-balance-viewer-submit-button').should('exist')

      // Verify create account dialog elements
      cy.getBySel('open-create-account-dialog').click()
      cy.getBySel('create-account-form-account-id-input').should('exist')
      cy.getBySel('create-account-form-initial-balance-input').should('exist')
      cy.getBySel('create-account-form-submit-button').should('exist')
      cy.get('body').type('{esc}') // Close dialog

      // Verify transfer dialog elements
      cy.getBySel('open-transfer-dialog').click()
      cy.getBySel('transfer-form-source-account-input').should('exist')
      cy.getBySel('transfer-form-destination-account-input').should('exist')
      cy.getBySel('transfer-form-amount-input').should('exist')
      cy.getBySel('transfer-form-submit-button').should('exist')
      cy.get('body').type('{esc}') // Close dialog
    })
  })
})
