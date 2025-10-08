<script setup lang="ts">
import { CreateAccountForm, AccountBalanceViewer } from '@/features/accounts/components'
import { TransferForm } from '@/features/transactions/components'
import { Building2 } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="border-b border-gray-200 bg-white shadow-sm">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
            <Building2 class="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">TripleA Financial</h1>
            <p class="text-sm text-gray-600">Account Management & Transfers</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8 space-y-12">
      <!-- Account Management Section -->
      <section>
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Account Management</h2>
          <p class="text-gray-600">Create accounts and check balances for internal transfers</p>
        </div>

        <div class="grid gap-6 md:grid-cols-2 lg:gap-8">
          <CreateAccountForm />
          <AccountBalanceViewer />
        </div>
      </section>

      <!-- Transfers Section -->
      <section>
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Internal Transfers</h2>
          <p class="text-gray-600">Transfer funds between your accounts</p>
        </div>

        <div class="max-w-2xl mx-auto">
          <TransferForm />
        </div>
      </section>
    </main>
  </div>
</template>
