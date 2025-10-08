import { apiClient } from './client';
import type { Transaction } from '@/shared/types';

/**
 * Execute an internal transfer between accounts
 * @param payload - Transaction payload with source, destination, and amount
 * @returns Executed transaction details
 */
export const executeTransfer = async (payload: Transaction): Promise<Transaction> => {
  const response = await apiClient.post<Transaction>('/transactions', payload);
  return response.data;
};
