import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { executeTransfer as executeTransferApi } from '@/shared/api'
import type { Transaction } from '@/shared/types'
import { useAccountsStore } from './accounts'

export const useTransactionsStore = defineStore('transactions', () => {
  const accountsStore = useAccountsStore()

  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const transactionCount = computed(() => transactions.value.length)
  const recentTransactions = computed(() => {
    return transactions.value.slice(-10).reverse()
  })

  const getTransactionsByAccount = computed(() => {
    return (accountId: number): Transaction[] => {
      return transactions.value.filter(
        (t) => t.source_account_id === accountId || t.destination_account_id === accountId
      )
    }
  })

  // Actions
  const executeTransfer = async (payload: Transaction): Promise<Transaction> => {
    loading.value = true
    error.value = null

    try {
      const transaction = await executeTransferApi(payload)
      transactions.value.push(transaction)
      
      // Optimistically update balances
      const sourceAccount = accountsStore.getAccount(payload.source_account_id)
      const destAccount = accountsStore.getAccount(payload.destination_account_id)

      if (sourceAccount) {
        const newSourceBalance = (
          parseFloat(sourceAccount.balance) - parseFloat(payload.amount)
        ).toFixed(2)
        accountsStore.updateAccountBalance(payload.source_account_id, newSourceBalance)
      }

      if (destAccount) {
        const newDestBalance = (
          parseFloat(destAccount.balance) + parseFloat(payload.amount)
        ).toFixed(2)
        accountsStore.updateAccountBalance(payload.destination_account_id, newDestBalance)
      }

      return transaction
    } catch (err: any) {
      error.value = err.message || 'Failed to execute transfer'
      throw err
    } finally {
      loading.value = false
    }
  }

  const clearTransactions = (): void => {
    transactions.value = []
    error.value = null
  }

  const clearError = (): void => {
    error.value = null
  }

  return {
    transactions,
    loading,
    error,
    transactionCount,
    recentTransactions,
    getTransactionsByAccount,
    executeTransfer,
    clearTransactions,
    clearError,
  }
})
