import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  // Dialog states
  const createAccountDialogOpen = ref(false)
  const transferDialogOpen = ref(false)

  // Loading states for different operations
  const isCreatingAccount = ref(false)
  const isFetchingBalance = ref(false)
  const isTransferring = ref(false)

  // Actions for dialogs
  const openCreateAccountDialog = (): void => {
    createAccountDialogOpen.value = true
  }

  const closeCreateAccountDialog = (): void => {
    createAccountDialogOpen.value = false
  }

  const openTransferDialog = (): void => {
    transferDialogOpen.value = true
  }

  const closeTransferDialog = (): void => {
    transferDialogOpen.value = false
  }

  const toggleCreateAccountDialog = (): void => {
    createAccountDialogOpen.value = !createAccountDialogOpen.value
  }

  const toggleTransferDialog = (): void => {
    transferDialogOpen.value = !transferDialogOpen.value
  }

  // Actions for loading states
  const setCreatingAccount = (value: boolean): void => {
    isCreatingAccount.value = value
  }

  const setFetchingBalance = (value: boolean): void => {
    isFetchingBalance.value = value
  }

  const setTransferring = (value: boolean): void => {
    isTransferring.value = value
  }

  return {
    // Dialog states
    createAccountDialogOpen,
    transferDialogOpen,

    // Loading states
    isCreatingAccount,
    isFetchingBalance,
    isTransferring,

    // Dialog actions
    openCreateAccountDialog,
    closeCreateAccountDialog,
    openTransferDialog,
    closeTransferDialog,
    toggleCreateAccountDialog,
    toggleTransferDialog,

    // Loading actions
    setCreatingAccount,
    setFetchingBalance,
    setTransferring,
  }
})
