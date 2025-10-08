<script setup lang="ts">
import { CreateAccountForm, AccountBalanceViewer } from '@/features/accounts/components'
import { TransferForm } from '@/features/transactions/components'
import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Building2, UserPlus, ArrowRightLeft } from 'lucide-vue-next'
import { useUiStore } from '@/stores/ui'
import { storeToRefs } from 'pinia'
import 'vue-sonner/style.css'

const uiStore = useUiStore()
const { createAccountDialogOpen, transferDialogOpen } = storeToRefs(uiStore)

const handleAccountCreated = () => {
  uiStore.closeCreateAccountDialog()
}

const handleTransferCompleted = () => {
  uiStore.closeTransferDialog()
}
</script>

<template>
  <Toaster position="top-right" richColors />
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <!-- Mobile: Stack layout, Desktop: Side-by-side -->
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <!-- Logo and Title -->
          <div class="flex items-center gap-3">
            <div
              class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600"
            >
              <Building2 class="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">TripleA Financial</h1>
              <p class="text-sm text-gray-600">Account Management & Transfers</p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Create Account Dialog -->
            <Dialog v-model:open="createAccountDialogOpen">
              <DialogTrigger as-child>
                <Button data-cy="open-create-account-dialog" variant="default" class="gap-2">
                  <UserPlus class="h-4 w-4" />
                  New Account
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[500px]" data-cy="create-account-dialog">
                <DialogHeader>
                  <DialogTitle>Create New Account</DialogTitle>
                  <DialogDescription>
                    Set up a new account with an initial balance for transfers
                  </DialogDescription>
                </DialogHeader>
                <CreateAccountForm @accountCreated="handleAccountCreated" />
              </DialogContent>
            </Dialog>

            <!-- Transfer Funds Dialog -->
            <Dialog v-model:open="transferDialogOpen">
              <DialogTrigger as-child>
                <Button data-cy="open-transfer-dialog" variant="default" class="gap-2">
                  <ArrowRightLeft class="h-4 w-4" />
                  Transfer Funds
                </Button>
              </DialogTrigger>
              <DialogContent class="sm:max-w-[500px]" data-cy="transfer-dialog">
                <DialogHeader>
                  <DialogTitle>Transfer Funds</DialogTitle>
                  <DialogDescription> Move money between your accounts </DialogDescription>
                </DialogHeader>
                <TransferForm @transferCompleted="handleTransferCompleted" />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
      <section>
        <div class="mb-8 text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Check Account Balance</h2>
          <p class="text-gray-600">View the current balance of any account</p>
        </div>

        <div class="max-w-xl mx-auto">
          <AccountBalanceViewer />
        </div>
      </section>
    </main>
  </div>
</template>
