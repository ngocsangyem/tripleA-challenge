/**
 * Account entity representing a financial account
 * Balance is stored as string to preserve decimal precision
 */
export type Account = {
  account_id: number
  balance: string
}

/**
 * Payload for creating a new account
 */
export type CreateAccountPayload = {
  account_id: number
  initial_balance: string
}

/**
 * Account creation form state
 */
export type AccountFormState = {
  account_id: string
  initial_balance: string
}
