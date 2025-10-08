/**
 * Transaction entity for transferring funds between accounts
 * Amount is stored as string to preserve decimal precision
 */
export type Transaction = {
  source_account_id: number;
  destination_account_id: number;
  amount: string;
};

/**
 * Transaction form state
 */
export type TransactionFormState = {
  source_account_id: string;
  destination_account_id: string;
  amount: string;
};

/**
 * Transaction result with timestamp
 */
export type TransactionResult = Transaction & {
  timestamp?: string;
};
