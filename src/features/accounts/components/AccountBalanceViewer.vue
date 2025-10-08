<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { getAccountBalance } from '@/shared/api'
import { required, accountId } from '@/shared/utils/validation'
import { formatMoney } from '@/shared/utils'
import { LoadingSpinner } from '@/shared/ui'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Wallet } from 'lucide-vue-next'
import type { Account } from '@/shared/types'

const accountIdInputRef = ref<HTMLInputElement | null>(null)

const loading = ref(false)
const account = ref<Account | null>(null)

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: {
    account_id: [required, accountId],
  },
})

const [accountIdField, accountIdAttrs] = defineField('account_id')

const onSubmit = handleSubmit(async (values) => {
  loading.value = true
  account.value = null

  try {
    const result = await getAccountBalance(Number(values.account_id))
    account.value = result
    
    toast.success('Balance retrieved successfully', {
      description: `Account #${result.account_id}: ${formatMoney(result.balance)}`,
    })
  } catch (err: any) {
    account.value = null
    toast.error('Failed to retrieve balance', {
      description: err.message || 'Account not found or an error occurred',
    })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <Card data-cy="account-balance-viewer-card">
    <CardHeader>
      <CardTitle class="text-2xl">Check Balance</CardTitle>
      <CardDescription>View the current balance of any account</CardDescription>
    </CardHeader>

    <CardContent>
      <form @submit="onSubmit" class="space-y-6">
        <FormField v-slot="{ componentField }" name="account_id">
          <FormItem>
            <FormLabel>Account ID</FormLabel>
            <FormControl>
              <Input
                ref="accountIdInputRef"
                v-bind="{ ...componentField, ...accountIdAttrs }"
                v-model="accountIdField"
                type="text"
                placeholder="e.g., 123"
                :disabled="loading"
                data-cy="account-balance-viewer-account-id-input"
              />
            </FormControl>
            <FormDescription>Enter an account ID to view its balance</FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="account"
            class="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm"
            data-cy="account-balance-viewer-balance-display"
          >
            <div class="flex items-center gap-3 mb-2">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shadow-md">
                <Wallet class="h-5 w-5 text-white" />
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Account #{{ account.account_id }}</p>
                <p class="text-3xl font-bold text-gray-900">
                  {{ formatMoney(account.balance) }}
                </p>
              </div>
            </div>
          </div>
        </Transition>
      </form>
    </CardContent>

    <CardFooter>
      <Button type="submit" :disabled="loading" class="w-full" @click="onSubmit" data-cy="account-balance-viewer-submit-button">
        <LoadingSpinner v-if="loading" class="mr-2 h-4 w-4" />
        <span v-else>Check Balance</span>
      </Button>
    </CardFooter>
  </Card>
</template>
