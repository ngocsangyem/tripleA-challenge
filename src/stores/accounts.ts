import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { createAccount as createAccountApi, getAccountBalance } from '@/shared/api';
import type { Account, CreateAccountPayload } from '@/shared/types';

export const useAccountsStore = defineStore('accounts', () => {
  // State
  const accounts = ref<Map<number, Account>>(new Map());
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const accountsList = computed(() => Array.from(accounts.value.values()));
  const hasAccounts = computed(() => accounts.value.size > 0);
  const accountCount = computed(() => accounts.value.size);

  const getAccount = (accountId: number): Account | undefined => {
    return accounts.value.get(accountId);
  };

  const getAccountBalanceValue = (accountId: number): string | undefined => {
    const account = accounts.value.get(accountId);
    return account?.balance;
  };

  // Actions
  const createAccount = async (payload: CreateAccountPayload): Promise<Account> => {
    loading.value = true;
    error.value = null;

    try {
      const account = await createAccountApi(payload);
      accounts.value.set(account.account_id, account);
      return account;
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to create account';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchAccountBalance = async (accountId: number): Promise<Account> => {
    loading.value = true;
    error.value = null;

    try {
      const account = await getAccountBalance(accountId);
      accounts.value.set(account.account_id, account);
      return account;
    } catch (err: unknown) {
      error.value = (err as Error).message || 'Failed to fetch account balance';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateAccountBalance = (accountId: number, newBalance: string): void => {
    const account = accounts.value.get(accountId);
    if (account) {
      accounts.value.set(accountId, { ...account, balance: newBalance });
    }
  };

  const clearAccounts = (): void => {
    accounts.value.clear();
    error.value = null;
  };

  const clearError = (): void => {
    error.value = null;
  };

  return {
    accounts,
    loading,
    error,
    accountsList,
    hasAccounts,
    accountCount,
    getAccount,
    getAccountBalanceValue,
    createAccount,
    fetchAccountBalance,
    updateAccountBalance,
    clearAccounts,
    clearError,
  };
});
