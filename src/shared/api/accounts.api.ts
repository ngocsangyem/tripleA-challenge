import { apiClient } from './client';
import type { Account, CreateAccountPayload } from '@/shared/types';

/**
 * Create a new account
 * @param payload - Account creation payload with account_id and initial_balance
 * @returns Created account with balance
 */
export const createAccount = async (payload: CreateAccountPayload): Promise<Account> => {
  const response = await apiClient.post<Account>('/accounts', payload);
  return response.data;
};

/**
 * Retrieve account balance by account ID
 * @param accountId - The account ID to retrieve
 * @returns Account with current balance
 */
export const getAccountBalance = async (accountId: number): Promise<Account> => {
  const response = await apiClient.get<Account>(`/accounts/${accountId}`);
  return response.data;
};
